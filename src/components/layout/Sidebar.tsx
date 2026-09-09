import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav-items";
import { NavLink } from "@/components/layout/NavLink";

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-black/5 bg-white px-3 py-4 md:flex">
      <div className="px-2 pb-4 text-sm font-semibold tracking-tight text-foreground">
        Restaurant Control
      </div>
      <nav className="flex flex-1 flex-col gap-0.5">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground/70 hover:bg-black/[.03] hover:text-foreground data-[active=true]:bg-foreground data-[active=true]:text-white"
          />
        ))}
      </nav>
    </aside>
  );
}
