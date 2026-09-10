import { requireUser } from "@/server/auth/session";
import { getAccessibleRestaurants } from "@/server/restaurants/accessible-restaurants";
import { getSelectedRestaurantId } from "@/server/restaurants/selected-restaurant";
import { isDemoMode } from "@/server/demo/demo-mode";
import { getTheme } from "@/server/theme/theme";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { RestaurantSwitcher } from "@/components/layout/RestaurantSwitcher";
import { SignOutButton } from "@/components/layout/SignOutButton";
import { DemoRoleSwitcher } from "@/components/layout/DemoRoleSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [restaurants, selectedRestaurantId, theme] = await Promise.all([
    getAccessibleRestaurants(user),
    getSelectedRestaurantId(),
    getTheme(),
  ]);
  const demo = isDemoMode();

  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar />
      {/* min-w-0: without it, this flex item refuses to shrink below its
          widest descendant's min-content width (e.g. a table), forcing the
          whole page wider than the viewport on mobile instead of letting
          that descendant scroll internally. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-y-2 border-b border-[var(--border)] bg-surface/80 px-4 py-3 backdrop-blur-md md:px-6">
          <RestaurantSwitcher restaurants={restaurants} selectedId={selectedRestaurantId} />
          <div className="flex flex-wrap items-center justify-end gap-2">
            {demo && (
              <>
                <span className="rounded-full bg-warning-soft px-2.5 py-1 text-xs font-medium text-warning">
                  Демо-режим
                </span>
                <DemoRoleSwitcher role={user.role} />
              </>
            )}
            <span className="hidden text-sm text-foreground-muted sm:inline">
              {user.email} · {user.role === "OWNER" ? "Владелец" : "Менеджер"}
            </span>
            <ThemeToggle theme={theme} />
            {!demo && <SignOutButton />}
          </div>
        </header>
        <main className="flex-1 px-4 pb-24 pt-5 md:px-8 md:pb-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
