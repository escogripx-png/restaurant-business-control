"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg px-3 py-1.5 text-sm text-foreground/60 hover:bg-black/[.04] hover:text-foreground"
    >
      Выйти
    </button>
  );
}
