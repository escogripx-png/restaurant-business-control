import { requireUser } from "@/server/auth/session";
import { getAccessibleRestaurants } from "@/server/restaurants/accessible-restaurants";

export default async function RestaurantsPage() {
  const user = await requireUser();
  const restaurants = await getAccessibleRestaurants(user);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-foreground">Restaurants</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="rounded-2xl border border-black/5 bg-white p-4">
            <div className="font-medium text-foreground">{restaurant.name}</div>
            <div className="mt-1 text-sm text-foreground/50">
              {restaurant.timezone} · {restaurant.currency}
            </div>
          </div>
        ))}
        {restaurants.length === 0 && (
          <p className="text-sm text-foreground/50">Нет доступных ресторанов.</p>
        )}
      </div>
    </div>
  );
}
