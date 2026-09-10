import { getDemoAlerts } from "@/server/demo/mock-operations";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

const SEVERITY_STYLE: Record<string, string> = {
  INFO: "bg-surface-secondary text-foreground-muted",
  WARNING: "bg-warning-soft text-warning",
  CRITICAL: "bg-danger-soft text-danger",
};

const SEVERITY_LABEL: Record<string, string> = {
  INFO: "Инфо",
  WARNING: "Внимание",
  CRITICAL: "Критично",
};

export default function AlertsPage() {
  const alerts = getDemoAlerts();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-[26px] font-semibold tracking-tight text-foreground">Уведомления</h1>
      <DemoDataBanner />

      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLE[alert.severity]}`}
                  >
                    {SEVERITY_LABEL[alert.severity]}
                  </span>
                  <span className="font-medium text-foreground">{alert.title}</span>
                </div>
                <p className="mt-1 text-sm text-foreground-muted">{alert.description}</p>
                <p className="mt-1 text-xs text-foreground-subtle">
                  {alert.restaurantName} · {alert.createdAt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
