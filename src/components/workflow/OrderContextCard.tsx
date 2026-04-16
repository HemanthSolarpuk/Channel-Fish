import { Button } from "@/components/ui/button";
import { FileText, ShoppingCart, Database } from "lucide-react";

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
  supplier: string;
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

const aldiTile: OrderTile = {
  customer: "Aldi Inc.",
  poNo: "7516245499",
  poDate: "03/30/2026",
  supplier: "Channel Fish Processing Co. Inc",
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
  supplier: "Channel Fish Processing Co Inc / Ice Cube Cold Storage",
  supplierLocation: "Fall River, MA 02720",
  shipTo: "Manassas, 7501 Century Park Rd, Manassas VA 20109",
  estShip: "2026-02-26",
  dueDate: "2026-02-27",
  shipVia: "VANTIX LOGISTICS",
  loadType: "Pallet",
  freight: "COLLECT",
  lineItems: [
    { sku: "00042073", description: "FISH POLLOCK SHIM 2 (Supplier: 3260C006)", qty: "700", uom: "CA" },
  ],
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1.5 text-xs leading-snug">
      <span className="text-muted-foreground shrink-0">{label}:</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

function Tile({ tile, label }: { tile: OrderTile; label: string }) {
  return (
    <div className="rounded-lg border bg-secondary/40 p-3 space-y-2">
      <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{label}</p>
      <Field label="Customer" value={tile.customer} />
      <Field label="PO No" value={tile.poNo} />
      <Field label="PO Date" value={tile.poDate} />
      {tile.poStatus && <Field label="PO Status" value={tile.poStatus} />}
      <Field label="Supplier" value={tile.supplier} />
      {tile.supplierNumber && <Field label="Supplier #" value={tile.supplierNumber} />}
      <Field label="Supplier Location" value={tile.supplierLocation} />
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
          <div key={i} className="text-[11px] text-foreground bg-muted/50 rounded px-2 py-1">
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

export function OrderContextCard() {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-3">
      {/* Status chip */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]">
          Order Context Ready
        </span>
      </div>

      {/* Two example tiles */}
      <Tile tile={aldiTile} label="ALDI Pickup Scheduled" />
      <Tile tile={mclaneTile} label="McLane Carrier Delivery" />

      {/* AI Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-md px-3 py-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Ubik AI</p>
        <p className="text-xs text-foreground">
          Ubik has already captured the PO source data and linked it to the existing sales order and ERP context.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-1 border-t border-border">
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2 gap-1">
          <FileText className="w-3 h-3" /> View PO
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2 gap-1">
          <ShoppingCart className="w-3 h-3" /> View SO
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2 gap-1">
          <Database className="w-3 h-3" /> View ERP Record
        </Button>
      </div>
    </div>
  );
}
