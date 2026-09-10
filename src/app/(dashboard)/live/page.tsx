import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoMetricsForRestaurant, sumDemoMetrics } from "@/server/demo/mock-metrics";
import { getDemoOrders } from "@/server/demo/mock-operations";
import { getDemoTableStatus } from "@/server/demo/mock-tables";
import { formatMoney } from "@/lib/money";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

export default async function LivePage() {
  const user = await requireUser();
  const { scopedRestaurants, isAll } = await resolveRestaurantScope(user);
  const currency = scopedRestaurants[0]?.currency ?? "RUB";

  const metrics = scopedRestaurants.map((r) => getDemoMetricsForRestaurant(r.id));
  const totals = sumDemoMetrics(metrics);
  const openOrders = scopedRestaurants.flatMap((r) =>
    getDemoOrders(r.id)
      .filter((o) => o.status === "OPEN")
      .map((o) => ({ ...o, restaurantName: r.name, currency: r.currency })),
  );

  const tableStatuses = scopedRestaurants.map((r) => getDemoTableStatus(r.id));
  const totalTables = tableStatuses.reduce((s, t) => s + t.totalTables, 0);
  const occupiedTables = tableStatuses.reduce((s, t) => s + t.occupiedTables, 0);
  const occupancyPct = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0;
  const avgTableTimeMinutes =
    tableStatuses.length > 0
      ? Math.round(tableStatuses.reduce((s, t) => s + t.avgTableTimeMinutes, 0) / tableStatuses.length)
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          {isAll ? "Онлайн · Все рестораны" : `Онлайн · ${scopedRestaurants[0]?.name}`}
        </h1>
        <p className="text-sm text-foreground-subtle">Обновлено только что</p>
      </div>

      <DemoDataBanner />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <KpiCard label="Закрыто" value={formatMoney(totals.closedRevenueMinor, currency)} />
        <KpiCard label="Открыто" value={formatMoney(totals.openOrdersMinor, currency)} />
        <KpiCard
          label="Итого сейчас"
          value={formatMoney(totals.closedRevenueMinor + totals.openOrdersMinor, currency)}
        />
        <KpiCard
          label="Занятость столов"
          value={`${occupiedTables} из ${totalTables} (${occupancyPct}%)`}
        />
        <KpiCard label="Среднее время за столом" value={`${avgTableTimeMinutes} мин`} />
      </div>

      <div className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)]">
        <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-foreground">
          Открытые заказы ({openOrders.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-foreground-subtle">
                <th className="px-4 py-2 font-medium">Заказ</th>
                {isAll && <th className="px-4 py-2 font-medium">Ресторан</th>}
                <th className="px-4 py-2 font-medium">Стол</th>
                <th className="px-4 py-2 font-medium">Открыт</th>
                <th className="px-4 py-2 font-medium">Официант</th>
                <th className="px-4 py-2 font-medium">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {openOrders.map((order) => (
                <tr key={`${order.restaurantName}-${order.id}`} className="border-t border-[var(--border)]">
                  <td className="px-4 py-2.5 font-medium text-foreground">{order.id}</td>
                  {isAll && <td className="px-4 py-2.5">{order.restaurantName}</td>}
                  <td className="px-4 py-2.5">{order.table}</td>
                  <td className="px-4 py-2.5 tabular-nums">{order.openedAt}</td>
                  <td className="px-4 py-2.5">{order.employeeName}</td>
                  <td className="px-4 py-2.5 tabular-nums">
                    {formatMoney(order.amountMinor, order.currency)}
                  </td>
                </tr>
              ))}
              {openOrders.length === 0 && (
                <tr>
                  <td colSpan={isAll ? 6 : 5} className="px-4 py-6 text-center text-foreground-subtle">
                    Нет открытых заказов.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
