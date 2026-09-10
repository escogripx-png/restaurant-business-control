import { requireUser } from "@/server/auth/session";
import { getAccessibleRestaurants } from "@/server/restaurants/accessible-restaurants";
import { getSelectedRestaurantId } from "@/server/restaurants/selected-restaurant";
import { isDemoMode } from "@/server/demo/demo-mode";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { RestaurantSwitcher } from "@/components/layout/RestaurantSwitcher";
import { SignOutButton } from "@/components/layout/SignOutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [restaurants, selectedRestaurantId] = await Promise.all([
    getAccessibleRestaurants(user),
    getSelectedRestaurantId(),
  ]);
  const demo = isDemoMode();

  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 md:px-6">
          <RestaurantSwitcher restaurants={restaurants} selectedId={selectedRestaurantId} />
          <div className="flex items-center gap-3">
            {demo && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                Демо-режим
              </span>
            )}
            <span className="hidden text-sm text-foreground/60 sm:inline">
              {user.email} · {user.role === "OWNER" ? "Владелец" : "Менеджер"}
            </span>
            {!demo && <SignOutButton />}
          </div>
        </header>
        <main className="flex-1 px-4 pb-20 pt-4 md:px-6 md:pb-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
