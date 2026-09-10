import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getTopMenuItems, getBottomMenuItems } from "@/server/demo/mock-menu";
import { formatMoney } from "@/lib/money";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

export default async function MenuPage() {
  const user = await requireUser();
  const { scopedRestaurants } = await resolveRestaurantScope(user);

  const topByRestaurant = scopedRestaurants.map((r) => ({
    restaurant: r,
    items: getTopMenuItems(r.id),
  }));
  const bottomByRestaurant = scopedRestaurants.map((r) => ({
    restaurant: r,
    items: getBottomMenuItems(r.id),
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Меню</h1>
      <DemoDataBanner />

      {topByRestaurant.map(({ restaurant, items }) => (
        <div key={restaurant.id} className="rounded-2xl border border-black/5 bg-white">
          <div className="border-b border-black/5 px-4 py-3 text-sm font-medium text-foreground">
            {restaurant.name} · Топ блюд
          </div>
          <ul className="divide-y divide-black/5">
            {items.map((item, i) => (
              <li key={item.name} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <span className="min-w-0 flex-1 truncate text-foreground">
                  {i + 1}. {item.name}
                </span>
                <span className="shrink-0 text-foreground/50">{item.quantitySold} шт</span>
                <span className="shrink-0 tabular-nums text-foreground">
                  {formatMoney(item.revenueMinor, restaurant.currency)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {bottomByRestaurant.map(({ restaurant, items }) => (
        <div key={restaurant.id} className="rounded-2xl border border-black/5 bg-white">
          <div className="border-b border-black/5 px-4 py-3 text-sm font-medium text-foreground">
            {restaurant.name} · Меньше всего продаж
          </div>
          <ul className="divide-y divide-black/5">
            {items.map((item) => (
              <li key={item.name} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <span className="min-w-0 flex-1 truncate text-foreground">{item.name}</span>
                <span className="shrink-0 text-foreground/50">{item.quantitySold} шт</span>
                <span className="shrink-0 tabular-nums text-foreground">
                  {formatMoney(item.revenueMinor, restaurant.currency)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {scopedRestaurants.length === 0 && (
        <p className="text-sm text-foreground/50">Нет доступных ресторанов.</p>
      )}
    </div>
  );
}
