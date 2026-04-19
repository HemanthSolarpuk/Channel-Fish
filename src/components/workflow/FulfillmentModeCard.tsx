import { Button } from "@/components/ui/button";
import { HumanApprovalPanel } from "@/components/workflow/HumanApprovalPanel";
import { CheckCircle, FileSearch, ClipboardList } from "lucide-react";
type Scenario = "aldi" | "mclane";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-1.5 text-xs leading-snug">
      <span className="text-muted-foreground shrink-0 w-[92px]">{label}:</span>
      <span className="text-foreground font-medium min-w-0 whitespace-normal break-words">{value}</span>
    </div>
  );
}

function ModeCard({
  title,
  subtitle,
  fields,
}: {
  title: string;
  subtitle: string;
  fields: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-lg border bg-secondary/40 p-2.5 md:p-3 space-y-1.5">
      <div>
        <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{title}</p>
        <p className="text-[10px] text-muted-foreground">{subtitle}</p>
      </div>
      {fields.map((f, i) => (
        <Field key={i} label={f.label} value={f.value} />
      ))}
    </div>
  );
}

export function FulfillmentModeCard({ scenario }: { scenario: Scenario }) {
  return (
    <div className="rounded-lg border bg-card p-2.5 md:p-3 space-y-2.5">
      {scenario === "mclane" ? (
        <ModeCard
          title="Carrier Delivery / Collect Freight"
          subtitle="McLane PO reference"
          fields={[
            { label: "Customer", value: "McLane Foodservice, Inc." },
            { label: "Ship To", value: "Manassas" },
            { label: "Est. Ship", value: "2026-02-26" },
            { label: "Due Date", value: "2026-02-27" },
            { label: "Ship Via", value: "VANTIX LOGISTICS" },
            { label: "Load Type", value: "Pallet" },
            { label: "Freight", value: "COLLECT" },
          ]}
        />
      ) : (
        <ModeCard
          title="Pickup Scheduled"
          subtitle="ALDI PO reference"
          fields={[
            { label: "Customer", value: "Aldi Inc." },
            { label: "Pickup Location", value: "Americold Allentown Ambassador" },
            { label: "Ship To", value: "South Windsor DC" },
            { label: "Pickup Date", value: "04/07/2026" },
            { label: "Delivery Date", value: "04/08/2026" },
          ]}
        />
      )}

      <HumanApprovalPanel
        quickActions={
          scenario === "mclane"
            ? ["Approve carrier mode", "Request logistics review", "Hold for clarification"]
            : ["Approve pickup mode", "Request warehouse review", "Hold for clarification"]
        }
        placeholder="Add any routing notes, approval context, or alternate execution instructions."
      />

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-border [&>button]:max-w-full [&>button]:whitespace-normal [&>button]:h-auto [&>button]:min-h-7 [&>button]:py-1 [&>button]:leading-tight">
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <CheckCircle className="w-3 h-3" /> Confirm Mode
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <FileSearch className="w-3 h-3" /> View Source Fields
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <ClipboardList className="w-3 h-3" /> Open Checklist
        </Button>
      </div>
    </div>
  );
}
