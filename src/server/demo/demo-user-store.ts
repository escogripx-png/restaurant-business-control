"use server";

import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";
import type { DemoUser } from "@/server/demo/demo-users";

const COOKIE_NAME = "demoAddedUsers";

/**
 * Demo-mode-only "invite a user" persistence: a JSON array in a cookie,
 * standing in for a real User.create() + RestaurantAccess rows once a
 * database is connected. Never consulted outside isDemoMode() — this exists
 * purely so §31 "add users from Settings" can be reviewed as a working
 * flow before Phase 1's real Prisma models are wired up to this screen.
 */
export async function getAddedDemoUsers(): Promise<DemoUser[]> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addDemoUser(input: {
  email: string;
  name: string;
  role: UserRole;
  restaurantIds: string[];
}): Promise<void> {
  const existing = await getAddedDemoUsers();
  const newUser: DemoUser = {
    id: `demo-added-${Date.now()}`,
    email: input.email,
    name: input.name,
    role: input.role,
    restaurantIds: input.role === "OWNER" ? [] : input.restaurantIds,
  };
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify([...existing, newUser]), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

export async function removeDemoUser(id: string): Promise<void> {
  const existing = await getAddedDemoUsers();
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(existing.filter((u) => u.id !== id)), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
