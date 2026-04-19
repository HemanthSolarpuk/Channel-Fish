import { AlertTriangle, ArrowRightLeft, CircleAlert, PackageSearch } from "lucide-react";
import type { ProgramException } from "@/data/vmiProgramsData";
import { cn } from "@/lib/utils";
import { severityPillStyles } from "./vmiStyles";

interface Props {
  exceptions: ProgramException[];
  activeExceptionId: string | null;
  onSelectException: (id: string | null) => void;
  title?: string;
  description?: string;
  limit?: number;
  clearable?: boolean;
}

function iconForSeverity(severity: ProgramException["severity"]) {
  if (severity === "Critical") return CircleAlert;
  if (severity === "High") return AlertTriangle;
  if (severity === "Medium") return ArrowRightLeft;
  return PackageSearch;
}

export function ExceptionsPanel({
  exceptions,
  activeExceptionId,
  onSelectException,
  title = "Exceptions and Recommended Actions",
  description,
  limit,
  clearable = true,
}: Props) {
  const visibleExceptions = limit ? exceptions.slice(0, limit) : exceptions;

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(148,163,184,0.08)]">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {clearable && activeExceptionId ? (
          <button onClick={() => onSelectException(null)} className="text-sm font-medium text-primary">
            Clear focus
          </button>
        ) : null}
      </div>
      <div className="grid gap-2.5 xl:grid-cols-2">
        {visibleExceptions.map((item) => {
          const Icon = iconForSeverity(item.severity);
          const isActive = item.id === activeExceptionId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectException(isActive ? null : item.id)}
              className={cn(
                "rounded-xl border p-3.5 text-left transition-colors",
                isActive ? "border-primary bg-primary/5 shadow-[0_12px_24px_rgba(59,130,246,0.12)]" : "border-border bg-background hover:border-primary/30",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={cn("rounded-xl p-2", severityPillStyles[item.severity])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.issue}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.impactedSku} • {item.impactedLocation}</p>
                  </div>
                </div>
                <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", severityPillStyles[item.severity])}>
                  {item.severity}
                </span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <p className="text-muted-foreground"><span className="font-medium text-foreground">Reason:</span> {item.reason}</p>
                <div className="rounded-lg border border-primary/15 bg-primary/5 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Recommended Action</p>
                  <p className="mt-1 text-foreground">{item.recommendedAction}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
