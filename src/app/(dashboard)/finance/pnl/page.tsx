import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoPnl } from "@/server/demo/mock-operations";
import { formatMoney } from "@/lib/money";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

export default async function PnlPage() {
  const user = await requireUser();
  const { scopedRestaurants } = await resolveRestaurantScope(user);
  const currency = scopedRestaurants[0]?.currency ?? "RUB";

  const byCategoryTotals = new Map<string, number>();
  let revenueMinor = 0;
  let expensesMinor = 0;

  for (const restaurant of scopedRestaurants) {
    const pnl = getDemoPnl(restaurant.id);
    revenueMinor += pnl.revenueMinor;
    expensesMinor += pnl.totalExpensesMinor;
    for (const c of pnl.byCategory) {
      byCategoryTotals.set(c.category, (byCategoryTotals.get(c.category) ?? 0) + c.amountMinor);
    }
  }

  const operatingResultMinor = revenueMinor - expensesMinor;
  const maxCategoryMinor = Math.max(...byCategoryTotals.values(), 1);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">P&L · Сентябрь 2026</h1>
      <DemoDataBanner />

      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div className="min-w-0">
            <dt className="text-foreground/50">Выручка</dt>
            <dd className="text-lg font-semibold tabular-nums text-foreground">
              {formatMoney(revenueMinor, currency)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-foreground/50">Расходы</dt>
            <dd className="text-lg font-semibold tabular-nums text-foreground">
              {formatMoney(expensesMinor, currency)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-foreground/50">Прибыль (оценка)</dt>
            <dd className="text-lg font-semibold tabular-nums text-foreground">
              {formatMoney(operatingResultMinor, currency)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-foreground/50">Маржа</dt>
            <dd className="text-lg font-semibold tabular-nums text-foreground">
              {Math.round((operatingResultMinor / revenueMinor) * 1000) / 10}%
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <div className="mb-3 text-sm font-medium text-foreground">Расходы по категориям</div>
        <div className="flex flex-col gap-2">
          {Array.from(byCategoryTotals.entries()).map(([category, amountMinor]) => (
            <div key={category} className="flex items-center gap-3">
              <div className="w-36 shrink-0 text-sm text-foreground/60">{category}</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.max(4, (amountMinor / maxCategoryMinor) * 100)}%` }}
                />
              </div>
              <div className="w-24 shrink-0 text-right text-sm tabular-nums text-foreground">
                {formatMoney(amountMinor, currency)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
