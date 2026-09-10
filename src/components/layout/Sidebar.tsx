import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav-items";
import { NavLink } from "@/components/layout/NavLink";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] bg-surface px-4 py-6 md:flex">
      <div className="px-2 pb-7 font-serif text-[19px] font-semibold tracking-tight text-foreground">
        Restaurant Control
      </div>
      <nav className="flex flex-1 flex-col gap-0.5">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            className="relative flex items-center gap-3 rounded-lg py-3 pl-4 pr-3 text-[15px] font-medium text-foreground-muted transition-colors before:absolute before:inset-y-1.5 before:left-0 before:w-[2px] before:rounded-full before:bg-accent before:opacity-0 before:shadow-[var(--accent-glow)] before:transition-opacity hover:text-foreground data-[active=true]:text-foreground data-[active=true]:before:opacity-100 [&_svg]:text-foreground-muted data-[active=true]:[&_svg]:text-accent"
          />
        ))}
      </nav>
    </aside>
  );
}
