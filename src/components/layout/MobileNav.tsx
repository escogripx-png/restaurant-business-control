import { MOBILE_NAV_ITEMS } from "@/components/layout/nav-items";
import { NavLink } from "@/components/layout/NavLink";

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-black/5 bg-white/95 backdrop-blur md:hidden">
      {MOBILE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] text-foreground/60 data-[active=true]:text-accent"
        />
      ))}
    </nav>
  );
}
