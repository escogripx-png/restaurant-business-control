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
  const currency = scopedRestaurants[0]?.currency ?? "CZK";

  const pnls = scopedRestaurants.map((r) => getDemoPnl(r.id));
  const revenueMinor = pnls.reduce((s, p) => s + p.revenueMinor, 0);
  const expensesMinor = pnls.reduce((s, p) => s + p.totalExpensesMinor, 0);
  const operatingResultMinor = revenueMinor - expensesMinor;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Finance</h1>
      <DemoDataBanner />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Revenue (month)" value={formatMoney(revenueMinor, currency)} />
        <KpiCard label="Expenses (month)" value={formatMoney(expensesMinor, currency)} />
        <KpiCard label="Estimated Operating Profit" value={formatMoney(operatingResultMinor, currency)} />
        <KpiCard
          label="Margin"
          value={`${Math.round((operatingResultMinor / revenueMinor) * 1000) / 10}%`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/finance/expenses"
          className="rounded-2xl border border-black/5 bg-white p-4 hover:border-black/15"
        >
          <div className="font-medium text-foreground">Expenses</div>
          <p className="mt-1 text-sm text-foreground/50">
            Учёт расходов по категориям, повторяющиеся платежи (аренда, ФОТ и т.д.).
          </p>
        </Link>
        <Link
          href="/finance/pnl"
          className="rounded-2xl border border-black/5 bg-white p-4 hover:border-black/15"
        >
          <div className="font-medium text-foreground">P&L</div>
          <p className="mt-1 text-sm text-foreground/50">
            Estimated Operating Profit по периодам, разбивка по ресторанам и категориям.
          </p>
        </Link>
      </div>
    </div>
  );
}
