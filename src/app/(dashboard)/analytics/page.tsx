import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoRevenueByHour } from "@/server/demo/mock-operations";
import { formatMoney } from "@/lib/money";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

export default async function AnalyticsPage() {
  const user = await requireUser();
  const { scopedRestaurants } = await resolveRestaurantScope(user);
  const currency = scopedRestaurants[0]?.currency ?? "CZK";

  const byHour = new Map<number, number>();
  for (const restaurant of scopedRestaurants) {
    for (const point of getDemoRevenueByHour(restaurant.id)) {
      byHour.set(point.hour, (byHour.get(point.hour) ?? 0) + point.revenueMinor);
    }
  }
  const maxMinor = Math.max(...byHour.values(), 1);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Analytics · Revenue by hour</h1>
      <DemoDataBanner />

      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <div className="flex gap-2">
          {Array.from(byHour.entries()).map(([hour, amountMinor]) => (
            <div key={hour} className="flex flex-1 flex-col items-center gap-1.5">
              {/* Fixed-height bar track: the bar's height% is relative to
                  THIS div, not the outer row (which has no explicit height
                  since it also holds the hour labels below the bars). */}
              <div className="flex h-48 w-full items-end">
                <div
                  className="w-full rounded-t-md bg-accent"
                  style={{ height: `${Math.max(4, (amountMinor / maxMinor) * 100)}%` }}
                  title={formatMoney(amountMinor, currency)}
                />
              </div>
              <span className="text-xs text-foreground/50">{hour}h</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-foreground/50">
        Разбивки by day / by weekday / by month / by restaurant появятся в этом же разделе по мере
        подключения реальных данных (Phase 6).
      </p>
    </div>
  );
}
