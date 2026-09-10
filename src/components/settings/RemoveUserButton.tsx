"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeDemoUser } from "@/server/demo/demo-user-store";

export function RemoveUserButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await removeDemoUser(userId);
          router.refresh();
        })
      }
      className="text-sm text-danger hover:underline disabled:opacity-50"
    >
      Удалить
    </button>
  );
}
