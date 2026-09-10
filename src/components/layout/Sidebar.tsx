import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav-items";
import { NavLink } from "@/components/layout/NavLink";

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--border)] bg-surface px-3 py-5 md:flex">
      <div className="px-3 pb-5 text-[15px] font-semibold tracking-tight text-foreground">
        Restaurant Control
      </div>
      <nav className="flex flex-1 flex-col gap-0.5">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            className="flex items-center gap-3 rounded-[10px] px-3 py-2 text-[13px] font-medium text-foreground-muted transition-colors hover:bg-surface-secondary hover:text-foreground data-[active=true]:bg-accent-soft data-[active=true]:text-accent"
          />
        ))}
      </nav>
    </aside>
  );
}
