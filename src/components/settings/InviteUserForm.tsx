"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { addDemoUser } from "@/server/demo/demo-user-store";

type Restaurant = { id: string; name: string };

export function InviteUserForm({ restaurants }: { restaurants: Restaurant[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("MANAGER");
  const [restaurantIds, setRestaurantIds] = useState<string[]>([]);

  function toggleRestaurant(id: string) {
    setRestaurantIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      await addDemoUser({ email, name: name || email, role, restaurantIds });
      setEmail("");
      setName("");
      setRole("MANAGER");
      setRestaurantIds([]);
      setIsOpen(false);
      router.refresh();
    });
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-[10px] bg-accent px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        + Добавить пользователя
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl bg-surface-secondary p-4 ring-1 ring-[var(--border)]"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[10px] bg-surface px-3 py-2 text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground-muted">Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-[10px] bg-surface px-3 py-2 text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground-muted">Роль</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full max-w-xs rounded-[10px] bg-surface px-3 py-2 text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-2 focus:ring-accent"
        >
          <option value="OWNER">Владелец — полный доступ</option>
          <option value="MANAGER">Менеджер — доступ к выбранным ресторанам</option>
        </select>
      </div>

      {role === "MANAGER" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground-muted">Доступ к ресторанам</label>
          <div className="flex flex-wrap gap-3">
            {restaurants.map((r) => (
              <label key={r.id} className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={restaurantIds.includes(r.id)}
                  onChange={() => toggleRestaurant(r.id)}
                  className="h-4 w-4 accent-accent"
                />
                {r.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-[10px] bg-accent px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Добавляем..." : "Добавить"}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-[10px] px-3 py-2 text-sm font-medium text-foreground-muted hover:text-foreground"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
