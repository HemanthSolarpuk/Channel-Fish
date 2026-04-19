import { ExternalLink, FileDown, Share2 } from "lucide-react";
import type { VmiProgramDetail } from "@/data/vmiProgramsData";
import { cn } from "@/lib/utils";
import { statusPillStyles } from "./vmiStyles";

function displayProgramName(programName: string) {
  return programName.replace(/\s+VMI$/, "");
}

export function ProgramHeader({ program }: { program: VmiProgramDetail }) {
  const stickyStats = [
    { label: "On Hand + Confirmed", value: program.summary.onHandPlusConfirmed },
    { label: "Weeks of Cover", value: program.summary.weeksOfCover },
    { label: "Open Order Quantity", value: program.summary.openOrderQuantity },
    { label: "On Water Quantity", value: program.summary.onWaterQuantity },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(148,163,184,0.08)]">
      <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground">{displayProgramName(program.summary.programName)}</h1>
            <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", statusPillStyles[program.programStatus])}>
              {program.programStatus}
            </span>
          </div>
          <div className="grid gap-x-6 gap-y-2 text-xs text-muted-foreground sm:grid-cols-2 xl:max-w-[760px] xl:grid-cols-2">
            <p><span className="font-medium text-foreground">Customer:</span> {program.customer}</p>
            <p><span className="font-medium text-foreground">Contract Period:</span> {program.contractPeriod}</p>
            <p><span className="font-medium text-foreground">Program Manager:</span> {program.planner}</p>
            <p><span className="font-medium text-foreground">Sales Owner:</span> {program.salesOwner}</p>
            <p><span className="font-medium text-foreground">Buyer:</span> {program.buyer}</p>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
            {stickyStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-secondary/60 px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                <p className="mt-1.5 text-base font-semibold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 2xl:justify-end">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 py-1.5 text-sm text-foreground hover:bg-accent">
            <FileDown className="h-4 w-4" /> Export
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 py-1.5 text-sm text-foreground hover:bg-accent">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 py-1.5 text-sm text-foreground hover:bg-accent">
            <ExternalLink className="h-4 w-4" /> Open ERP
          </button>
        </div>
      </div>
    </div>
  );
}
