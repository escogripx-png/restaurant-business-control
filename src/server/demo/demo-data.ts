import type { AuthenticatedUser } from "@/server/auth/permissions";

// Mirrors prisma/seed.ts ids so demo-mode and a real seeded DB show the same
// restaurant identities (and getDemoMetricsForRestaurant produces the same
// numbers either way).
//
// Names/timezone below are placeholders (no real restaurant location was
// given) — currency is RUB per explicit instruction. Replace with the real
// restaurant name/city/timezone once known.
export const DEMO_ORGANIZATION = {
  id: "seed-org-1",
  name: "Демо-сеть ресторанов",
};

export const DEMO_RESTAURANTS = [
  {
    id: "seed-restaurant-1",
    organizationId: DEMO_ORGANIZATION.id,
    name: "Ресторан №1",
    timezone: "Europe/Moscow",
    currency: "RUB",
  },
  {
    id: "seed-restaurant-2",
    organizationId: DEMO_ORGANIZATION.id,
    name: "Ресторан №2",
    timezone: "Europe/Moscow",
    currency: "RUB",
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
  { id: "emp-1", name: "Анна Смирнова", role: "Официант", restaurantId: "seed-restaurant-1" },
  { id: "emp-2", name: "Пётр Иванов", role: "Официант", restaurantId: "seed-restaurant-1" },
  { id: "emp-3", name: "Людмила Ковалёва", role: "Бармен", restaurantId: "seed-restaurant-1" },
  { id: "emp-4", name: "Тимур Прокофьев", role: "Официант", restaurantId: "seed-restaurant-2" },
  { id: "emp-5", name: "Елена Черных", role: "Менеджер", restaurantId: "seed-restaurant-2" },
];
