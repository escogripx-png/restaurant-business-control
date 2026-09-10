"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "theme";
export type Theme = "light" | "dark";

export async function getTheme(): Promise<Theme> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "light" ? "light" : "dark";
}

export async function setTheme(theme: Theme): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, theme, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}
