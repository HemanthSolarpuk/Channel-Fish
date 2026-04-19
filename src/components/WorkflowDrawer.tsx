import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, ChevronRight, X } from "lucide-react";
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
  pending: "bg-primary/10 text-primary",
  "in-progress": "bg-primary/10 text-primary",
  complete: "bg-success/15 text-success",
  exception: "bg-primary/10 text-primary",
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
  const [activeStepId, setActiveStepId] = useState("1-context");

  useEffect(() => {
    if (releaseCase) {
      setActiveStepId("1-context");
    }
  }, [releaseCase?.id]);

  if (!releaseCase) return null;

  const isAldi = releaseCase.isAldi;
  const isMcLane = releaseCase.isMcLane;
  const order = isAldi ? workflowOrders[0] : isMcLane ? workflowOrders[1] : workflowOrders[0];
  const scenario: Scenario = releaseCase.flowType === "pickup" ? "aldi" : "mclane";
  const orderedStepIds =
    releaseCase.flowType === "pickup"
      ? ["1-context", "2-fulfillment", "3-erp-check", "4-decision", "5a-pickup", "6-execution", "7-pod", "8-invoice"]
      : ["1-context", "2-fulfillment", "3-erp-check", "4-decision", "5b-carrier", "6-execution", "7-pod", "8-invoice"];

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
      <div className="absolute inset-0 bg-white/78 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-0 flex flex-col border-l border-border bg-background shadow-2xl">
        <div className="shrink-0 border-b border-border px-4 py-3 md:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="text-base font-semibold text-foreground">{releaseCase.customer}</h2>
                <span className="break-all font-mono text-xs text-muted-foreground sm:break-normal">PO #{releaseCase.poNumber}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {flowTypeLabel[releaseCase.flowType]}
                </span>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {releaseCase.status}
                </span>
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
              <Button variant="outline" size="sm" className="h-7 text-xs">View PO</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">Open ERP</Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-4 py-4 md:px-6">
          <div className="h-[calc(100vh-7rem)] max-h-[calc(100vh-7rem)] rounded-[28px] border border-stone-200 bg-stone-50 p-4 shadow-[0_18px_48px_rgba(148,163,184,0.12)] md:p-5">
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
    <section className="flex h-full max-h-full w-[540px] shrink-0 flex-col overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_12px_36px_rgba(148,163,184,0.12)]">
      <div className="rounded-t-[24px] border-b border-stone-200 bg-stone-100 px-4 py-2.5 text-slate-950">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">{step.title}</h3>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
              step.status === "complete" ? "bg-success/15 text-success" : "bg-stone-200 text-slate-700",
            )}
          >
            {statusLabel[step.status]}
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4">
        <div className="space-y-3">{step.content}</div>
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
  const collapsedTone = isBeforeActive ? "border-emerald-100 bg-emerald-50" : "border-stone-200 bg-white";

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
        <div
          className={cn(
            "flex w-10 shrink-0 items-center justify-center rounded-l-[22px] border-r px-1",
            isBeforeActive ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-stone-200 bg-stone-50 text-slate-500",
          )}
        >
          <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-semibold uppercase tracking-[0.28em]">
            {isBeforeActive ? "Completed" : "Queued"}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-3">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-stone-100 px-2 text-[10px] font-semibold text-foreground">
                  {index + 1}
                </span>
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold", statusStyles[step.status])}>
                  {statusLabel[step.status]}
                </span>
              </div>
              <h3 className="text-sm font-semibold leading-snug text-foreground">{step.title}</h3>
            </div>

            <div className="rounded-xl border border-stone-200 bg-background px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Summary</p>
              <p className="mt-2 line-clamp-6 text-xs leading-relaxed text-muted-foreground">{step.summary}</p>
            </div>

            <div className="space-y-2 rounded-xl border border-stone-200 bg-card px-3 py-3">
              <div className="h-1.5 w-16 rounded-full bg-stone-200" />
              <div className="h-1.5 w-24 rounded-full bg-stone-200" />
              <div className="h-1.5 w-20 rounded-full bg-stone-200" />
              {isBeforeActive ? (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Completed
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  Ready to open
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-stone-200 pt-3 text-xs">
            <span className={cn("font-medium", isBeforeActive ? "text-emerald-700" : "text-primary")}>
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
