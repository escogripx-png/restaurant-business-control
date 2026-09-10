import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoExpenses } from "@/server/demo/mock-operations";
import { formatMoney } from "@/lib/money";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

export default async function ExpensesPage() {
  const user = await requireUser();
  const { scopedRestaurants, isAll } = await resolveRestaurantScope(user);

  const expenses = scopedRestaurants.flatMap((r) =>
    getDemoExpenses(r.id).map((e) => ({ ...e, restaurantName: r.name, currency: r.currency })),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Расходы</h1>
        <button
          disabled
          title="Появится, когда будет готова форма добавления расходов"
          className="rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-white opacity-40"
        >
          + Добавить расход
        </button>
      </div>
      <DemoDataBanner />

      <div className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-foreground-subtle">
                <th className="px-4 py-2 font-medium">Дата</th>
                {isAll && <th className="px-4 py-2 font-medium">Ресторан</th>}
                <th className="px-4 py-2 font-medium">Категория</th>
                <th className="px-4 py-2 font-medium">Описание</th>
                <th className="px-4 py-2 font-medium">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={`${e.restaurantName}-${e.id}`} className="border-t border-[var(--border)]">
                  <td className="px-4 py-2.5 tabular-nums">{e.date}</td>
                  {isAll && <td className="px-4 py-2.5">{e.restaurantName}</td>}
                  <td className="px-4 py-2.5">{e.category}</td>
                  <td className="px-4 py-2.5 text-foreground-muted">{e.description}</td>
                  <td className="px-4 py-2.5 tabular-nums">{formatMoney(e.amountMinor, e.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
