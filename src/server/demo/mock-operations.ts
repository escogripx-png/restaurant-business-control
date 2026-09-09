/**
 * More UI-development-only fixtures (see mock-metrics.ts for the rationale).
 * Covers Orders, Employees, Expenses, Analytics-by-hour, Operations and
 * Alerts sections so the whole nav can be clicked through before Phase 3-9
 * wire up real data. Never import this from real business logic.
 */
import { DEMO_EMPLOYEES } from "@/server/demo/demo-data";
import { seededRandom } from "@/server/demo/seeded-random";

export type DemoOrder = {
  id: string;
  table: string;
  status: "OPEN" | "CLOSED";
  amountMinor: number;
  employeeName: string;
  openedAt: string;
};

export function getDemoOrders(restaurantId: string): DemoOrder[] {
  const employees = DEMO_EMPLOYEES.filter((e) => e.restaurantId === restaurantId);
  return Array.from({ length: 10 }, (_, i) => {
    const r = seededRandom(`${restaurantId}-order-${i}`);
    const employee = employees[i % Math.max(employees.length, 1)];
    const hour = 12 + Math.floor(r * 10);
    const minute = Math.floor(seededRandom(`${restaurantId}-min-${i}`) * 60);
    return {
      id: `ORD-${1000 + i}`,
      table: `Table ${1 + (i % 12)}`,
      status: r > 0.8 ? "OPEN" : "CLOSED",
      amountMinor: Math.round((300 + r * 2500) * 100),
      employeeName: employee?.name ?? "—",
      openedAt: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    };
  });
}

export type DemoEmployeeMetrics = {
  id: string;
  name: string;
  role: string;
  revenueMinor: number;
  orderCount: number;
  avgCheckMinor: number;
  discountPct: number;
  voidCount: number;
};

export function getDemoEmployeeMetrics(restaurantId: string): DemoEmployeeMetrics[] {
  return DEMO_EMPLOYEES.filter((e) => e.restaurantId === restaurantId).map((employee) => {
    const r = seededRandom(employee.id);
    const orderCount = Math.round(20 + r * 60);
    const revenueMinor = Math.round((15_000 + r * 40_000) * 100);
    return {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      revenueMinor,
      orderCount,
      avgCheckMinor: Math.round(revenueMinor / orderCount),
      discountPct: Math.round(r * 12 * 10) / 10,
      voidCount: Math.round(r * 5),
    };
  });
}

export type DemoExpense = {
  id: string;
  date: string;
  category: string;
  amountMinor: number;
  description: string;
};

const EXPENSE_CATEGORIES = ["Food purchasing", "Payroll", "Rent", "Marketing", "Bar / alcohol"];

export function getDemoExpenses(restaurantId: string): DemoExpense[] {
  return Array.from({ length: 8 }, (_, i) => {
    const r = seededRandom(`${restaurantId}-expense-${i}`);
    const category = EXPENSE_CATEGORIES[i % EXPENSE_CATEGORIES.length];
    return {
      id: `EXP-${100 + i}`,
      date: `2026-09-${String(1 + i).padStart(2, "0")}`,
      category,
      amountMinor: Math.round((2000 + r * 30_000) * 100),
      description: `${category} — demo entry`,
    };
  });
}

// Rough industry-typical expense ratios (of revenue) for a full-service
// restaurant, so the demo P&L lands on a plausible 5-15% margin instead of
// an implausible ~90% — real ratios come from Expense entities in Phase 5.
const EXPENSE_RATIO: Record<string, number> = {
  "Food purchasing": 0.3,
  Payroll: 0.28,
  Rent: 0.08,
  Marketing: 0.04,
  "Bar / alcohol": 0.1,
};

export function getDemoPnl(restaurantId: string) {
  const r = seededRandom(`${restaurantId}-pnl`);
  const revenueMinor = Math.round((900_000 + r * 400_000) * 100);

  const byCategory = EXPENSE_CATEGORIES.map((category) => {
    const jitter = 0.9 + seededRandom(`${restaurantId}-pnl-${category}`) * 0.2; // ±10%
    return {
      category,
      amountMinor: Math.round(revenueMinor * EXPENSE_RATIO[category] * jitter),
    };
  });
  const totalExpensesMinor = byCategory.reduce((sum, c) => sum + c.amountMinor, 0);
  const operatingResultMinor = revenueMinor - totalExpensesMinor;

  return {
    revenueMinor,
    totalExpensesMinor,
    operatingResultMinor,
    marginPct: Math.round((operatingResultMinor / revenueMinor) * 1000) / 10,
    byCategory,
  };
}

export function getDemoRevenueByHour(restaurantId: string) {
  const hours = [11, 12, 13, 14, 17, 18, 19, 20, 21, 22];
  return hours.map((hour) => {
    const r = seededRandom(`${restaurantId}-hour-${hour}`);
    return { hour, revenueMinor: Math.round((5_000 + r * 45_000) * 100) };
  });
}

export type DemoOperationEvent = {
  id: string;
  type: "DISCOUNT" | "VOID" | "REFUND";
  restaurantId: string;
  employeeName: string;
  amountMinor: number;
  reason: string;
  at: string;
};

export function getDemoOperations(restaurantId: string): DemoOperationEvent[] {
  const employees = DEMO_EMPLOYEES.filter((e) => e.restaurantId === restaurantId);
  const types: DemoOperationEvent["type"][] = ["DISCOUNT", "VOID", "REFUND"];
  const reasons: Record<DemoOperationEvent["type"], string[]> = {
    DISCOUNT: ["Loyalty discount", "Manager comp", "Birthday promo"],
    VOID: ["Wrong item entered", "Kitchen error", "Guest changed mind"],
    REFUND: ["Quality complaint", "Duplicate charge", "Order cancelled"],
  };

  return Array.from({ length: 6 }, (_, i) => {
    const r = seededRandom(`${restaurantId}-op-${i}`);
    const type = types[i % types.length];
    const employee = employees[i % Math.max(employees.length, 1)];
    return {
      id: `OP-${200 + i}`,
      type,
      restaurantId,
      employeeName: employee?.name ?? "—",
      amountMinor: Math.round((100 + r * 1500) * 100),
      reason: reasons[type][i % reasons[type].length],
      at: `2026-09-${String(1 + i).padStart(2, "0")} ${12 + i}:${String(i * 7).padStart(2, "0")}`,
    };
  });
}

export type DemoAlert = {
  id: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  description: string;
  restaurantName: string;
  createdAt: string;
};

export function getDemoAlerts(): DemoAlert[] {
  return [
    {
      id: "ALT-1",
      severity: "WARNING",
      title: "Void rate above peers",
      description: "Petr Svoboda: void rate 8.2% vs team average 2.1% over the last 7 days.",
      restaurantName: "Restaurant Prague 1",
      createdAt: "2026-09-09 14:20",
    },
    {
      id: "ALT-2",
      severity: "CRITICAL",
      title: "Revenue below historical baseline",
      description: "Friday 19:00–20:00 revenue is 32.6% below the typical range for this slot.",
      restaurantName: "Restaurant Prague 2",
      createdAt: "2026-09-08 20:05",
    },
    {
      id: "ALT-3",
      severity: "INFO",
      title: "Discount level unusually high",
      description: "Average discount this week is 9.4%, above the usual 4–6% range.",
      restaurantName: "Restaurant Prague 1",
      createdAt: "2026-09-07 11:00",
    },
  ];
}
