import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoOrders } from "@/server/demo/mock-operations";
import { formatMoney } from "@/lib/money";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

export default async function OrdersPage() {
  const user = await requireUser();
  const { scopedRestaurants, isAll } = await resolveRestaurantScope(user);

  const orders = scopedRestaurants.flatMap((r) =>
    getDemoOrders(r.id).map((o) => ({ ...o, restaurantName: r.name, currency: r.currency })),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Заказы</h1>
      <DemoDataBanner />

      <div className="rounded-2xl border border-black/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-foreground/40">
                <th className="px-4 py-2 font-medium">Заказ</th>
                {isAll && <th className="px-4 py-2 font-medium">Ресторан</th>}
                <th className="px-4 py-2 font-medium">Стол</th>
                <th className="px-4 py-2 font-medium">Статус</th>
                <th className="px-4 py-2 font-medium">Открыт</th>
                <th className="px-4 py-2 font-medium">Официант</th>
                <th className="px-4 py-2 font-medium">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={`${order.restaurantName}-${order.id}`} className="border-t border-black/5">
                  <td className="px-4 py-2.5 font-medium text-foreground">{order.id}</td>
                  {isAll && <td className="px-4 py-2.5">{order.restaurantName}</td>}
                  <td className="px-4 py-2.5">{order.table}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === "OPEN"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {order.status === "OPEN" ? "Открыт" : "Закрыт"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 tabular-nums">{order.openedAt}</td>
                  <td className="px-4 py-2.5">{order.employeeName}</td>
                  <td className="px-4 py-2.5 tabular-nums">
                    {formatMoney(order.amountMinor, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
