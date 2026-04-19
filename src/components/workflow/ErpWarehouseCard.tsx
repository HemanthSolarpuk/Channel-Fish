import { Button } from "@/components/ui/button";
import { HumanApprovalPanel } from "@/components/workflow/HumanApprovalPanel";
import { Package, FlaskConical, Warehouse, MapPin } from "lucide-react";
type Scenario = "aldi" | "mclane";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-1.5 text-xs leading-snug">
      <span className="text-muted-foreground shrink-0 w-[108px]">{label}:</span>
      <span className="text-foreground font-medium min-w-0 whitespace-normal break-words">{value}</span>
    </div>
  );
}

function SourceTag({ tag }: { tag: string }) {
  const colors: Record<string, string> = {
    PO: "bg-[hsl(var(--badge-po))]/15 text-[hsl(var(--badge-po))]",
    ERP: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]",
    WMS: "bg-[hsl(var(--badge-invoice))]/15 text-[hsl(var(--badge-invoice))]",
    QA: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]",
  };
  return (
    <span className={`text-[9px] font-semibold px-1 py-px rounded ${colors[tag] ?? "bg-muted text-muted-foreground"}`}>
      {tag}
    </span>
  );
}

function DerivedField({ tag, label, value, highlight }: { tag: string; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-1.5 text-xs leading-snug">
      <SourceTag tag={tag} />
      <span className="text-muted-foreground shrink-0 w-[120px]">{label}:</span>
      <span className={`font-medium min-w-0 whitespace-normal break-words ${highlight ? "text-[hsl(var(--warning))]" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

const aldiSource = {
  products: [
    { gtin: "4061463125958", name: "Fish Sticks & Crunchy Fillets", qty: "50 Carton" },
    { gtin: "4061463125279", name: "Beer Battered Cod Fillets", qty: "50 Carton" },
  ],
  extra: [
    { label: "Pickup Date", value: "04/07/2026" },
    { label: "Delivery Date", value: "04/08/2026" },
  ],
};

const mclaneSource = {
  products: [
    { gtin: "00042073 / 3260C006", name: "FISH POLLOCK SHIM 2", qty: "700 CA" },
  ],
  extra: [
    { label: "Total Pallet", value: "14" },
    { label: "Total Weight", value: "31,360.0 lbs" },
    { label: "Total Cube", value: "718.0" },
  ],
};

const aldiDerived = [
  { tag: "WMS", label: "Available Inventory", value: "In Stock — 120 Cartons" },
  { tag: "WMS", label: "Allocated Lot #", value: "LOT-CFP-26-0441" },
  { tag: "QA", label: "QA Status", value: "Passed — Jan 28" },
  { tag: "WMS", label: "Cold Storage Location", value: "Americold Allentown — Zone C-4" },
  { tag: "WMS", label: "Alternate Storage", value: "Americold Lehigh Valley — Zone A-2" },
  { tag: "WMS", label: "FIFO Preferred", value: "Americold Lehigh Valley — Zone A-2", highlight: true },
  { tag: "ERP", label: "FIFO Override", value: "Recommended — SLA risk if shipped from Lehigh", highlight: true },
  { tag: "ERP", label: "Ready Date", value: "04/06/2026" },
  { tag: "ERP", label: "SLA Rule", value: "Next-day delivery required" },
];

const mclaneDerived = [
  { tag: "WMS", label: "Available Inventory", value: "In Stock — 850 CA" },
  { tag: "WMS", label: "Allocated Lot #", value: "LOT-CFP-26-0398" },
  { tag: "QA", label: "QA Status", value: "Passed — Feb 20" },
  { tag: "WMS", label: "Cold Storage Location", value: "Ice Cube Cold Storage — Fall River" },
  { tag: "WMS", label: "Alternate Storage", value: "Lineage Logistics — New Bedford" },
  { tag: "WMS", label: "FIFO Preferred", value: "Ice Cube Cold Storage — Fall River" },
  { tag: "ERP", label: "FIFO Override", value: "Not required" },
  { tag: "ERP", label: "Ready Date", value: "02/25/2026" },
  { tag: "ERP", label: "SLA Rule", value: "2-day delivery window" },
];

type StatusValue = "ready" | "awaiting" | "qa-hold";

const statusConfig: Record<StatusValue, { label: string; style: string }> = {
  ready: { label: "Ready for Release", style: "bg-success/15 text-success" },
  awaiting: { label: "Awaiting Warehouse Confirmation", style: "bg-primary/10 text-primary" },
  "qa-hold": { label: "QA Hold", style: "bg-primary/10 text-primary" },
};

function ExampleTile({
  source,
  derived,
  status,
}: {
  source: typeof aldiSource;
  derived: typeof aldiDerived;
  status: StatusValue;
}) {
  const s = statusConfig[status];
  return (
    <div className="rounded-lg border bg-secondary/40 p-2.5 md:p-3 space-y-1.5">
      <div className="flex flex-wrap items-start justify-between gap-1.5">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.style}`}>{s.label}</span>
      </div>

      {/* PO Source */}
      <div className="space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">PO Source Data</p>
        {source.products.map((p, i) => (
          <div key={i} className="text-[11px] text-foreground bg-muted/50 rounded px-2 py-1 whitespace-normal break-words">
            <span className="text-muted-foreground">{p.gtin}</span>
            {" — "}
            <span className="font-medium">{p.name}</span>
            {" · "}
            <span>{p.qty}</span>
          </div>
        ))}
        {source.extra.map((f, i) => (
          <Field key={i} label={f.label} value={f.value} />
        ))}
      </div>

      {/* Derived */}
      <div className="space-y-1 pt-1 border-t border-border">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">ERP / WMS Derived Data</p>
        {derived.map((d, i) => (
          <DerivedField key={i} tag={d.tag} label={d.label} value={d.value} highlight={d.highlight} />
        ))}
      </div>
    </div>
  );
}

export function ErpWarehouseCard({ scenario }: { scenario: Scenario }) {
  return (
    <div className="rounded-lg border bg-card p-2.5 md:p-3 space-y-2.5">
      {scenario === "mclane" ? (
        <ExampleTile source={mclaneSource} derived={mclaneDerived} status="ready" />
      ) : (
        <ExampleTile source={aldiSource} derived={aldiDerived} status="ready" />
      )}

      <HumanApprovalPanel
        title="Operator Approval"
        quickActions={
          scenario === "mclane"
            ? ["Approve warehouse readiness", "Request recheck", "Escalate inventory issue"]
            : ["Approve FIFO override", "Keep strict FIFO", "Request warehouse recheck"]
        }
        placeholder="Add inventory, lot, QA, or storage instructions for AI and warehouse operations."
      />

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-border [&>button]:max-w-full [&>button]:whitespace-normal [&>button]:h-auto [&>button]:min-h-7 [&>button]:py-1 [&>button]:leading-tight">
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <Package className="w-3 h-3" /> View Inventory Detail
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <Package className="w-3 h-3" /> View Lot Availability
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <FlaskConical className="w-3 h-3" /> View QA Status
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <Warehouse className="w-3 h-3" /> View Storage Recommendation
        </Button>
      </div>
    </div>
  );
}
