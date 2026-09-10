"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-[10px] px-3 py-1.5 text-sm text-foreground-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
    >
      Выйти
    </button>
  );
}
