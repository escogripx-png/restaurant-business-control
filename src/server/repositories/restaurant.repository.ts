import { prisma } from "@/server/db/prisma";

/**
 * All restaurant-scoped queries live here and MUST be called with the
 * caller's organizationId (never a value trusted from the client). This is
 * the tenant-isolation boundary — route handlers/server components should
 * not call prisma.restaurant.* directly.
 */

export function listRestaurantsForOrganization(organizationId: string) {
  return prisma.restaurant.findMany({
    where: { organizationId },
    orderBy: { name: "asc" },
  });
}

export function listRestaurantsByIds(organizationId: string, restaurantIds: string[]) {
  return prisma.restaurant.findMany({
    where: { organizationId, id: { in: restaurantIds } },
    orderBy: { name: "asc" },
  });
}

export function getRestaurantForOrganization(organizationId: string, restaurantId: string) {
  return prisma.restaurant.findFirst({
    where: { id: restaurantId, organizationId },
  });
}
