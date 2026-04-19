import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FinanceLensMetric } from "@/data/vmiProgramsData";
import { cn } from "@/lib/utils";

export function FinanceExposurePanel({ metrics }: { metrics: FinanceLensMetric[] }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(148,163,184,0.08)]">
      <button type="button" onClick={() => setOpen((current) => !current)} className="flex w-full items-center justify-between text-left">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Finance Lens</h2>
          <p className="mt-1 text-xs text-muted-foreground">Lighter financial exposure view tied to the program inventory position.</p>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open ? "rotate-180" : "")} />
      </button>

      {open ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-border bg-background p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{metric.value}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{metric.detail}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
