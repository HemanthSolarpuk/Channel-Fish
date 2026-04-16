import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Download, Eye, CheckCircle, XCircle, FileText } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { mockDocuments } from "@/data/mockDocuments";

const typeColors: Record<string, string> = {
  PO: "bg-[hsl(210,100%,55%)] text-[hsl(0,0%,100%)]",
  SO: "bg-[hsl(145,65%,45%)] text-[hsl(0,0%,100%)]",
  INVOICE: "bg-[hsl(280,70%,55%)] text-[hsl(0,0%,100%)]",
  QUOTE: "bg-[hsl(38,92%,55%)] text-[hsl(0,0%,100%)]",
};

function ConfidenceBadge({ value }: { value: number }) {
  const color = value >= 90 ? "text-success" : value >= 80 ? "text-warning" : "text-destructive";
  return (
    <span className={`text-xs font-medium ${color} flex items-center gap-1`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {value}%
    </span>
  );
}

function FieldRow({ label, value, confidence }: { label: string; value: string; confidence?: number; required?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-muted-foreground font-medium">{label}</label>
        {confidence && <ConfidenceBadge value={confidence} />}
      </div>
      <div className="bg-secondary rounded-lg px-3 py-2 text-sm text-foreground border border-border">
        {value}
      </div>
    </div>
  );
}

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doc = mockDocuments.find((d) => d.id === id);

  if (!doc) {
    return (
      <AppLayout>
        <div className="p-6 text-center text-muted-foreground">Document not found</div>
      </AppLayout>
    );
  }

  const lineItems = [
    { sku: "SHRMP-VEIN-26/30", description: "Vannamei Shrimp 26/30 Deveined", qty: 500, uom: "KG", unitPrice: 45.5, amount: 22750 },
    { sku: "SHRMP-PD-31/40", description: "Vannamei Shrimp 31/40 P&D", qty: 300, uom: "KG", unitPrice: 42, amount: 12600 },
    { sku: "SHRMP-COOK-41/50", description: "Cooked Shrimp 41/50", qty: 250, uom: "KG", unitPrice: 41.6, amount: 10400 },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-foreground">{doc.orderNumber}</h1>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeColors[doc.type]}`}>{doc.type}</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-warning/15 text-warning border border-warning/30 flex items-center gap-1">
                  ⚠ {doc.status}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">{doc.vendor}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground hover:bg-accent">
              <Clock className="w-4 h-4" /> Audit Log
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground hover:bg-accent">
              <FileText className="w-4 h-4" /> Save Draft
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/15 border border-destructive/30 text-sm text-destructive hover:bg-destructive/25">
              <XCircle className="w-4 h-4" /> Reject
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success text-success-foreground text-sm font-medium hover:opacity-90">
              <CheckCircle className="w-4 h-4" /> Verify
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 gap-6">
          {/* PDF Preview */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                {doc.documentName}
              </span>
              <div className="flex items-center gap-2">
                <button className="text-muted-foreground hover:text-foreground"><Download className="w-4 h-4" /></button>
                <button className="text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-6 bg-[hsl(0,0%,95%)] min-h-[600px]">
              {/* Fake PDF preview */}
              <div className="bg-[hsl(0,0%,100%)] rounded shadow-sm p-8 text-[hsl(0,0%,10%)] text-sm space-y-6 max-w-md mx-auto">
                <div className="flex justify-between items-start">
                  <div className="w-20 h-8 bg-[hsl(0,0%,85%)] rounded" />
                  <div className="text-right">
                    <div className="text-lg font-bold">PURCHASE ORDER</div>
                    <div className="text-xs text-[hsl(0,0%,50%)]">{doc.orderNumber}</div>
                    <div className="text-xs text-[hsl(0,0%,50%)]">Date: Jan 15, 2024</div>
                  </div>
                </div>
                <div className="text-xs text-[hsl(0,0%,50%)]">
                  <div>123 Seafood Way</div>
                  <div>Export City, EX 12345</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-semibold text-[hsl(210,100%,40%)]">BILL TO:</div>
                    <div>FreshMart Distribution</div>
                    <div>1234 Commerce Blvd</div>
                    <div>Houston, TX 77001</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[hsl(210,100%,40%)]">SHIP TO:</div>
                    <div>FreshMart Warehouse #3</div>
                    <div>5678 Industrial Park Dr</div>
                    <div>Houston, TX 77012</div>
                  </div>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[hsl(0,0%,80%)]">
                      <th className="text-left py-1">SKU</th>
                      <th className="text-left py-1">Description</th>
                      <th className="text-right py-1">Qty</th>
                      <th className="text-right py-1">Unit Price</th>
                      <th className="text-right py-1">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, i) => (
                      <tr key={i} className="border-b border-[hsl(0,0%,90%)]">
                        <td className="py-1">{item.sku}</td>
                        <td className="py-1">{item.description}</td>
                        <td className="py-1 text-right">{item.qty} KG</td>
                        <td className="py-1 text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="py-1 text-right">${item.amount.toLocaleString()}.00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right text-xs space-y-1">
                  <div>Subtotal: $45,750.00</div>
                  <div>Tax: $0.00</div>
                  <div className="font-bold">Total: $45,750.00</div>
                </div>
                <div className="text-xs text-[hsl(210,100%,40%)]">
                  <div>Payment Terms:</div>
                  <div>Net 30</div>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Fields */}
          <div className="space-y-6">
            {/* Document Header */}
            <div>
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4" /> Document Header
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <FieldRow label="Order Number *" value={doc.orderNumber} confidence={94} />
                <FieldRow label="Document Type" value={doc.type} confidence={98} />
                <FieldRow label="Order Date *" value="15/01/2024" confidence={92} />
                <FieldRow label="Delivery Date" value="28/01/2024" confidence={85} />
                <FieldRow label="Currency" value="USD" confidence={96} />
                <FieldRow label="Total Amount *" value="45750" confidence={91} />
              </div>
              <div className="mt-3">
                <FieldRow label="Payment Terms" value="Net 30" confidence={88} />
              </div>
            </div>

            {/* Addresses */}
            <div>
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                📍 Addresses
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1 block">Bill To</label>
                  <div className="bg-secondary rounded-lg px-3 py-3 text-sm text-foreground border border-border leading-relaxed">
                    FreshMart Distribution<br />
                    1234 Commerce Blvd<br />
                    Houston, TX 77001
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1 block">Ship To</label>
                  <div className="bg-secondary rounded-lg px-3 py-3 text-sm text-foreground border border-border leading-relaxed">
                    FreshMart Warehouse #3<br />
                    5678 Industrial Park Dr<br />
                    Houston, TX 77012
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                📋 Line Items
              </h2>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary text-muted-foreground text-xs">
                      <th className="text-left py-2 px-3">SKU</th>
                      <th className="text-left py-2 px-3">Description</th>
                      <th className="text-right py-2 px-3">Qty</th>
                      <th className="text-center py-2 px-3">UOM</th>
                      <th className="text-right py-2 px-3">Unit Price</th>
                      <th className="text-right py-2 px-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="py-2 px-3">
                          <span className="bg-accent px-2 py-1 rounded text-xs">{item.sku.substring(0, 1)}</span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="bg-secondary rounded px-2 py-1 text-xs truncate max-w-[120px]">{item.description}</div>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="bg-secondary rounded px-2 py-1 text-xs">{item.qty}</span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="bg-secondary rounded px-2 py-1 text-xs">{item.uom}</span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="bg-secondary rounded px-2 py-1 text-xs">{item.unitPrice}</span>
                        </td>
                        <td className="py-2 px-3 text-right font-medium">${item.amount.toLocaleString()}.00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right px-3 py-2 border-t border-border text-sm font-semibold text-foreground">
                  Total: <span className="text-primary">$45,750.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DocumentDetail;
