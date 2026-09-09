"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/components/layout/nav-items";

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
      {item.icon && <span aria-hidden>{item.icon}</span>}
      <span>{item.label}</span>
    </Link>
  );
}
