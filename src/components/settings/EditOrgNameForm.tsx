"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { setDemoOrgName } from "@/server/demo/demo-org-store";

export function EditOrgNameForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      await setDemoOrgName(name.trim() || initialName);
      setIsEditing(false);
      router.refresh();
    });
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-foreground">{initialName}</span>
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-accent hover:underline"
        >
          Изменить
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-[8px] bg-surface-secondary px-2 py-1 text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-2 focus:ring-accent"
      />
      <button
        type="submit"
        disabled={isPending}
        className="text-sm font-medium text-accent hover:underline disabled:opacity-50"
      >
        Сохранить
      </button>
      <button
        type="button"
        onClick={() => {
          setName(initialName);
          setIsEditing(false);
        }}
        className="text-sm text-foreground-muted hover:text-foreground"
      >
        Отмена
      </button>
    </form>
  );
}
