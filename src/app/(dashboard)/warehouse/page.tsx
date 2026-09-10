import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoStock } from "@/server/demo/mock-inventory";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

export default async function WarehousePage() {
  const user = await requireUser();

  // Demonstrates a feature-level (not just restaurant-level) permission:
  // OWNER has full access, MANAGER does not see Warehouse — matches the
  // explicit example the owner gave for role-based access.
  if (user.role !== "OWNER") {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold text-foreground">Склад</h1>
        <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-foreground/60">
          Этот раздел доступен только владельцу аккаунта.
        </div>
      </div>
    );
  }

  const { scopedRestaurants, isAll } = await resolveRestaurantScope(user);
  const stockByRestaurant = scopedRestaurants.map((r) => ({
    restaurant: r,
    items: getDemoStock(r.id),
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Склад</h1>
      <DemoDataBanner />

      {stockByRestaurant.map(({ restaurant, items }) => (
        <div key={restaurant.id} className="rounded-2xl border border-black/5 bg-white">
          <div className="border-b border-black/5 px-4 py-3 text-sm font-medium text-foreground">
            {isAll ? restaurant.name : "Остатки"}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-foreground/40">
                  <th className="px-4 py-2 font-medium">Позиция</th>
                  <th className="px-4 py-2 font-medium">Остаток</th>
                  <th className="px-4 py-2 font-medium">Порог заказа</th>
                  <th className="px-4 py-2 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.name} className="border-t border-black/5">
                    <td className="px-4 py-2.5 font-medium text-foreground">{item.name}</td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {item.quantityRemaining} {item.unit}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-foreground/60">
                      {item.reorderThreshold} {item.unit}
                    </td>
                    <td className="px-4 py-2.5">
                      {item.isLow ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          Нужно заказать
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          В норме
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
