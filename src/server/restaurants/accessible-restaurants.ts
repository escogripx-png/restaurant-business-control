import type { AuthenticatedUser } from "@/server/auth/permissions";
import { getAccessibleRestaurantIds } from "@/server/auth/permissions";
import { listRestaurantsByIds } from "@/server/repositories/restaurant.repository";
import { isDemoMode } from "@/server/demo/demo-mode";
import { DEMO_RESTAURANTS } from "@/server/demo/demo-data";
import { getSelectedRestaurantId } from "@/server/restaurants/selected-restaurant";
import { ALL_RESTAURANTS } from "@/server/restaurants/constants";

/**
 * Single entry point pages use to get "the restaurants this user may see".
 * Demo mode (no database) short-circuits to static fixtures; everything
 * else goes through the real permission check + repository, unchanged.
 */
export async function getAccessibleRestaurants(user: AuthenticatedUser) {
  if (isDemoMode()) {
    return DEMO_RESTAURANTS;
  }

  const restaurantIds = await getAccessibleRestaurantIds(user);
  return listRestaurantsByIds(user.organizationId, restaurantIds);
}

/**
 * Combines the accessible-restaurant list with the user's cookie-persisted
 * selection (MASTER SPEC §13) into the "what should this page render"
 * shape every restaurant-scoped page needs: the full list (for the
 * switcher/overview tables) and the subset currently in scope.
 */
export async function resolveRestaurantScope(user: AuthenticatedUser) {
  const [restaurants, selectedRestaurantId] = await Promise.all([
    getAccessibleRestaurants(user),
    getSelectedRestaurantId(),
  ]);

  const isAll =
    selectedRestaurantId === ALL_RESTAURANTS ||
    !restaurants.some((r) => r.id === selectedRestaurantId);
  const scopedRestaurants = isAll
    ? restaurants
    : restaurants.filter((r) => r.id === selectedRestaurantId);

  return { restaurants, scopedRestaurants, isAll, selectedRestaurantId };
}
