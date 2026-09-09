import type { AuthenticatedUser } from "@/server/auth/permissions";

// Mirrors prisma/seed.ts ids so demo-mode and a real seeded DB show the same
// restaurant identities (and getDemoMetricsForRestaurant produces the same
// numbers either way).
export const DEMO_ORGANIZATION = {
  id: "seed-org-1",
  name: "Demo Restaurant Group",
};

export const DEMO_RESTAURANTS = [
  {
    id: "seed-restaurant-1",
    organizationId: DEMO_ORGANIZATION.id,
    name: "Restaurant Prague 1",
    timezone: "Europe/Prague",
    currency: "CZK",
  },
  {
    id: "seed-restaurant-2",
    organizationId: DEMO_ORGANIZATION.id,
    name: "Restaurant Prague 2",
    timezone: "Europe/Prague",
    currency: "CZK",
  },
];

export const DEMO_USER: AuthenticatedUser & { email: string; name: string } = {
  id: "seed-user-owner",
  organizationId: DEMO_ORGANIZATION.id,
  role: "OWNER",
  email: "owner@demo.local",
  name: "Demo Owner",
};

export const DEMO_EMPLOYEES = [
  { id: "emp-1", name: "Jana Nováková", role: "Waiter", restaurantId: "seed-restaurant-1" },
  { id: "emp-2", name: "Petr Svoboda", role: "Waiter", restaurantId: "seed-restaurant-1" },
  { id: "emp-3", name: "Lucie Dvořáková", role: "Bartender", restaurantId: "seed-restaurant-1" },
  { id: "emp-4", name: "Tomáš Procházka", role: "Waiter", restaurantId: "seed-restaurant-2" },
  { id: "emp-5", name: "Eva Černá", role: "Manager", restaurantId: "seed-restaurant-2" },
];
