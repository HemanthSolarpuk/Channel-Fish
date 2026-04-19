import { Button } from "@/components/ui/button";
import { HumanApprovalPanel } from "@/components/workflow/HumanApprovalPanel";
import { FileOutput, Send, PackageCheck, CheckCircle2, Square, CheckSquare } from "lucide-react";
import { useState } from "react";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-1.5 text-xs leading-snug">
      <span className="text-muted-foreground shrink-0 w-[100px]">{label}:</span>
      <span className="text-foreground font-medium min-w-0 whitespace-normal break-words">{value}</span>
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
    <div className="rounded-lg border bg-card p-2.5 md:p-3 space-y-2.5">
      {/* Header fields */}
      <div className="rounded-lg border bg-secondary/40 p-2.5 md:p-3 space-y-1.5">
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
      </div>

      {/* Line items */}
      <div className="space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Line Items</p>
        <div className="text-[11px] text-foreground bg-muted/50 rounded px-2 py-1 whitespace-normal break-words">
          <span className="font-medium">Fish Sticks & Crunchy Fillets</span> · 50 Carton
        </div>
        <div className="text-[11px] text-foreground bg-muted/50 rounded px-2 py-1 whitespace-normal break-words">
          <span className="font-medium">Beer Battered Cod Fillets</span> · 50 Carton
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1 pt-1 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Release Checklist</p>
          <span className="text-[10px] text-muted-foreground">{done}/{checklistItems.length} ready</span>
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
        title="Warehouse Sign-Off"
        quickActions={["Approve staging", "Request prep confirmation", "Hold pickup release"]}
        placeholder="Add pickup release notes, warehouse instructions, or alternate staging directions."
      />

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-border [&>button]:max-w-full [&>button]:whitespace-normal [&>button]:h-auto [&>button]:min-h-7 [&>button]:py-1 [&>button]:leading-tight">
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <FileOutput className="w-3 h-3" /> Generate Pickup Release
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <Send className="w-3 h-3" /> Send Warehouse Prep Note
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <PackageCheck className="w-3 h-3" /> Confirm Staging
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <CheckCircle2 className="w-3 h-3" /> Mark Pickup Complete
        </Button>
      </div>
    </div>
  );
}
