"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setSelectedRestaurantId } from "@/server/restaurants/selected-restaurant";
import { ALL_RESTAURANTS } from "@/server/restaurants/constants";

type Restaurant = { id: string; name: string };

export function RestaurantSwitcher({
  restaurants,
  selectedId,
}: {
  restaurants: Restaurant[];
  selectedId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      await setSelectedRestaurantId(value);
      router.refresh();
    });
  }

  return (
    <select
      value={selectedId}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-foreground outline-none disabled:opacity-60"
    >
      <option value={ALL_RESTAURANTS}>Все рестораны</option>
      {restaurants.map((restaurant) => (
        <option key={restaurant.id} value={restaurant.id}>
          {restaurant.name}
        </option>
      ))}
    </select>
  );
}
