export function KpiCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: number;
}) {
  const changeColor =
    change === undefined ? "" : change >= 0 ? "text-emerald-600" : "text-red-600";

  return (
    <div className="min-w-0 rounded-2xl border border-black/5 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-foreground/50">
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-semibold tabular-nums text-foreground">{value}</div>
      {change !== undefined && (
        <div className={`mt-1 text-xs font-medium ${changeColor}`}>
          {change >= 0 ? "+" : ""}
          {change}% vs прошлый период
        </div>
      )}
    </div>
  );
}
