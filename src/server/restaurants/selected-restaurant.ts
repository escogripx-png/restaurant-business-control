"use server";

import { cookies } from "next/headers";
import { ALL_RESTAURANTS } from "@/server/restaurants/constants";

const COOKIE_NAME = "selectedRestaurantId";

/**
 * Reads the user's last-selected restaurant (or "all") from a cookie so the
 * choice persists across navigation (MASTER SPEC §13). This is a UI
 * convenience only — it must never be trusted as an access-control signal;
 * every data query still re-derives and re-checks the accessible restaurant
 * set via getAccessibleRestaurantIds/assertCanAccessRestaurant.
 */
export async function getSelectedRestaurantId(): Promise<string> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? ALL_RESTAURANTS;
}

export async function setSelectedRestaurantId(restaurantId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, restaurantId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
