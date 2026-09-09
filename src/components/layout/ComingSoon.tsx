export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="rounded-2xl border border-dashed border-black/10 bg-white p-8 text-center text-sm text-foreground/50">
        Раздел появится в {phase}.
      </div>
    </div>
  );
}
