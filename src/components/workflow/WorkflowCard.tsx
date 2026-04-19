import { Badge } from "@/components/ui/badge";
import type { WorkflowColumnData, WorkflowStatus } from "@/data/workflowData";

const statusStyles: Record<WorkflowStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]",
  complete: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]",
  exception: "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]",
};

const statusLabel: Record<WorkflowStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  complete: "Complete",
  exception: "Exception",
};

const sourceTagColor: Record<string, string> = {
  PO: "bg-[hsl(var(--badge-po))]/15 text-[hsl(var(--badge-po))]",
  ERP: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]",
  WMS: "bg-[hsl(var(--badge-invoice))]/15 text-[hsl(var(--badge-invoice))]",
  QA: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]",
  OPS: "bg-[hsl(var(--info))]/15 text-[hsl(var(--info))]",
  TMS: "bg-[hsl(var(--badge-so))]/15 text-[hsl(var(--badge-so))]",
};

export function WorkflowCard({ data }: { data: WorkflowColumnData }) {
  const sourceFields = data.fields.filter((f) => f.source === "PO");
  const derivedFields = data.fields.filter((f) => f.source !== "PO");

  return (
    <div
      className={`rounded-lg border bg-card p-2.5 md:p-3 space-y-2.5 transition-opacity ${
        data.dimmed ? "opacity-35 pointer-events-none" : ""
      }`}
    >
      {/* Source Fields */}
      {sourceFields.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Source (PO)</p>
          {sourceFields.map((f, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs">
              <span className={`shrink-0 text-[9px] font-semibold px-1 py-px rounded ${sourceTagColor[f.source]}`}>
                {f.source}
              </span>
              <span className="text-muted-foreground shrink-0">{f.label}:</span>
              <span className="text-foreground font-medium min-w-0 whitespace-normal break-words">{f.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Derived Fields */}
      {derivedFields.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Derived</p>
          {derivedFields.map((f, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs">
              <span className={`shrink-0 text-[9px] font-semibold px-1 py-px rounded ${sourceTagColor[f.source]}`}>
                {f.source}
              </span>
              <span className="text-muted-foreground shrink-0">{f.label}:</span>
              <span className="text-foreground font-medium min-w-0 whitespace-normal break-words">{f.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Next Action */}
      <div className="pt-1 border-t border-border">
        <p className="text-[10px] text-muted-foreground">Next →</p>
        <p className="text-xs font-medium text-primary">{data.nextAction}</p>
      </div>
    </div>
  );
}
