import { requireUser } from "@/server/auth/session";
import { getAccessibleRestaurantIds } from "@/server/auth/permissions";
import { listRestaurantsByIds } from "@/server/repositories/restaurant.repository";
import { getSelectedRestaurantId } from "@/server/restaurants/selected-restaurant";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { RestaurantSwitcher } from "@/components/layout/RestaurantSwitcher";
import { SignOutButton } from "@/components/layout/SignOutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const restaurantIds = await getAccessibleRestaurantIds(user);
  const [restaurants, selectedRestaurantId] = await Promise.all([
    listRestaurantsByIds(user.organizationId, restaurantIds),
    getSelectedRestaurantId(),
  ]);

  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 md:px-6">
          <RestaurantSwitcher restaurants={restaurants} selectedId={selectedRestaurantId} />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-foreground/60 sm:inline">
              {user.email} · {user.role}
            </span>
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 px-4 pb-20 pt-4 md:px-6 md:pb-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
