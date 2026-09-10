import type { IconName } from "@/components/layout/icons";

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
};

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Дашборд", icon: "dashboard" },
  { href: "/live", label: "Онлайн", icon: "live" },
  { href: "/restaurants", label: "Рестораны", icon: "restaurants" },
  { href: "/orders", label: "Заказы", icon: "orders" },
  { href: "/employees", label: "Сотрудники", icon: "employees" },
  { href: "/finance", label: "Финансы", icon: "finance" },
  { href: "/analytics", label: "Аналитика", icon: "analytics" },
  { href: "/menu", label: "Меню", icon: "menu" },
  { href: "/warehouse", label: "Склад", icon: "warehouse" },
  { href: "/operations", label: "Операции", icon: "operations" },
  { href: "/alerts", label: "Уведомления", icon: "alerts" },
  { href: "/reports", label: "Отчёты", icon: "reports" },
  { href: "/settings", label: "Настройки", icon: "settings" },
];

// Compact subset for the mobile bottom bar (MASTER SPEC §36/§38) — a full
// thirteen-item sidebar doesn't fit a thumb-reachable bar.
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Дашборд", icon: "dashboard" },
  { href: "/live", label: "Онлайн", icon: "live" },
  { href: "/finance", label: "Финансы", icon: "finance" },
  { href: "/alerts", label: "Уведомл.", icon: "alerts" },
  { href: "/settings", label: "Настройки", icon: "settings" },
];
