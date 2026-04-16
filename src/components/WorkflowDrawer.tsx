import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderContextCard } from "@/components/workflow/OrderContextCard";
import { FulfillmentModeCard } from "@/components/workflow/FulfillmentModeCard";
import { ErpWarehouseCard } from "@/components/workflow/ErpWarehouseCard";
import { DecisionExceptionsCard } from "@/components/workflow/DecisionExceptionsCard";
import { PickupScheduledCard } from "@/components/workflow/PickupScheduledCard";
import { CarrierDeliveryCard } from "@/components/workflow/CarrierDeliveryCard";
import { WorkflowColumn } from "@/components/workflow/WorkflowColumn";

import { workflowOrders } from "@/data/workflowData";
import type { ReleaseCase } from "@/data/releaseQueueData";

interface Props {
  releaseCase: ReleaseCase | null;
  onClose: () => void;
}

const flowTypeLabel = { pickup: "Pickup Scheduled", carrier: "Carrier Delivery" };

export function WorkflowDrawer({ releaseCase, onClose }: Props) {
  if (!releaseCase) return null;

  const isAldi = releaseCase.isAldi;
  const isMcLane = releaseCase.isMcLane;
  const order = isAldi ? workflowOrders[0] : isMcLane ? workflowOrders[1] : workflowOrders[0];

  // Generic case fallback columns (use ALDI workflow data when generic)
  const remainingColumns = order.columns.filter((c) => !["1-context", "2-fulfillment", "3-erp-check", "4-decision", "5a-pickup", "5b-carrier"].includes(c.id));

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop — only visible on xl+ where drawer is 75% */}
      <div className="hidden xl:block flex-1 bg-background/70 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer — full width below xl, 75% on xl+ */}
      <div className="w-full xl:w-[75%] bg-background border-l border-border flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-start justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">{releaseCase.customer}</h2>
              <span className="text-xs text-muted-foreground font-mono">PO #{releaseCase.poNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary/15 text-primary">
                {flowTypeLabel[releaseCase.flowType]}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-warning/15 text-warning">
                {releaseCase.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs h-7">View PO</Button>
            <Button variant="outline" size="sm" className="text-xs h-7">Open ERP</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Body: Kanban + Chat */}
        <div className="flex flex-1 min-h-0">
          {/* Kanban */}
          <div className="flex-1 overflow-x-auto overflow-y-auto p-3">
            <div className="flex gap-3 pb-4" style={{ minWidth: "max-content" }}>
              <Col title="1. Existing Order Context"><OrderContextCard /></Col>
              <Col title="2. Fulfillment Mode"><FulfillmentModeCard /></Col>
              <Col title="3. ERP + Warehouse Check"><ErpWarehouseCard /></Col>
              <Col title="4. Decision + Exceptions"><DecisionExceptionsCard /></Col>

              {/* 5A or 5B based on flow */}
              {releaseCase.flowType === "pickup" ? (
                <Col title="5. Pickup Scheduled Flow"><PickupScheduledCard /></Col>
              ) : (
                <Col title="5. Carrier Delivery Flow"><CarrierDeliveryCard /></Col>
              )}

              {/* 6, 7, 8 — use existing workflow data columns */}
              {remainingColumns.map((col) => (
                <WorkflowColumn key={col.id} data={col} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-[320px] max-w-[340px] flex-shrink-0">
      <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1 leading-tight">
        {title}
      </h3>
      {children}
    </div>
  );
}
