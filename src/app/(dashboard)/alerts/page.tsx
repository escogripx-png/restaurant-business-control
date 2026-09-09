import { getDemoAlerts } from "@/server/demo/mock-operations";
import { DemoDataBanner } from "@/components/dashboard/DemoDataBanner";

const SEVERITY_STYLE: Record<string, string> = {
  INFO: "bg-zinc-100 text-zinc-700",
  WARNING: "bg-amber-100 text-amber-700",
  CRITICAL: "bg-red-100 text-red-700",
};

export default function AlertsPage() {
  const alerts = getDemoAlerts();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Alerts</h1>
      <DemoDataBanner />

      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl border border-black/5 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLE[alert.severity]}`}
                  >
                    {alert.severity}
                  </span>
                  <span className="font-medium text-foreground">{alert.title}</span>
                </div>
                <p className="mt-1 text-sm text-foreground/60">{alert.description}</p>
                <p className="mt-1 text-xs text-foreground/40">
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
