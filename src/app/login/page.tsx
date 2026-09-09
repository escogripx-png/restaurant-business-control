import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/auth/session";
import { LoginForm } from "@/components/auth/LoginForm";

// Force dynamic: same reasoning as the root page — the redirect depends on
// runtime session/DEMO_MODE state.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getCurrentSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
