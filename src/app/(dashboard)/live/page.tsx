import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoMetricsForRestaurant, sumDemoMetrics } from "@/server/demo/mock-metrics";
import { getDemoOrders } from "@/server/demo/mock-operations";
import { formatMoney } from "@/lib/money";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

export default async function LivePage() {
  const user = await requireUser();
  const { scopedRestaurants, isAll } = await resolveRestaurantScope(user);
  const currency = scopedRestaurants[0]?.currency ?? "CZK";

  const metrics = scopedRestaurants.map((r) => getDemoMetricsForRestaurant(r.id));
  const totals = sumDemoMetrics(metrics);
  const openOrders = scopedRestaurants.flatMap((r) =>
    getDemoOrders(r.id)
      .filter((o) => o.status === "OPEN")
      .map((o) => ({ ...o, restaurantName: r.name, currency: r.currency })),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          {isAll ? "Live · Все рестораны" : `Live · ${scopedRestaurants[0]?.name}`}
        </h1>
        <p className="text-sm text-foreground/50">Обновлено только что</p>
      </div>

      <DemoDataBanner />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <KpiCard label="Closed" value={formatMoney(totals.closedRevenueMinor, currency)} />
        <KpiCard label="Open" value={formatMoney(totals.openOrdersMinor, currency)} />
        <KpiCard
          label="Current"
          value={formatMoney(totals.closedRevenueMinor + totals.openOrdersMinor, currency)}
        />
      </div>

      <div className="rounded-2xl border border-black/5 bg-white">
        <div className="border-b border-black/5 px-4 py-3 text-sm font-medium text-foreground">
          Open orders ({openOrders.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-foreground/40">
                <th className="px-4 py-2 font-medium">Order</th>
                {isAll && <th className="px-4 py-2 font-medium">Restaurant</th>}
                <th className="px-4 py-2 font-medium">Table</th>
                <th className="px-4 py-2 font-medium">Opened</th>
                <th className="px-4 py-2 font-medium">Waiter</th>
                <th className="px-4 py-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {openOrders.map((order) => (
                <tr key={`${order.restaurantName}-${order.id}`} className="border-t border-black/5">
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
                  <td colSpan={isAll ? 6 : 5} className="px-4 py-6 text-center text-foreground/50">
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
