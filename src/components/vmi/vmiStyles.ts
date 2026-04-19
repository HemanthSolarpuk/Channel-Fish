import type { ProgramSeverity, ProgramStatus, ProgramTone } from "@/data/vmiProgramsData";

export const statusPillStyles: Record<ProgramStatus, string> = {
  Healthy: "border border-success/25 bg-success/15 text-success",
  Watchlist: "border border-warning/30 bg-warning/15 text-warning",
  "At Risk": "border border-destructive/25 bg-destructive/15 text-destructive",
  Overstocked: "border border-primary/25 bg-primary/10 text-primary",
};

export const severityPillStyles: Record<ProgramSeverity, string> = {
  Low: "border border-success/25 bg-success/15 text-success",
  Medium: "border border-warning/30 bg-warning/15 text-warning",
  High: "border border-destructive/20 bg-destructive/10 text-destructive",
  Critical: "border border-destructive/25 bg-destructive/15 text-destructive",
};

export const tonePillStyles: Record<ProgramTone, string> = {
  good: "border border-success/25 bg-success/15 text-success",
  warning: "border border-warning/30 bg-warning/15 text-warning",
  critical: "border border-destructive/25 bg-destructive/15 text-destructive",
  info: "border border-primary/25 bg-primary/10 text-primary",
};
