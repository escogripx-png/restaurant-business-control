import { requireUser } from "@/server/auth/session";
import { getAccessibleRestaurants } from "@/server/restaurants/accessible-restaurants";
import { getSelectedRestaurantId } from "@/server/restaurants/selected-restaurant";
import { ALL_RESTAURANTS } from "@/server/restaurants/constants";
import { getDemoMetricsForRestaurant, sumDemoMetrics } from "@/server/demo/mock-metrics";
import { formatMoney } from "@/lib/money";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireUser();
  const [restaurants, selectedRestaurantId] = await Promise.all([
    getAccessibleRestaurants(user),
    getSelectedRestaurantId(),
  ]);

  const isAll = selectedRestaurantId === ALL_RESTAURANTS || restaurants.every((r) => r.id !== selectedRestaurantId);
  const scopedRestaurants = isAll
    ? restaurants
    : restaurants.filter((r) => r.id === selectedRestaurantId);

  const currency = scopedRestaurants[0]?.currency ?? "RUB";
  const perRestaurantMetrics = scopedRestaurants.map((r) => getDemoMetricsForRestaurant(r.id));
  const totals = sumDemoMetrics(perRestaurantMetrics);
  const currentRevenueMinor = totals.closedRevenueMinor + totals.openOrdersMinor;
  const avgCheckMinor = totals.orderCount > 0 ? Math.round(totals.closedRevenueMinor / totals.orderCount) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          {isAll ? "Все рестораны" : scopedRestaurants[0]?.name}
        </h1>
        <p className="text-sm text-foreground-subtle">Обновлено только что · демо-режим</p>
      </div>

      <DemoDataBanner />

      {restaurants.length === 0 ? (
        <div className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-6 text-sm text-foreground-muted">
          К вашему аккаунту пока не привязан ни один ресторан.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <KpiCard
              label="Текущая выручка"
              value={formatMoney(currentRevenueMinor, currency)}
              change={totals.changeVsPreviousPct}
            />
            <KpiCard label="Закрытая выручка" value={formatMoney(totals.closedRevenueMinor, currency)} />
            <KpiCard label="Открытые заказы" value={formatMoney(totals.openOrdersMinor, currency)} />
            <KpiCard label="Заказов" value={String(totals.orderCount)} />
            <KpiCard label="Средний чек" value={formatMoney(avgCheckMinor, currency)} />
            <KpiCard label="Расходы сегодня" value="—" />
            <KpiCard label="Прибыль (оценка)" value="—" />
          </div>

          {isAll && (
            <div className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)]">
              <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-foreground">
                Обзор по ресторанам
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-foreground-subtle">
                      <th className="px-4 py-2 font-medium">Ресторан</th>
                      <th className="px-4 py-2 font-medium">Текущая выручка</th>
                      <th className="px-4 py-2 font-medium">Открытые заказы</th>
                      <th className="px-4 py-2 font-medium">Заказов</th>
                      <th className="px-4 py-2 font-medium">Изменение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map((restaurant) => {
                      const m = getDemoMetricsForRestaurant(restaurant.id);
                      return (
                        <tr key={restaurant.id} className="border-t border-[var(--border)]">
                          <td className="px-4 py-2.5 font-medium text-foreground">
                            {restaurant.name}
                          </td>
                          <td className="px-4 py-2.5 tabular-nums">
                            {formatMoney(m.closedRevenueMinor + m.openOrdersMinor, restaurant.currency)}
                          </td>
                          <td className="px-4 py-2.5 tabular-nums">
                            {formatMoney(m.openOrdersMinor, restaurant.currency)}
                          </td>
                          <td className="px-4 py-2.5 tabular-nums">{m.orderCount}</td>
                          <td
                            className={`px-4 py-2.5 tabular-nums ${m.changeVsPreviousPct >= 0 ? "text-success" : "text-danger"}`}
                          >
                            {m.changeVsPreviousPct >= 0 ? "+" : ""}
                            {m.changeVsPreviousPct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <div className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-4">
        <div className="text-sm font-medium text-foreground">Требует внимания</div>
        <p className="mt-1 text-sm text-foreground-subtle">
          Уведомления появятся в Phase 8. Пока раздел пуст.
        </p>
        <Link href="/alerts" className="mt-2 inline-block text-sm text-accent hover:underline">
          Перейти в Уведомления →
        </Link>
      </div>
    </div>
  );
}
