import { Button } from "@/components/ui/button";
import { Package, FlaskConical, Warehouse, MapPin } from "lucide-react";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1.5 text-xs leading-snug">
      <span className="text-muted-foreground shrink-0">{label}:</span>
      <span className="text-foreground font-medium">{value}</span>
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
    <div className="flex items-center gap-1.5 text-xs leading-snug">
      <SourceTag tag={tag} />
      <span className="text-muted-foreground shrink-0">{label}:</span>
      <span className={`font-medium ${highlight ? "text-[hsl(var(--warning))]" : "text-foreground"}`}>{value}</span>
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
  ready: { label: "Ready for Release", style: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]" },
  awaiting: { label: "Awaiting Warehouse Confirmation", style: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]" },
  "qa-hold": { label: "QA Hold", style: "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]" },
};

function ExampleTile({
  label,
  source,
  derived,
  status,
}: {
  label: string;
  source: typeof aldiSource;
  derived: typeof aldiDerived;
  status: StatusValue;
}) {
  const s = statusConfig[status];
  return (
    <div className="rounded-lg border bg-secondary/40 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{label}</p>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.style}`}>{s.label}</span>
      </div>

      {/* PO Source */}
      <div className="space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">PO Source Data</p>
        {source.products.map((p, i) => (
          <div key={i} className="text-[11px] text-foreground bg-muted/50 rounded px-2 py-1">
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

export function ErpWarehouseCard() {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-3">
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]">
        ERP + Warehouse Checked
      </span>

      <ExampleTile label="ALDI Example" source={aldiSource} derived={aldiDerived} status="ready" />
      <ExampleTile label="McLane Example" source={mclaneSource} derived={mclaneDerived} status="ready" />

      {/* Business Note */}
      <div className="bg-[hsl(var(--warning))]/5 border border-[hsl(var(--warning))]/20 rounded-md px-3 py-2">
        <p className="text-[10px] text-[hsl(var(--warning))] font-semibold uppercase tracking-wider mb-0.5">Business Rule</p>
        <p className="text-xs text-foreground">
          If FIFO-preferred stock is in a farther warehouse and SLA is at risk, Ubik can recommend a FIFO override with operator approval.
        </p>
      </div>

      {/* AI Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-md px-3 py-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Ubik AI</p>
        <p className="text-xs text-foreground">
          Ubik combines source PO fields with ERP and warehouse checks before permitting release.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2 gap-1">
          <Package className="w-3 h-3" /> View Inventory Detail
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2 gap-1">
          <Package className="w-3 h-3" /> View Lot Availability
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2 gap-1">
          <FlaskConical className="w-3 h-3" /> View QA Status
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2 gap-1">
          <Warehouse className="w-3 h-3" /> View Storage Recommendation
        </Button>
      </div>
    </div>
  );
}
