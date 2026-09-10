export function KpiCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: number;
}) {
  const changeColor = change === undefined ? "" : change >= 0 ? "text-success" : "text-danger";

  return (
    <div className="min-w-0 rounded-[20px] bg-surface p-5 shadow-[var(--shadow-card)] ring-1 ring-[var(--border)]">
      <div className="text-[13px] font-medium text-foreground-muted">{label}</div>
      <div className="mt-2 font-mono text-[30px] font-semibold tracking-tight tabular-nums text-foreground">
        {value}
      </div>
      {change !== undefined && (
        <div className={`mt-1.5 text-sm font-medium ${changeColor}`}>
          {change >= 0 ? "+" : ""}
          {change}% <span className="text-foreground-muted">vs прошлый период</span>
        </div>
      )}
    </div>
  );
}
