import { prisma } from "@/server/db/prisma";
import type { UserRole } from "@prisma/client";

export type AuthenticatedUser = {
  id: string;
  organizationId: string;
  role: UserRole;
};

/**
 * Returns the restaurant ids `user` is allowed to see within their own
 * organization. OWNER sees every restaurant in the org; MANAGER is limited
 * to explicit RestaurantAccess grants.
 *
 * Every caller that lists/filters restaurant-scoped data MUST go through
 * this (directly or via a repository that calls it) instead of trusting a
 * restaurantId supplied by the client.
 */
export async function getAccessibleRestaurantIds(user: AuthenticatedUser): Promise<string[]> {
  if (user.role === "OWNER") {
    const restaurants = await prisma.restaurant.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true },
    });
    return restaurants.map((r) => r.id);
  }

  const access = await prisma.restaurantAccess.findMany({
    where: { userId: user.id },
    select: { restaurantId: true },
  });
  return access.map((a) => a.restaurantId);
}

/**
 * Asserts `restaurantId` both belongs to the user's organization AND is
 * visible to the user under their role, throwing otherwise. Call this
 * before returning/mutating any single-restaurant resource.
 */
export async function assertCanAccessRestaurant(
  user: AuthenticatedUser,
  restaurantId: string,
): Promise<void> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { organizationId: true },
  });

  if (!restaurant || restaurant.organizationId !== user.organizationId) {
    throw new Error("Restaurant not found");
  }

  if (user.role === "OWNER") {
    return;
  }

  const access = await prisma.restaurantAccess.findUnique({
    where: { userId_restaurantId: { userId: user.id, restaurantId } },
  });

  if (!access) {
    throw new Error("Forbidden: no access to this restaurant");
  }
}

export function requireRole(user: AuthenticatedUser, roles: UserRole[]): void {
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden: insufficient role");
  }
}
