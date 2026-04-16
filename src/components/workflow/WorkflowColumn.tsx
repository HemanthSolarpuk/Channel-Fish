import { WorkflowCard } from "./WorkflowCard";
import type { WorkflowColumnData } from "@/data/workflowData";

export function WorkflowColumn({ data }: { data: WorkflowColumnData }) {
  return (
    <div className="min-w-[200px] max-w-[220px] flex-shrink-0 snap-start">
      <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1 leading-tight">
        {data.title}
      </h3>
      <WorkflowCard data={data} />
    </div>
  );
}
