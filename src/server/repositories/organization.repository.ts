import { prisma } from "@/server/db/prisma";

export function getOrganizationWithRestaurants(organizationId: string) {
  return prisma.organization.findUnique({
    where: { id: organizationId },
    include: { restaurants: true },
  });
}
