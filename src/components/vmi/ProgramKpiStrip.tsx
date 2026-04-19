import type { ProgramKpi } from "@/data/vmiProgramsData";
export function ProgramKpiStrip({ items }: { items: ProgramKpi[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-border bg-card p-3.5 shadow-[0_10px_28px_rgba(148,163,184,0.08)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
          <div className="mt-2.5 flex items-start justify-between gap-3">
            <p className="text-xl font-semibold text-foreground">{item.value}</p>
          </div>
          {item.detail ? <p className="mt-2 text-xs text-muted-foreground">{item.detail}</p> : null}
        </div>
      ))}
    </div>
  );
}
