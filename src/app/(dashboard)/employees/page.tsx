import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoEmployeeMetrics } from "@/server/demo/mock-operations";
import { formatMoney } from "@/lib/money";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

export default async function EmployeesPage() {
  const user = await requireUser();
  const { scopedRestaurants, isAll } = await resolveRestaurantScope(user);

  const employees = scopedRestaurants.flatMap((r) =>
    getDemoEmployeeMetrics(r.id).map((e) => ({ ...e, restaurantName: r.name, currency: r.currency })),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Сотрудники</h1>
      <DemoDataBanner />

      <div className="rounded-2xl border border-black/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-foreground/40">
                <th className="px-4 py-2 font-medium">Сотрудник</th>
                <th className="px-4 py-2 font-medium">Роль</th>
                {isAll && <th className="px-4 py-2 font-medium">Ресторан</th>}
                <th className="px-4 py-2 font-medium">Выручка</th>
                <th className="px-4 py-2 font-medium">Заказов</th>
                <th className="px-4 py-2 font-medium">Средний чек</th>
                <th className="px-4 py-2 font-medium">Скидка %</th>
                <th className="px-4 py-2 font-medium">Сторно</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-t border-black/5">
                  <td className="px-4 py-2.5 font-medium text-foreground">{e.name}</td>
                  <td className="px-4 py-2.5 text-foreground/60">{e.role}</td>
                  {isAll && <td className="px-4 py-2.5">{e.restaurantName}</td>}
                  <td className="px-4 py-2.5 tabular-nums">{formatMoney(e.revenueMinor, e.currency)}</td>
                  <td className="px-4 py-2.5 tabular-nums">{e.orderCount}</td>
                  <td className="px-4 py-2.5 tabular-nums">{formatMoney(e.avgCheckMinor, e.currency)}</td>
                  <td className="px-4 py-2.5 tabular-nums">{e.discountPct}%</td>
                  <td className="px-4 py-2.5 tabular-nums">{e.voidCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
