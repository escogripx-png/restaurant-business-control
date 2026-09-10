import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

const DEMO_REPORTS = [
  { id: "RPT-1", period: "Август 2026", generatedAt: "2026-09-01" },
  { id: "RPT-2", period: "Июль 2026", generatedAt: "2026-08-01" },
  { id: "RPT-3", period: "Июнь 2026", generatedAt: "2026-07-01" },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Отчёты</h1>
      <DemoDataBanner />

      <div className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-foreground-subtle">
                <th className="px-4 py-2 font-medium">Период</th>
                <th className="px-4 py-2 font-medium">Сформирован</th>
                <th className="px-4 py-2 font-medium">Экспорт</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_REPORTS.map((report) => (
                <tr key={report.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-2.5 font-medium text-foreground">{report.period}</td>
                  <td className="px-4 py-2.5 tabular-nums text-foreground-muted">{report.generatedAt}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-foreground-subtle">CSV / PDF (Phase 9)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
