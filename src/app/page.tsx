import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/auth/session";

// Force dynamic: the redirect target depends on runtime session/DEMO_MODE
// state, which must not get baked into a build-time-static response.
export const dynamic = "force-dynamic";

export default async function RootPage() {
  const session = await getCurrentSession();
  redirect(session?.user ? "/dashboard" : "/login");
}
