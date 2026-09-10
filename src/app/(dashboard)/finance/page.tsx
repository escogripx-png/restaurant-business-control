import Link from "next/link";
import { requireUser } from "@/server/auth/session";
import { resolveRestaurantScope } from "@/server/restaurants/accessible-restaurants";
import { getDemoPnl } from "@/server/demo/mock-operations";
import { formatMoney } from "@/lib/money";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

export default async function FinancePage() {
  const user = await requireUser();
  const { scopedRestaurants } = await resolveRestaurantScope(user);
  const currency = scopedRestaurants[0]?.currency ?? "RUB";

  const pnls = scopedRestaurants.map((r) => getDemoPnl(r.id));
  const revenueMinor = pnls.reduce((s, p) => s + p.revenueMinor, 0);
  const expensesMinor = pnls.reduce((s, p) => s + p.totalExpensesMinor, 0);
  const operatingResultMinor = revenueMinor - expensesMinor;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Финансы</h1>
      <DemoDataBanner />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Выручка (месяц)" value={formatMoney(revenueMinor, currency)} />
        <KpiCard label="Расходы (месяц)" value={formatMoney(expensesMinor, currency)} />
        <KpiCard label="Прибыль (оценка)" value={formatMoney(operatingResultMinor, currency)} />
        <KpiCard
          label="Маржа"
          value={`${Math.round((operatingResultMinor / revenueMinor) * 1000) / 10}%`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/finance/expenses"
          className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-4 hover:ring-[color:var(--border-strong)]"
        >
          <div className="font-medium text-foreground">Расходы</div>
          <p className="mt-1 text-sm text-foreground-subtle">
            Учёт расходов по категориям, повторяющиеся платежи (аренда, ФОТ и т.д.).
          </p>
        </Link>
        <Link
          href="/finance/pnl"
          className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-4 hover:ring-[color:var(--border-strong)]"
        >
          <div className="font-medium text-foreground">P&L</div>
          <p className="mt-1 text-sm text-foreground-subtle">
            Прибыль (оценка) по периодам, разбивка по ресторанам и категориям.
          </p>
        </Link>
      </div>
    </div>
  );
}
