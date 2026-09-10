"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/components/layout/nav-items";
import { NavIcon } from "@/components/layout/icons";

export function NavLink({ item, className }: { item: NavItem; className?: string }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={className}
      data-active={isActive}
    >
      <span aria-hidden className="shrink-0">
        <NavIcon name={item.icon} />
      </span>
      {/* w-full (not just max-w-full) so this actually has a bounded box to
          truncate against — the parent Link is a column flexbox with
          items-center, which sizes children to their natural width instead
          of stretching them, so max-width alone never had anything to cap. */}
      <span className="w-full truncate text-center">{item.label}</span>
    </Link>
  );
}
