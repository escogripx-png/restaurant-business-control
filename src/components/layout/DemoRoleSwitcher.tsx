"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { setDemoRole } from "@/server/demo/demo-role";

export function DemoRoleSwitcher({ role }: { role: UserRole }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(value: UserRole) {
    startTransition(async () => {
      await setDemoRole(value);
      router.refresh();
    });
  }

  return (
    <select
      value={role}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as UserRole)}
      title="Демо-переключатель роли — показывает, чем отличаются права доступа"
      className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-medium text-foreground outline-none disabled:opacity-60"
    >
      <option value="OWNER">Владелец</option>
      <option value="MANAGER">Менеджер</option>
    </select>
  );
}
