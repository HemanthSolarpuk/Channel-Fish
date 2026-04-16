import { Button } from "@/components/ui/button";
import { FileOutput, Send, PackageCheck, CheckCircle2, Square, CheckSquare } from "lucide-react";
import { useState } from "react";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1.5 text-xs leading-snug">
      <span className="text-muted-foreground shrink-0">{label}:</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

const checklistItems = [
  "Pickup release prepared",
  "Warehouse prep note sent",
  "Pickup slot confirmed",
  "Staged quantity verified",
  "Outbound paperwork includes PO number",
];

export function PickupScheduledCard() {
  const [checked, setChecked] = useState<boolean[]>(checklistItems.map(() => false));

  const toggle = (i: number) => setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  const done = checked.filter(Boolean).length;

  return (
    <div className="rounded-lg border bg-card p-3 space-y-3">
      {/* Status */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--info))]/15 text-[hsl(var(--info))]">
          Pickup Scheduled
        </span>
        <span className="text-[10px] text-muted-foreground">{done}/{checklistItems.length} ready</span>
      </div>

      {/* Header fields */}
      <div className="rounded-lg border bg-secondary/40 p-3 space-y-1.5">
        <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">ALDI Pickup</p>
        <Field label="Customer" value="Aldi Inc." />
        <Field label="PO No" value="7516245499" />
        <Field label="Pickup Location" value="Americold Allentown Ambassador" />
        <Field label="Ship To" value="South Windsor DC" />
      </div>

      {/* Detail fields */}
      <div className="space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Shipment Details</p>
        <Field label="Pickup Date" value="04/07/2026" />
        <Field label="Delivery Date" value="04/08/2026" />
        <Field label="Supplier" value="Channel Fish Processing Co. Inc" />
      </div>

      {/* Line items */}
      <div className="space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Line Items</p>
        <div className="text-[11px] text-foreground bg-muted/50 rounded px-2 py-1">
          <span className="font-medium">Fish Sticks & Crunchy Fillets</span> · 50 Carton
        </div>
        <div className="text-[11px] text-foreground bg-muted/50 rounded px-2 py-1">
          <span className="font-medium">Beer Battered Cod Fillets</span> · 50 Carton
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1 pt-1 border-t border-border">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Release Checklist</p>
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
            <span className={checked[i] ? "text-muted-foreground line-through" : "text-foreground"}>{item}</span>
          </button>
        ))}
      </div>

      {/* AI Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-md px-3 py-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Ubik AI</p>
        <p className="text-xs text-foreground">
          Ubik is managing the pickup-based release flow using the actual ALDI PO dates, pickup site, destination, and item quantities.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2 gap-1">
          <FileOutput className="w-3 h-3" /> Generate Pickup Release
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2 gap-1">
          <Send className="w-3 h-3" /> Send Warehouse Prep Note
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2 gap-1">
          <PackageCheck className="w-3 h-3" /> Confirm Staging
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2 gap-1">
          <CheckCircle2 className="w-3 h-3" /> Mark Pickup Complete
        </Button>
      </div>
    </div>
  );
}
