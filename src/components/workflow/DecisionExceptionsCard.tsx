import { Button } from "@/components/ui/button";
import { HumanApprovalPanel } from "@/components/workflow/HumanApprovalPanel";
import { Rocket, Warehouse, Truck, ShieldAlert } from "lucide-react";
type Scenario = "aldi" | "mclane";

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-1.5 text-xs leading-snug">
      <span className="text-muted-foreground shrink-0 w-[126px]">{label}:</span>
      <span className={`font-medium min-w-0 whitespace-normal break-words ${highlight ? "text-[hsl(var(--warning))]" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

type DecisionState = "release" | "await-warehouse" | "await-carrier" | "qa-hold" | "doc-exception";

const decisionConfig: Record<DecisionState, { label: string; style: string }> = {
  release: { label: "Release Now", style: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]" },
  "await-warehouse": { label: "Await Warehouse Confirmation", style: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]" },
  "await-carrier": { label: "Await Carrier Readiness", style: "bg-[hsl(var(--info))]/15 text-[hsl(var(--info))]" },
  "qa-hold": { label: "Hold for QA", style: "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]" },
  "doc-exception": { label: "Documentation Exception", style: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]" },
};

function DecisionChip({ state }: { state: DecisionState }) {
  const c = decisionConfig[state];
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.style}`}>{c.label}</span>;
}

function Note({ title, text, variant }: { title: string; text: string; variant: "warning" | "info" }) {
  const styles = {
    warning: "bg-[hsl(var(--warning))]/5 border-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]",
    info: "bg-[hsl(var(--info))]/5 border-[hsl(var(--info))]/20 text-[hsl(var(--info))]",
  };
  return (
    <div className={`border rounded-md px-3 py-2 ${styles[variant]}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5">{title}</p>
      <p className="text-xs text-foreground whitespace-normal break-words">{text}</p>
    </div>
  );
}

function ExampleTile({
  label,
  decisions,
  fields,
  notes,
  aiRec,
}: {
  label: string;
  decisions: DecisionState[];
  fields: { label: string; value: string; highlight?: boolean }[];
  notes: { title: string; text: string; variant: "warning" | "info" }[];
  aiRec: string;
}) {
  return (
    <div className="rounded-lg border bg-secondary/40 p-2.5 md:p-3 space-y-1.5">
      <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{label}</p>

      {/* Decision path chips */}
      <div className="flex flex-wrap gap-1">
        {decisions.map((d, i) => (
          <DecisionChip key={i} state={d} />
        ))}
      </div>

      {/* Fields */}
      <div className="space-y-1">
        {fields.map((f, i) => (
          <Field key={i} {...f} />
        ))}
      </div>

      {/* Notes */}
      {notes.map((n, i) => (
        <Note key={i} {...n} />
      ))}

      {/* AI Recommendation */}
      <div className="flex items-start gap-1.5 text-[11px] text-foreground bg-primary/5 border border-primary/20 rounded px-2 py-1.5">
        <span className="text-primary font-semibold shrink-0">AI →</span>
        <span className="min-w-0 whitespace-normal break-words">{aiRec}</span>
      </div>
    </div>
  );
}

export function DecisionExceptionsCard({ scenario }: { scenario: Scenario }) {
  return (
    <div className="rounded-lg border bg-card p-2.5 md:p-3 space-y-2.5">
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]">
        Decision Evaluated
      </span>

      {scenario === "mclane" ? (
        <ExampleTile
          label="McLane — Carrier Delivery"
          decisions={["await-carrier", "doc-exception"]}
          fields={[
            { label: "Release Item", value: "FISH POLLOCK SHIM 2" },
            { label: "Lot Number", value: "LOT-CFP-26-0398" },
            { label: "Quantity", value: "700 CA / 14 Pallets" },
            { label: "Exception Reason", value: "Carrier dispatch not yet confirmed", highlight: true },
            { label: "Confirmation Needed From", value: "VANTIX LOGISTICS — dispatch desk", highlight: true },
          ]}
          notes={[
            { title: "Documentation Note", text: "Confirm receipt, delivery date, quantity, and pricing within 24 hours.", variant: "warning" },
            { title: "Freight Note", text: "Collect freight — carrier already indicated as VANTIX LOGISTICS.", variant: "info" },
          ]}
          aiRec="Await carrier readiness or dispatch confirmation before release. Freight is collect, no prepaid action needed."
        />
      ) : (
        <ExampleTile
          label="ALDI — Pickup Scheduled"
          decisions={["release", "await-warehouse"]}
          fields={[
            { label: "Release Item", value: "Fish Sticks & Crunchy Fillets, Beer Battered Cod Fillets" },
            { label: "Lot Number", value: "LOT-CFP-26-0441" },
            { label: "Quantity", value: "100 Cartons (50 + 50)" },
            { label: "Exception Reason", value: "Staging not yet confirmed at Americold Allentown", highlight: true },
            { label: "Confirmation Needed From", value: "Warehouse Ops, Americold", highlight: true },
          ]}
          notes={[
            { title: "Documentation Note", text: "PO number must appear on all release documents.", variant: "warning" },
          ]}
          aiRec="Release after pickup prep confirmation. Await warehouse manifest / prep note if staging not confirmed."
        />
      )}

      {/* AI Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-md px-2.5 py-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Ubik AI</p>
        <p className="text-xs text-foreground">
          Ubik has decided whether the order can move now, whether warehouse confirmation is still pending, or whether carrier readiness must be confirmed first.
        </p>
      </div>

      <HumanApprovalPanel
        title="Human Decision"
        description={
          scenario === "mclane"
            ? "Choose a fast decision for dispatch and documentation, or write alternate instructions."
            : "Approve release, wait for warehouse confirmation, or add alternate release instructions."
        }
        quickActions={
          scenario === "mclane"
            ? ["Approve carrier follow-up", "Hold until dispatch confirmed", "Escalate documentation issue"]
            : ["Approve release now", "Wait for warehouse confirmation", "Escalate release exception"]
        }
        placeholder="Write instructions for the next decision, escalation path, or release conditions."
      />

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-border [&>button]:max-w-full [&>button]:whitespace-normal [&>button]:h-auto [&>button]:min-h-7 [&>button]:py-1 [&>button]:leading-tight">
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <Rocket className="w-3 h-3" /> Release Now
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <Warehouse className="w-3 h-3" /> Send Warehouse Instruction
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <Truck className="w-3 h-3" /> Send Carrier Follow-up
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <ShieldAlert className="w-3 h-3" /> Hold and Escalate
        </Button>
      </div>
    </div>
  );
}
