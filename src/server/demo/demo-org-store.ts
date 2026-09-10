"use server";

import { cookies } from "next/headers";
import { DEMO_ORGANIZATION } from "@/server/demo/demo-data";

const COOKIE_NAME = "demoOrgName";

export async function getDemoOrgName(): Promise<string> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value || DEMO_ORGANIZATION.name;
}

export async function setDemoOrgName(name: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, name, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}
