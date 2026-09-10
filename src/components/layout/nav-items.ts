export type NavItem = {
  href: string;
  label: string;
  icon: string; // simple glyph for now; swap for an icon set in a later phase
};

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Дашборд", icon: "◧" },
  { href: "/live", label: "Онлайн", icon: "●" },
  { href: "/restaurants", label: "Рестораны", icon: "▦" },
  { href: "/orders", label: "Заказы", icon: "▤" },
  { href: "/employees", label: "Сотрудники", icon: "◔" },
  { href: "/finance", label: "Финансы", icon: "$" },
  { href: "/analytics", label: "Аналитика", icon: "▲" },
  { href: "/operations", label: "Операции", icon: "◆" },
  { href: "/alerts", label: "Уведомления", icon: "!" },
  { href: "/reports", label: "Отчёты", icon: "▥" },
  { href: "/settings", label: "Настройки", icon: "⚙" },
];

// Compact subset for the mobile bottom bar (MASTER SPEC §36/§38) — a full
// eleven-item sidebar doesn't fit a thumb-reachable bar.
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Дашборд", icon: "◧" },
  { href: "/live", label: "Онлайн", icon: "●" },
  { href: "/finance", label: "Финансы", icon: "$" },
  { href: "/alerts", label: "Уведомл.", icon: "!" },
  { href: "/settings", label: "Настройки", icon: "⚙" },
];
