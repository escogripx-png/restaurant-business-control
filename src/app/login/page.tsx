import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/auth/session";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await getCurrentSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
