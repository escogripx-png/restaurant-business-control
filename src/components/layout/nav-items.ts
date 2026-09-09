export type NavItem = {
  href: string;
  label: string;
  icon: string; // simple glyph for now; swap for an icon set in a later phase
};

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "◧" },
  { href: "/live", label: "Live", icon: "●" },
  { href: "/restaurants", label: "Restaurants", icon: "▦" },
  { href: "/orders", label: "Orders", icon: "▤" },
  { href: "/employees", label: "Employees", icon: "◔" },
  { href: "/finance", label: "Finance", icon: "$" },
  { href: "/analytics", label: "Analytics", icon: "▲" },
  { href: "/operations", label: "Operations", icon: "◆" },
  { href: "/alerts", label: "Alerts", icon: "!" },
  { href: "/reports", label: "Reports", icon: "▥" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

// Compact subset for the mobile bottom bar (MASTER SPEC §36/§38) — a full
// eleven-item sidebar doesn't fit a thumb-reachable bar.
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "◧" },
  { href: "/live", label: "Live", icon: "●" },
  { href: "/finance", label: "Finance", icon: "$" },
  { href: "/alerts", label: "Alerts", icon: "!" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];
