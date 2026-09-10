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
      <div className="text-[13px] font-medium text-foreground-subtle">{label}</div>
      <div className="mt-1 text-[26px] font-semibold tracking-tight tabular-nums text-foreground">
        {value}
      </div>
      {change !== undefined && (
        <div className={`mt-1 text-[13px] font-medium ${changeColor}`}>
          {change >= 0 ? "+" : ""}
          {change}% vs прошлый период
        </div>
      )}
    </div>
  );
}
