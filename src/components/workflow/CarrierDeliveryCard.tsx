import { Button } from "@/components/ui/button";
import { HumanApprovalPanel } from "@/components/workflow/HumanApprovalPanel";
import { Truck, Send, MessageSquare, CheckCircle2, Square, CheckSquare } from "lucide-react";
import { useState } from "react";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-1.5 text-xs leading-snug">
      <span className="text-muted-foreground shrink-0 w-[96px]">{label}:</span>
      <span className="text-foreground font-medium min-w-0 whitespace-normal break-words">{value}</span>
    </div>
  );
}

const checklistItems = [
  "Carrier schedule reviewed",
  "Dispatch timing confirmed",
  "Warehouse load note sent",
  "Palletized shipment readiness checked",
  "Shipment documents contain PO number",
];

type CarrierStatus = "ready" | "awaiting" | "in-transit";

const statusConfig: Record<CarrierStatus, { label: string; style: string }> = {
  ready: { label: "Carrier Ready", style: "bg-success/15 text-success" },
  awaiting: { label: "Awaiting Dispatch", style: "bg-primary/10 text-primary" },
  "in-transit": { label: "In Transit", style: "bg-primary/10 text-primary" },
};

export function CarrierDeliveryCard() {
  const [checked, setChecked] = useState<boolean[]>(checklistItems.map(() => false));
  const toggle = (i: number) => setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  const done = checked.filter(Boolean).length;

  const status: CarrierStatus = "awaiting";
  const s = statusConfig[status];

  return (
    <div className="rounded-lg border bg-card p-2.5 md:p-3 space-y-2.5">
      {/* Header */}
      <div className="rounded-lg border bg-secondary/40 p-2.5 md:p-3 space-y-1.5">
        <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">McLane Carrier Delivery</p>
        <Field label="Customer" value="McLane Foodservice, Inc." />
        <Field label="PO No" value="11428530" />
        <Field label="Ship To" value="Manassas, 7501 Century Park Rd, Manassas VA 20109" />
        <Field label="Ship Via" value="VANTIX LOGISTICS" />
      </div>

      {/* Shipment details */}
      <div className="space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Shipment Details</p>
        <Field label="PO Status" value="Accepted" />
        <Field label="Est. Ship" value="2026-02-26" />
        <Field label="Due Date" value="2026-02-27" />
        <Field label="Load Type" value="Pallet" />
        <Field label="Freight" value="COLLECT" />
      </div>

      {/* Line item */}
      <div className="space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Line Item</p>
        <div className="text-[11px] text-foreground bg-muted/50 rounded px-2 py-1 space-y-0.5">
          <div><span className="font-medium">FISH POLLOCK SHIM 2</span></div>
          <div className="text-muted-foreground whitespace-normal break-words">McLane Item: 00042073 · Supplier Item: 3260C006</div>
          <div className="whitespace-normal break-words">Qty: 700 CA · 14 Pallets · 31,360.0 lbs · 718.0 cube</div>
        </div>
      </div>

      {/* Totals */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-muted-foreground">Total Net PO Amount</span>
        <span className="text-foreground font-semibold">$85,977.50</span>
      </div>

      {/* Checklist */}
      <div className="space-y-1 pt-1 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Dispatch Checklist</p>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.style}`}>{s.label}</span>
            <span className="text-[10px] text-muted-foreground">{done}/{checklistItems.length} ready</span>
          </div>
        </div>
        {checklistItems.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flex items-center gap-2 w-full text-left text-xs py-0.5 hover:bg-secondary/30 rounded px-1 transition-colors"
          >
            {checked[i] ? (
              <CheckSquare className="w-3.5 h-3.5 text-[hsl(var(--success))] shrink-0" />
            ) : (
              <Square className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            )}
            <span className={`min-w-0 whitespace-normal break-words ${checked[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>{item}</span>
          </button>
        ))}
      </div>

      <HumanApprovalPanel
        title="Dispatch Approval"
        description="Confirm dispatch readiness with a quick action, or write custom instructions for carrier coordination."
        quickActions={["Approve dispatch", "Request carrier follow-up", "Hold shipment"]}
        placeholder="Add dispatch notes, carrier instructions, or alternate shipment handling guidance."
      />

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-border [&>button]:max-w-full [&>button]:whitespace-normal [&>button]:h-auto [&>button]:min-h-7 [&>button]:py-1 [&>button]:leading-tight">
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <Truck className="w-3 h-3" /> Confirm Dispatch Plan
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <Send className="w-3 h-3" /> Send Warehouse Load Note
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <MessageSquare className="w-3 h-3" /> Send Carrier Follow-up
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <CheckCircle2 className="w-3 h-3" /> Mark Shipped
        </Button>
      </div>
    </div>
  );
}
