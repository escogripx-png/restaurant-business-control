// Minimal stroke-style icon set (SF Symbols-inspired), 20x20, currentColor.
// Kept as simple primitives (rect/circle/line/path) rather than traced
// bezier art so every glyph stays legible at nav-item size.

export type IconName =
  | "dashboard"
  | "live"
  | "restaurants"
  | "orders"
  | "employees"
  | "finance"
  | "analytics"
  | "menu"
  | "warehouse"
  | "operations"
  | "alerts"
  | "reports"
  | "settings";

const commonProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function DashboardIcon() {
  return (
    <svg {...commonProps}>
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function LiveIcon() {
  return (
    <svg {...commonProps}>
      <circle cx="10" cy="10" r="3" fill="currentColor" stroke="none" />
      <circle cx="10" cy="10" r="7" opacity="0.35" />
    </svg>
  );
}

function RestaurantsIcon() {
  return (
    <svg {...commonProps}>
      <path d="M3 8.5 4.2 3.5h11.6L17 8.5" />
      <path d="M3 8.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M4 8.5V16.5h12V8.5" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg {...commonProps}>
      <path d="M5 3h10v14l-2.5-1.5L10 17l-2.5-1.5L5 17V3Z" />
      <line x1="7.5" y1="7" x2="12.5" y2="7" />
      <line x1="7.5" y1="10" x2="12.5" y2="10" />
    </svg>
  );
}

function EmployeesIcon() {
  return (
    <svg {...commonProps}>
      <circle cx="10" cy="7" r="3" />
      <path d="M3.5 17c1-3.5 4-5 6.5-5s5.5 1.5 6.5 5" />
    </svg>
  );
}

function FinanceIcon() {
  return (
    <svg {...commonProps}>
      <rect x="2.5" y="5" width="15" height="10.5" rx="2" />
      <line x1="2.5" y1="8.5" x2="17.5" y2="8.5" />
      <line x1="5" y1="12.3" x2="8" y2="12.3" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg {...commonProps}>
      <line x1="4" y1="17" x2="4" y2="10" />
      <line x1="10" y1="17" x2="10" y2="4" />
      <line x1="16" y1="17" x2="16" y2="12.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg {...commonProps}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6.2v3.8l2.6 2.6" />
    </svg>
  );
}

function WarehouseIcon() {
  return (
    <svg {...commonProps}>
      <path d="M10 2.8 17 6.5v7L10 17.2 3 13.5v-7L10 2.8Z" />
      <path d="M3 6.5 10 10l7-3.5" />
      <line x1="10" y1="10" x2="10" y2="17.2" />
    </svg>
  );
}

function OperationsIcon() {
  return (
    <svg {...commonProps}>
      <line x1="3" y1="6" x2="17" y2="6" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="14" x2="17" y2="14" />
      <circle cx="7" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="13" cy="10" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AlertsIcon() {
  return (
    <svg {...commonProps}>
      <path d="M6 8a4 4 0 0 1 8 0c0 3.5 1.2 4.8 1.2 4.8H4.8S6 11.5 6 8Z" />
      <path d="M8.3 15.5a1.8 1.8 0 0 0 3.4 0" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg {...commonProps}>
      <path d="M6 2.8h6l3 3v11.4H6V2.8Z" />
      <path d="M12 2.8v3h3" />
      <line x1="8" y1="10.5" x2="13" y2="10.5" />
      <line x1="8" y1="13.5" x2="13" y2="13.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg {...commonProps}>
      <circle cx="10" cy="10" r="2.6" />
      <path d="M10 3v1.8M10 15.2V17M17 10h-1.8M4.8 10H3M14.9 5.1l-1.3 1.3M6.4 13.6l-1.3 1.3M14.9 14.9l-1.3-1.3M6.4 6.4 5.1 5.1" />
    </svg>
  );
}

const ICONS: Record<IconName, () => React.JSX.Element> = {
  dashboard: DashboardIcon,
  live: LiveIcon,
  restaurants: RestaurantsIcon,
  orders: OrdersIcon,
  employees: EmployeesIcon,
  finance: FinanceIcon,
  analytics: AnalyticsIcon,
  menu: MenuIcon,
  warehouse: WarehouseIcon,
  operations: OperationsIcon,
  alerts: AlertsIcon,
  reports: ReportsIcon,
  settings: SettingsIcon,
};

export function NavIcon({ name }: { name: IconName }) {
  const Icon = ICONS[name];
  return <Icon />;
}
