"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Theme } from "@/server/theme/theme";
import { setTheme } from "@/server/theme/theme";
import { SunIcon, MoonIcon } from "@/components/layout/icons";

export function ThemeToggle({ theme }: { theme: Theme }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const next: Theme = theme === "light" ? "dark" : "light";
    startTransition(async () => {
      await setTheme(next);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
      aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-foreground-muted transition-colors hover:text-foreground disabled:opacity-60"
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
