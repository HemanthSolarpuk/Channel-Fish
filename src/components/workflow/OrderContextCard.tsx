import { Button } from "@/components/ui/button";
import { HumanApprovalPanel } from "@/components/workflow/HumanApprovalPanel";
import { FileText, ShoppingCart, Database } from "lucide-react";
type Scenario = "aldi" | "mclane";

interface LineItem {
  sku: string;
  description: string;
  qty: string;
  uom?: string;
}

interface OrderTile {
  customer: string;
  poNo: string;
  poDate: string;
  poStatus?: string;
  supplierNumber?: string;
  supplierLocation: string;
  shipTo: string;
  pickupDate?: string;
  deliveryDate?: string;
  estShip?: string;
  dueDate?: string;
  shipVia?: string;
  loadType?: string;
  freight?: string;
  lineItems: LineItem[];
}

interface FulfillmentSnapshot {
  title: string;
  subtitle: string;
  fields: { label: string; value: string }[];
  quickActions: string[];
  placeholder: string;
}

const aldiTile: OrderTile = {
  customer: "Aldi Inc.",
  poNo: "7516245499",
  poDate: "03/30/2026",
  supplierNumber: "1233921",
  supplierLocation: "Americold Allentown Ambassador, 7150 Ambassador Drive, Allentown PA 18106",
  shipTo: "South Windsor DC, 295 Rye Street, South Windsor CT 06074-1219",
  pickupDate: "04/07/2026",
  deliveryDate: "04/08/2026",
  lineItems: [
    { sku: "4061463125958", description: "Fish Sticks & Crunchy Fillets", qty: "50", uom: "Carton" },
    { sku: "4061463125279", description: "Beer Battered Cod Fillets", qty: "50", uom: "Carton" },
  ],
};

const mclaneTile: OrderTile = {
  customer: "McLane Foodservice, Inc.",
  poNo: "11428530",
  poDate: "2026-02-02",
  poStatus: "Accepted",
  supplierLocation: "Fall River, MA 02720",
  shipTo: "Manassas, 7501 Century Park Rd, Manassas VA 20109",
  estShip: "2026-02-26",
  dueDate: "2026-02-27",
  shipVia: "VANTIX LOGISTICS",
  loadType: "Pallet",
  freight: "COLLECT",
  lineItems: [
    { sku: "00042073", description: "FISH POLLOCK SHIM 2 (Item: 3260C006)", qty: "700", uom: "CA" },
  ],
};

const aldiFulfillment: FulfillmentSnapshot = {
  title: "Pickup Scheduled",
  subtitle: "Execution routing",
  fields: [
    { label: "Pickup Location", value: "Americold Allentown Ambassador" },
    { label: "Ship To", value: "South Windsor DC" },
    { label: "Pickup Date", value: "04/07/2026" },
    { label: "Delivery Date", value: "04/08/2026" },
  ],
  quickActions: ["Approve pickup mode", "Request warehouse review", "Hold for clarification"],
  placeholder: "Add any routing notes, approval context, or alternate execution instructions.",
};

const mclaneFulfillment: FulfillmentSnapshot = {
  title: "Carrier Delivery / Collect Freight",
  subtitle: "Execution routing",
  fields: [
    { label: "Ship To", value: "Manassas" },
    { label: "Est. Ship", value: "2026-02-26" },
    { label: "Due Date", value: "2026-02-27" },
    { label: "Ship Via", value: "VANTIX LOGISTICS" },
    { label: "Load Type", value: "Pallet" },
    { label: "Freight", value: "COLLECT" },
  ],
  quickActions: ["Approve carrier mode", "Request logistics review", "Hold for clarification"],
  placeholder: "Add any routing notes, approval context, or alternate execution instructions.",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-1.5 text-xs leading-snug">
      <span className="text-muted-foreground shrink-0 w-[92px]">{label}:</span>
      <span className="text-foreground font-medium min-w-0 whitespace-normal break-words">{value}</span>
    </div>
  );
}

function Tile({ tile, label }: { tile: OrderTile; label: string }) {
  return (
    <div className="rounded-lg border bg-secondary/40 p-2.5 md:p-3 space-y-1.5">
      <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{label}</p>
      <Field label="Customer" value={tile.customer} />
      <Field label="PO No" value={tile.poNo} />
      <Field label="PO Date" value={tile.poDate} />
      {tile.poStatus && <Field label="PO Status" value={tile.poStatus} />}
      {tile.supplierNumber && <Field label="Supplier #" value={tile.supplierNumber} />}
      <Field label="Location" value={tile.supplierLocation} />
      <Field label="Ship To" value={tile.shipTo} />
      {tile.pickupDate && <Field label="Pickup Date" value={tile.pickupDate} />}
      {tile.deliveryDate && <Field label="Delivery Date" value={tile.deliveryDate} />}
      {tile.estShip && <Field label="Est. Ship" value={tile.estShip} />}
      {tile.dueDate && <Field label="Due Date" value={tile.dueDate} />}
      {tile.shipVia && <Field label="Ship Via" value={tile.shipVia} />}
      {tile.loadType && <Field label="Load Type" value={tile.loadType} />}
      {tile.freight && <Field label="Freight" value={tile.freight} />}

      <div className="pt-1 border-t border-border space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Line Items</p>
        {tile.lineItems.map((li, i) => (
          <div key={i} className="text-[11px] text-foreground bg-muted/50 rounded px-2 py-1 whitespace-normal break-words">
            <span className="text-muted-foreground">{li.sku}</span>
            {" — "}
            <span className="font-medium">{li.description}</span>
            {" · "}
            <span>{li.qty} {li.uom}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrderContextCard({ scenario }: { scenario: Scenario }) {
  const selectedTile = scenario === "mclane" ? mclaneTile : aldiTile;
  const selectedLabel = scenario === "mclane" ? "McLane Carrier Delivery" : "ALDI Pickup Scheduled";
  const fulfillment = scenario === "mclane" ? mclaneFulfillment : aldiFulfillment;

  return (
    <div className="rounded-lg border bg-card p-2.5 md:p-3 space-y-2.5">
      <Tile tile={selectedTile} label={selectedLabel} />

      <HumanApprovalPanel quickActions={fulfillment.quickActions} placeholder={fulfillment.placeholder} />

      <div className="flex flex-wrap gap-2 pt-1 border-t border-border [&>button]:max-w-full [&>button]:whitespace-normal [&>button]:h-auto [&>button]:min-h-7 [&>button]:py-1 [&>button]:leading-tight">
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <FileText className="w-3 h-3" /> View PO
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <ShoppingCart className="w-3 h-3" /> View SO
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] px-2 gap-1">
          <Database className="w-3 h-3" /> View ERP Record
        </Button>
      </div>
    </div>
  );
}
