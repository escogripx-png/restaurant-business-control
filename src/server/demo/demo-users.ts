import { DEMO_RESTAURANTS } from "@/server/demo/demo-data";
import type { UserRole } from "@prisma/client";

export type DemoUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  restaurantIds: string[];
};

// Mirrors prisma/seed.ts's two base users.
export const BASE_DEMO_USERS: DemoUser[] = [
  {
    id: "seed-user-owner",
    email: "owner@demo.local",
    name: "Demo Owner",
    role: "OWNER",
    restaurantIds: DEMO_RESTAURANTS.map((r) => r.id),
  },
  {
    id: "seed-user-manager",
    email: "manager@demo.local",
    name: "Demo Manager",
    role: "MANAGER",
    restaurantIds: [DEMO_RESTAURANTS[0].id],
  },
];
