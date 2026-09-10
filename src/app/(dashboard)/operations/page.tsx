import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoOperations } from "@/server/demo/mock-operations";
import { formatMoney } from "@/lib/money";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

const TYPE_LABEL: Record<string, string> = {
  DISCOUNT: "Скидка",
  VOID: "Сторно",
  REFUND: "Возврат",
};

export default async function OperationsPage() {
  const user = await requireUser();
  const { scopedRestaurants, isAll } = await resolveRestaurantScope(user);

  const events = scopedRestaurants.flatMap((r) =>
    getDemoOperations(r.id).map((e) => ({ ...e, restaurantName: r.name, currency: r.currency })),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Операции</h1>
      <DemoDataBanner />

      <div className="rounded-2xl border border-black/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-foreground/40">
                <th className="px-4 py-2 font-medium">Тип</th>
                {isAll && <th className="px-4 py-2 font-medium">Ресторан</th>}
                <th className="px-4 py-2 font-medium">Сотрудник</th>
                <th className="px-4 py-2 font-medium">Причина</th>
                <th className="px-4 py-2 font-medium">Сумма</th>
                <th className="px-4 py-2 font-medium">Дата/время</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={`${e.restaurantName}-${e.id}`} className="border-t border-black/5">
                  <td className="px-4 py-2.5 font-medium text-foreground">{TYPE_LABEL[e.type]}</td>
                  {isAll && <td className="px-4 py-2.5">{e.restaurantName}</td>}
                  <td className="px-4 py-2.5">{e.employeeName}</td>
                  <td className="px-4 py-2.5 text-foreground/60">{e.reason}</td>
                  <td className="px-4 py-2.5 tabular-nums">{formatMoney(e.amountMinor, e.currency)}</td>
                  <td className="px-4 py-2.5 tabular-nums">{e.at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
