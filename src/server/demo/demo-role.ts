"use server";

import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";

const COOKIE_NAME = "demoRole";

/**
 * Demo-mode-only role override so the permission model (OWNER full access,
 * MANAGER restricted — e.g. no Warehouse, only granted restaurants) can
 * actually be seen without a real second user/session. Never consulted
 * outside isDemoMode() — real auth always comes from the NextAuth session.
 */
export async function getDemoRole(): Promise<UserRole> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "MANAGER" ? "MANAGER" : "OWNER";
}

export async function setDemoRole(role: UserRole): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, role, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}
