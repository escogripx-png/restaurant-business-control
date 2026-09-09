import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/server/auth/config";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

/**
 * Use in server components/route handlers that require a logged-in user.
 * Redirects to /login instead of leaking a 500 when there's no session.
 */
export async function requireUser() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}
