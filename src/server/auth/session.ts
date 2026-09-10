import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/server/auth/config";
import { isDemoMode } from "@/server/demo/demo-mode";
import { DEMO_USER } from "@/server/demo/demo-data";
import { getDemoRole } from "@/server/demo/demo-role";

async function getDemoUser() {
  const role = await getDemoRole();
  return { ...DEMO_USER, role };
}

export async function getCurrentSession() {
  if (isDemoMode()) {
    return { user: await getDemoUser() } as const;
  }
  return getServerSession(authOptions);
}

/**
 * Use in server components/route handlers that require a logged-in user.
 * Redirects to /login instead of leaking a 500 when there's no session.
 */
export async function requireUser() {
  if (isDemoMode()) {
    return getDemoUser();
  }

  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}
