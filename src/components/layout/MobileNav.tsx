import { MOBILE_NAV_ITEMS } from "@/components/layout/nav-items";
import { NavLink } from "@/components/layout/NavLink";

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur-md md:hidden">
      {MOBILE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          className="flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-foreground-subtle transition-colors data-[active=true]:text-accent"
        />
      ))}
    </nav>
  );
}
