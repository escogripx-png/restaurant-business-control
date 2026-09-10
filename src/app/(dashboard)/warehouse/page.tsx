import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoStock } from "@/server/demo/mock-inventory";
import { getDemoWriteOffs, getRecipe } from "@/server/demo/mock-recipes";
import { getDemoMenuItems } from "@/server/demo/mock-menu";
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
        <div className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-6 text-sm text-foreground-muted">
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
  const writeOffsByRestaurant = scopedRestaurants.map((r) => ({
    restaurant: r,
    writeOffs: getDemoWriteOffs(r.id),
  }));
  const dishesWithRecipes = scopedRestaurants[0]
    ? getDemoMenuItems(scopedRestaurants[0].id).filter((item) => getRecipe(item.name).length > 0)
    : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Склад</h1>
      <DemoDataBanner />
      <p className="-mt-4 text-xs text-foreground-subtle">
        Остатки ведутся в приложении: при каждом заказе ингредиенты по тех.карте блюда списываются
        автоматически (заказы приходят из iiko, тех.карты и остатки — наши).
      </p>

      {stockByRestaurant.map(({ restaurant, items }) => (
        <div key={restaurant.id} className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)]">
          <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-foreground">
            {isAll ? restaurant.name : "Остатки"}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-foreground-subtle">
                  <th className="px-4 py-2 font-medium">Позиция</th>
                  <th className="px-4 py-2 font-medium">Остаток</th>
                  <th className="px-4 py-2 font-medium">Порог заказа</th>
                  <th className="px-4 py-2 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.name} className="border-t border-[var(--border)]">
                    <td className="px-4 py-2.5 font-medium text-foreground">{item.name}</td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {item.quantityRemaining} {item.unit}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-foreground-muted">
                      {item.reorderThreshold} {item.unit}
                    </td>
                    <td className="px-4 py-2.5">
                      {item.isLow ? (
                        <span className="rounded-full bg-danger-soft px-2 py-0.5 text-xs font-medium text-danger">
                          Нужно заказать
                        </span>
                      ) : (
                        <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">
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

      <div className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)]">
        <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-foreground">
          Тех.карты
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {dishesWithRecipes.map((dish) => (
            <li key={dish.name} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
              <span className="font-medium text-foreground">{dish.name}</span>
              <span className="text-foreground-subtle">
                {getRecipe(dish.name)
                  .map((line) => `${line.ingredient} ${line.quantity} ${line.unit}`)
                  .join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {writeOffsByRestaurant.map(({ restaurant, writeOffs }) => (
        <div key={restaurant.id} className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)]">
          <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-foreground">
            {isAll ? `${restaurant.name} · Последние списания` : "Последние списания"}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-foreground-subtle">
                  <th className="px-4 py-2 font-medium">Заказ</th>
                  <th className="px-4 py-2 font-medium">Блюдо</th>
                  <th className="px-4 py-2 font-medium">Списано</th>
                  <th className="px-4 py-2 font-medium">Время</th>
                </tr>
              </thead>
              <tbody>
                {writeOffs.map((wo) => (
                  <tr key={wo.orderId} className="border-t border-[var(--border)]">
                    <td className="px-4 py-2.5 font-medium text-foreground">{wo.orderId}</td>
                    <td className="px-4 py-2.5">{wo.dishName}</td>
                    <td className="px-4 py-2.5 text-foreground-muted">
                      {wo.ingredients.map((line) => `${line.ingredient} ${line.quantity}${line.unit}`).join(", ")}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">{wo.at}</td>
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
