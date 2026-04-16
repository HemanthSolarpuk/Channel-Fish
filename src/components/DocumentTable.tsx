import { Document } from "@/data/mockDocuments";

const typeColors: Record<string, string> = {
  PO: "bg-[hsl(210,100%,55%)] text-[hsl(0,0%,100%)]",
  SO: "bg-[hsl(145,65%,45%)] text-[hsl(0,0%,100%)]",
  INVOICE: "bg-[hsl(280,70%,55%)] text-[hsl(0,0%,100%)]",
  QUOTE: "bg-[hsl(38,92%,55%)] text-[hsl(0,0%,100%)]",
};

const statusStyles: Record<string, string> = {
  "Needs Review": "bg-warning/15 text-warning border border-warning/30",
  "Verified": "bg-success/15 text-success border border-success/30",
  "Sent to ERP": "bg-info/15 text-info border border-info/30",
  "ERP Failed": "bg-destructive/15 text-destructive border border-destructive/30",
};

function ConfidenceDot({ value }: { value: number }) {
  const color = value >= 90 ? "text-success" : value >= 80 ? "text-warning" : "text-destructive";
  return (
    <span className={`flex items-center gap-1 text-sm ${color}`}>
      <span className="w-2 h-2 rounded-full bg-current" />
      {value}%
    </span>
  );
}

interface DocumentTableProps {
  documents: Document[];
  onRowClick: (doc: Document) => void;
}

export function DocumentTable({ documents, onRowClick }: DocumentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left py-3 px-4 font-medium">RECEIVED</th>
            <th className="text-left py-3 px-4 font-medium">SENDER</th>
            <th className="text-left py-3 px-4 font-medium">VENDOR</th>
            <th className="text-left py-3 px-4 font-medium">DOCUMENT</th>
            <th className="text-left py-3 px-4 font-medium">TYPE</th>
            <th className="text-left py-3 px-4 font-medium">ORDER #</th>
            <th className="text-right py-3 px-4 font-medium">AMOUNT</th>
            <th className="text-center py-3 px-4 font-medium">CONF.</th>
            <th className="text-center py-3 px-4 font-medium">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr
              key={doc.id}
              onClick={() => onRowClick(doc)}
              className="border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">{doc.received}</td>
              <td className="py-4 px-4 text-muted-foreground text-xs">{doc.sender}</td>
              <td className="py-4 px-4">
                <div className="font-medium text-foreground">{doc.vendor}</div>
                <div className="text-xs text-muted-foreground">{doc.vendorCode}</div>
              </td>
              <td className="py-4 px-4">
                <span className="flex items-center gap-1.5 text-foreground">
                  <span className="text-destructive">📄</span>
                  <span className="truncate max-w-[180px]">{doc.documentName}</span>
                </span>
              </td>
              <td className="py-4 px-4">
                <span className={`px-2.5 py-1 rounded text-xs font-semibold ${typeColors[doc.type]}`}>
                  {doc.type}
                </span>
              </td>
              <td className="py-4 px-4 text-foreground text-xs">{doc.orderNumber}</td>
              <td className="py-4 px-4 text-right font-medium text-foreground">{doc.amount}</td>
              <td className="py-4 px-4 text-center">
                <ConfidenceDot value={doc.confidence} />
              </td>
              <td className="py-4 px-4 text-center">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${statusStyles[doc.status]}`}>
                  {doc.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
