import { CheckCircle, Clock, Download, Eye, FileText, XCircle } from "lucide-react";
import type { Document } from "@/data/mockDocuments";

const typeColors: Record<Document["type"], string> = {
  PO: "bg-[hsl(210,100%,55%)] text-[hsl(0,0%,100%)]",
  SO: "bg-[hsl(145,65%,45%)] text-[hsl(0,0%,100%)]",
  INVOICE: "bg-[hsl(280,70%,55%)] text-[hsl(0,0%,100%)]",
  QUOTE: "bg-[hsl(38,92%,55%)] text-[hsl(0,0%,100%)]",
};

const lineItems = [
  { sku: "SHRMP-VEIN-26/30", description: "Vannamei Shrimp 26/30 Deveined", qty: 500, uom: "KG", unitPrice: 45.5, amount: 22750 },
  { sku: "SHRMP-PD-31/40", description: "Vannamei Shrimp 31/40 P&D", qty: 300, uom: "KG", unitPrice: 42, amount: 12600 },
  { sku: "SHRMP-COOK-41/50", description: "Cooked Shrimp 41/50", qty: 250, uom: "KG", unitPrice: 41.6, amount: 10400 },
];

function ConfidenceBadge({ value }: { value: number }) {
  const color = value >= 90 ? "text-success" : value >= 80 ? "text-warning" : "text-destructive";

  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${color}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value}%
    </span>
  );
}

function FieldRow({ label, value, confidence }: { label: string; value: string; confidence?: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        {confidence ? <ConfidenceBadge value={confidence} /> : null}
      </div>
      <div className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground">{value}</div>
    </div>
  );
}

export function DocumentDetailPanel({ doc }: { doc: Document }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{doc.orderNumber}</h3>
            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${typeColors[doc.type]}`}>{doc.type}</span>
            <span className="flex items-center gap-1 rounded-lg border border-warning/30 bg-warning/15 px-2.5 py-1 text-xs font-medium text-warning">
              {doc.status}
            </span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{doc.vendor}</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground hover:bg-accent">
            <Clock className="h-4 w-4" /> Audit Log
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground hover:bg-accent">
            <FileText className="h-4 w-4" /> Save Draft
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/15 px-4 py-2 text-sm text-destructive hover:bg-destructive/25">
            <XCircle className="h-4 w-4" /> Reject
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-success-foreground hover:opacity-90">
            <CheckCircle className="h-4 w-4" /> Verify
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3">
            <div>
              <div className="text-sm font-medium text-foreground">{doc.documentName}</div>
              <div className="text-xs text-muted-foreground">{doc.sender}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-2 text-muted-foreground hover:bg-background hover:text-foreground">
                <Eye className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-muted-foreground hover:bg-background hover:text-foreground">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div className="rounded-xl border border-dashed border-primary/25 bg-gradient-to-br from-primary/5 via-white to-primary/10 p-5">
              <div className="space-y-3 rounded-xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Purchase Order</p>
                    <p className="mt-2 text-xl font-semibold text-foreground">{doc.orderNumber}</p>
                  </div>
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${typeColors[doc.type]}`}>{doc.type}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-secondary px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Vendor</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{doc.vendor}</p>
                  </div>
                  <div className="rounded-lg bg-secondary px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Amount</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{doc.amount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-medium text-muted-foreground">Received</p>
                <p className="mt-2 text-sm text-foreground">{doc.received}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-medium text-muted-foreground">Vendor Code</p>
                <p className="mt-2 text-sm text-foreground">{doc.vendorCode}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="mb-4 text-sm font-semibold text-foreground">Extracted Fields</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <FieldRow label="Order Number *" value={doc.orderNumber} confidence={94} />
              <FieldRow label="Document Type" value={doc.type} confidence={98} />
              <FieldRow label="Order Date *" value="15/01/2024" confidence={92} />
              <FieldRow label="Delivery Date" value="28/01/2024" confidence={85} />
              <FieldRow label="Currency" value={doc.currency} confidence={96} />
              <FieldRow label="Total Amount *" value={doc.amount} confidence={91} />
            </div>
            <div className="mt-3">
              <FieldRow label="Payment Terms" value="Net 30" confidence={88} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="mb-4 text-sm font-semibold text-foreground">Addresses</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Bill To</label>
                <div className="rounded-lg border border-border bg-secondary px-3 py-3 text-sm leading-relaxed text-foreground">
                  FreshMart Distribution
                  <br />
                  1234 Commerce Blvd
                  <br />
                  Houston, TX 77001
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Ship To</label>
                <div className="rounded-lg border border-border bg-secondary px-3 py-3 text-sm leading-relaxed text-foreground">
                  FreshMart Warehouse #3
                  <br />
                  5678 Industrial Park Dr
                  <br />
                  Houston, TX 77012
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="mb-4 text-sm font-semibold text-foreground">Line Items</h4>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary text-xs text-muted-foreground">
                    <th className="px-3 py-2 text-left">SKU</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                    <th className="px-3 py-2 text-center">UOM</th>
                    <th className="px-3 py-2 text-right">Unit Price</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.sku} className="border-t border-border">
                      <td className="px-3 py-2">
                        <span className="rounded bg-accent px-2 py-1 text-xs">{item.sku.substring(0, 1)}</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="max-w-[200px] truncate rounded bg-secondary px-2 py-1 text-xs">{item.description}</div>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className="rounded bg-secondary px-2 py-1 text-xs">{item.qty}</span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="rounded bg-secondary px-2 py-1 text-xs">{item.uom}</span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className="rounded bg-secondary px-2 py-1 text-xs">{item.unitPrice}</span>
                      </td>
                      <td className="px-3 py-2 text-right font-medium">${item.amount.toLocaleString()}.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-border px-3 py-2 text-right text-sm font-semibold text-foreground">
                Total: <span className="text-primary">{doc.amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
