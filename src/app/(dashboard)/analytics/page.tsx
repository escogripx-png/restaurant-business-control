import Link from "next/link";
import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoRevenueByHour } from "@/server/demo/mock-operations";
import { getDemoOccupancyByHour } from "@/server/demo/mock-tables";
import { formatMoney } from "@/lib/money";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";
import { seededRandom } from "@/server/demo/seeded-random";

const PERIODS = [
  { key: "day", label: "День" },
  { key: "week", label: "Неделя" },
  { key: "month", label: "Месяц" },
] as const;
type PeriodKey = (typeof PERIODS)[number]["key"];

function getDemoPeriodTotals(restaurantId: string, period: PeriodKey) {
  const multiplier = period === "day" ? 1 : period === "week" ? 7 : 30;
  const r = seededRandom(`${restaurantId}-period-${period}`);
  const dailyRevenueMinor = Math.round((100_000 + r * 60_000) * 100);
  const dailyOrders = Math.round(200 + r * 150);
  return {
    revenueMinor: dailyRevenueMinor * multiplier,
    orders: dailyOrders * multiplier,
  };
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const user = await requireUser();
  const { scopedRestaurants } = await resolveRestaurantScope(user);
  const currency = scopedRestaurants[0]?.currency ?? "RUB";
  const { period: periodParam } = await searchParams;
  const period: PeriodKey = PERIODS.some((p) => p.key === periodParam)
    ? (periodParam as PeriodKey)
    : "day";

  const byHour = new Map<number, number>();
  const occupancyByHour = new Map<number, number[]>();
  for (const restaurant of scopedRestaurants) {
    for (const point of getDemoRevenueByHour(restaurant.id)) {
      byHour.set(point.hour, (byHour.get(point.hour) ?? 0) + point.revenueMinor);
    }
    for (const point of getDemoOccupancyByHour(restaurant.id)) {
      occupancyByHour.set(point.hour, [...(occupancyByHour.get(point.hour) ?? []), point.occupancyPct]);
    }
  }
  const maxMinor = Math.max(...byHour.values(), 1);

  const periodTotals = scopedRestaurants
    .map((r) => getDemoPeriodTotals(r.id, period))
    .reduce(
      (sum, t) => ({ revenueMinor: sum.revenueMinor + t.revenueMinor, orders: sum.orders + t.orders }),
      { revenueMinor: 0, orders: 0 },
    );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Аналитика</h1>
      <DemoDataBanner />

      <div className="flex gap-2">
        {PERIODS.map((p) => (
          <Link
            key={p.key}
            href={`/analytics?period=${p.key}`}
            className={`rounded-[10px] px-3 py-1.5 text-sm font-medium transition-colors ${
              period === p.key
                ? "bg-accent text-white"
                : "bg-surface text-foreground-muted ring-1 ring-[var(--border)]"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0 rounded-[20px] bg-surface p-5 shadow-[var(--shadow-card)] ring-1 ring-[var(--border)]">
          <div className="text-[13px] font-medium text-foreground-subtle">Выручка за период</div>
          <div className="mt-1 text-[26px] font-semibold tracking-tight tabular-nums text-foreground">
            {formatMoney(periodTotals.revenueMinor, currency)}
          </div>
        </div>
        <div className="min-w-0 rounded-[20px] bg-surface p-5 shadow-[var(--shadow-card)] ring-1 ring-[var(--border)]">
          <div className="text-[13px] font-medium text-foreground-subtle">Заказов</div>
          <div className="mt-1 text-[26px] font-semibold tracking-tight tabular-nums text-foreground">
            {periodTotals.orders}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-4">
        <div className="mb-3 text-sm font-medium text-foreground">Выручка по часам</div>
        <div className="flex gap-2">
          {Array.from(byHour.entries()).map(([hour, amountMinor]) => (
            <div key={hour} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              {/* Fixed-height bar track: the bar's height% is relative to
                  THIS div, not the outer row (which has no explicit height
                  since it also holds the hour labels below the bars). */}
              <div className="flex h-40 w-full items-end">
                <div
                  className="w-full rounded-t-md bg-accent"
                  style={{ height: `${Math.max(4, (amountMinor / maxMinor) * 100)}%` }}
                  title={formatMoney(amountMinor, currency)}
                />
              </div>
              <span className="text-[10px] text-foreground-subtle">{hour}ч</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-4">
        <div className="mb-3 text-sm font-medium text-foreground">Загруженность по часам (% занятых столов)</div>
        <div className="flex gap-2">
          {Array.from(occupancyByHour.entries()).map(([hour, values]) => {
            const avgPct = Math.round(values.reduce((s, v) => s + v, 0) / values.length);
            return (
              <div key={hour} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <div className="flex h-40 w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-purple-400"
                    style={{ height: `${Math.max(4, avgPct)}%` }}
                    title={`${avgPct}%`}
                  />
                </div>
                <span className="text-[10px] text-foreground-subtle">{hour}ч</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-foreground-subtle">
        Разбивки по дням недели / ресторанам появятся в этом же разделе по мере подключения реальных
        данных (Phase 6).
      </p>
    </div>
  );
}
