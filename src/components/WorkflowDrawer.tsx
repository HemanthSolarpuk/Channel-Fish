import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, ChevronRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderContextCard } from "@/components/workflow/OrderContextCard";
import { FulfillmentModeCard } from "@/components/workflow/FulfillmentModeCard";
import { ErpWarehouseCard } from "@/components/workflow/ErpWarehouseCard";
import { DecisionExceptionsCard } from "@/components/workflow/DecisionExceptionsCard";
import { PickupScheduledCard } from "@/components/workflow/PickupScheduledCard";
import { CarrierDeliveryCard } from "@/components/workflow/CarrierDeliveryCard";
import { WorkflowCard } from "@/components/workflow/WorkflowCard";

import { workflowOrders, type WorkflowColumnData, type WorkflowStatus } from "@/data/workflowData";
import type { ReleaseCase } from "@/data/releaseQueueData";
import { cn } from "@/lib/utils";

interface Props {
  releaseCase: ReleaseCase | null;
  onClose: () => void;
}

const flowTypeLabel = { pickup: "Pickup Scheduled", carrier: "Carrier Delivery" };
const statusStyles: Record<WorkflowStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-warning/15 text-warning",
  complete: "bg-success/15 text-success",
  exception: "bg-destructive/15 text-destructive",
};
const statusLabel: Record<WorkflowStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  complete: "Complete",
  exception: "Exception",
};

type Scenario = "aldi" | "mclane";

interface DrawerStep {
  id: string;
  title: string;
  status: WorkflowStatus;
  summary: string;
  content: ReactNode;
}

export function WorkflowDrawer({ releaseCase, onClose }: Props) {
  if (!releaseCase) return null;

  const isAldi = releaseCase.isAldi;
  const isMcLane = releaseCase.isMcLane;
  const order = isAldi ? workflowOrders[0] : isMcLane ? workflowOrders[1] : workflowOrders[0];
  const scenario: Scenario = releaseCase.flowType === "pickup" ? "aldi" : "mclane";
  const orderedStepIds =
    releaseCase.flowType === "pickup"
      ? ["1-context", "2-fulfillment", "3-erp-check", "4-decision", "5a-pickup", "6-execution", "7-pod", "8-invoice"]
      : ["1-context", "2-fulfillment", "3-erp-check", "4-decision", "5b-carrier", "6-execution", "7-pod", "8-invoice"];
  const [activeStepId, setActiveStepId] = useState("1-context");

  useEffect(() => {
    setActiveStepId("1-context");
  }, [releaseCase.id]);

  const stepMap = new Map(order.columns.map((column) => [column.id, column]));
  const steps: DrawerStep[] = orderedStepIds
    .map((id) => stepMap.get(id))
    .filter((column): column is WorkflowColumnData => Boolean(column))
    .map((column) => ({
      id: column.id,
      title: column.title,
      status: column.status,
      summary: getStepSummary(column, releaseCase),
      content: getStepContent(column, scenario, releaseCase.flowType),
    }));

  const activeIndex = steps.findIndex((step) => step.id === activeStepId);
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;
  const currentStep = steps[safeActiveIndex];
  const nextStep = steps[safeActiveIndex + 1];

  return (
    <div className="fixed inset-0 z-50">
      {/* Full-screen backdrop so sidebar width does not reduce drawer space */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />

      {/* Full-screen drawer */}
      <div className="absolute inset-0 bg-background border-l border-border flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 px-4 md:px-5 py-3 border-b border-border shrink-0">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2 className="text-base font-semibold text-foreground">{releaseCase.customer}</h2>
              <span className="text-xs text-muted-foreground font-mono break-all sm:break-normal">PO #{releaseCase.poNumber}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary/15 text-primary">
                {flowTypeLabel[releaseCase.flowType]}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-warning/15 text-warning">
                {releaseCase.status}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="text-xs h-7">View PO</Button>
            <Button variant="outline" size="sm" className="text-xs h-7">Open ERP</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-4 py-4 md:px-6">
          <div className="h-[calc(100vh-7.75rem)] max-h-[calc(100vh-7.75rem)] rounded-[28px] border border-border/80 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-5">
            <div className="flex h-full min-w-max items-start gap-4 pb-2">
            {steps.map((step, index) =>
              step.id === currentStep.id ? (
                <KanbanExpandedStep
                  key={step.id}
                  step={step}
                  nextStep={nextStep}
                  onAdvance={nextStep ? () => setActiveStepId(nextStep.id) : undefined}
                />
              ) : (
                <KanbanCollapsedStep
                  key={step.id}
                  step={step}
                  index={index}
                  isBeforeActive={index < safeActiveIndex}
                  onSelect={() => setActiveStepId(step.id)}
                />
              ),
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KanbanExpandedStep({
  step,
  nextStep,
  onAdvance,
}: {
  step: DrawerStep;
  nextStep?: DrawerStep;
  onAdvance?: () => void;
}) {
  return (
    <section className="flex h-full max-h-full w-[540px] shrink-0 flex-col overflow-hidden rounded-[24px] border border-sky-400/55 bg-[linear-gradient(180deg,rgba(24,30,42,0.94),rgba(17,22,33,0.98))] shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_18px_48px_rgba(15,23,42,0.55),0_0_48px_rgba(34,211,238,0.16)]">
      <div className="rounded-t-[24px] border-b border-sky-300/25 bg-[linear-gradient(90deg,rgba(34,211,238,0.92),rgba(56,189,248,0.78),rgba(103,232,249,0.92))] px-4 py-3 text-slate-950">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-900/75">Active Workflow</p>
            <h3 className="mt-1 text-sm font-semibold">{step.title}</h3>
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-950/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-950">
            {statusLabel[step.status]}
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4">
        <div className="space-y-4">
        <div className="rounded-xl border border-sky-300/12 bg-slate-900/45 px-3 py-2.5 text-xs text-foreground">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sky-300 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              {nextStep ? "AI next step" : "Workflow complete"}
            </div>
            <p className="text-muted-foreground">
              {nextStep ? `AI expects this PO to move to ${step.title === nextStep.title ? "the next stage" : nextStep.title} next.` : "This is the final workflow step for this PO."}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border/70 bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Current step
            </span>
            <p className="text-xs text-muted-foreground">{step.summary}</p>
          </div>
        </div>

        {step.content}
        </div>
      </div>

      {nextStep && onAdvance ? (
        <div className="flex justify-end border-t border-border px-3 py-2 md:px-4">
          <Button
            onClick={onAdvance}
            size="icon"
            className="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-[0_0_18px_rgba(59,130,246,0.3)]"
            aria-label={`Move to ${nextStep.title}`}
            title={`Move to ${nextStep.title}`}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function KanbanCollapsedStep({
  step,
  index,
  isBeforeActive,
  onSelect,
}: {
  step: DrawerStep;
  index: number;
  isBeforeActive: boolean;
  onSelect: () => void;
}) {
  const collapsedTone = isBeforeActive
    ? "border-emerald-400/35 bg-[linear-gradient(180deg,rgba(20,83,45,0.18),rgba(15,23,42,0.95))]"
    : "border-border/80 bg-[linear-gradient(180deg,rgba(30,41,59,0.34),rgba(15,23,42,0.95))]";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "h-full max-h-full w-[200px] shrink-0 overflow-hidden rounded-[22px] border text-left transition-colors hover:bg-card/40",
        collapsedTone,
      )}
    >
      <div className="flex h-full min-h-0">
        <div className={cn(
          "flex w-10 shrink-0 items-center justify-center rounded-l-[22px] border-r px-1",
          isBeforeActive
            ? "border-emerald-400/25 bg-emerald-300/12 text-emerald-200"
            : "border-white/10 bg-white/5 text-slate-300",
        )}>
          <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-semibold uppercase tracking-[0.28em]">
            {isBeforeActive ? "Completed" : "Queued"}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-3">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/8 px-2 text-[10px] font-semibold text-foreground">
                  {index + 1}
                </span>
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold", statusStyles[step.status])}>
                  {statusLabel[step.status]}
                </span>
              </div>
              <h3 className="text-sm font-semibold leading-snug text-foreground">{step.title}</h3>
            </div>

            <div className="rounded-xl border border-white/8 bg-background/28 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Summary</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-6">{step.summary}</p>
            </div>

            <div className="space-y-2 rounded-xl border border-white/8 bg-card/40 px-3 py-3">
              <div className="h-1.5 w-16 rounded-full bg-white/12" />
              <div className="h-1.5 w-24 rounded-full bg-white/10" />
              <div className="h-1.5 w-20 rounded-full bg-white/8" />
              {isBeforeActive ? (
                <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Completed
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-slate-500/15 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  Ready to open
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-white/8 pt-3 text-xs">
            <span className={cn("font-medium", isBeforeActive ? "text-emerald-300" : "text-primary")}>
              {isBeforeActive ? "Review again" : "Open lane"}
            </span>
            <ChevronRight className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    </button>
  );
}

function getStepSummary(column: WorkflowColumnData, releaseCase: ReleaseCase) {
  if (column.id === "1-context") return `Review PO ${releaseCase.poNumber} and verify existing order context.`;
  if (column.id === "2-fulfillment") return `Confirm whether this PO runs as ${flowTypeLabel[releaseCase.flowType]}.`;
  if (column.id === "3-erp-check") return "Validate ERP sync, warehouse allocation, and release readiness.";
  if (column.id === "4-decision") return "Review exceptions and confirm the release decision path.";
  return column.nextAction;
}

function getStepContent(column: WorkflowColumnData, scenario: Scenario, flowType: ReleaseCase["flowType"]) {
  if (column.id === "1-context") return <OrderContextCard scenario={scenario} />;
  if (column.id === "2-fulfillment") return <FulfillmentModeCard scenario={scenario} />;
  if (column.id === "3-erp-check") return <ErpWarehouseCard scenario={scenario} />;
  if (column.id === "4-decision") return <DecisionExceptionsCard scenario={scenario} />;
  if (column.id === "5a-pickup" && flowType === "pickup") return <PickupScheduledCard />;
  if (column.id === "5b-carrier" && flowType === "carrier") return <CarrierDeliveryCard />;
  return <WorkflowCard data={column} />;
}
