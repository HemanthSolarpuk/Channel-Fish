import type { ReleaseCase, ReleaseStatus, FlowType } from "@/data/releaseQueueData";

const flowBadge: Record<FlowType, string> = {
  pickup: "bg-[hsl(var(--badge-po))]/15 text-[hsl(var(--badge-po))] border border-[hsl(var(--badge-po))]/30",
  carrier: "bg-[hsl(var(--badge-invoice))]/15 text-[hsl(var(--badge-invoice))] border border-[hsl(var(--badge-invoice))]/30",
};

const flowLabel: Record<FlowType, string> = {
  pickup: "Pickup Scheduled",
  carrier: "Carrier Delivery",
};

const statusStyles: Record<ReleaseStatus, string> = {
  "Ready for Release": "bg-success/15 text-success border border-success/30",
  "Awaiting Warehouse Confirmation": "bg-warning/15 text-warning border border-warning/30",
  "Awaiting Carrier Readiness": "bg-info/15 text-info border border-info/30",
  "POD Received": "bg-[hsl(280,70%,55%)]/15 text-[hsl(280,70%,65%)] border border-[hsl(280,70%,55%)]/30",
  "Invoice Generated": "bg-success/15 text-success border border-success/30",
};

interface Props {
  cases: ReleaseCase[];
  onRowClick: (c: ReleaseCase) => void;
}

export function ReleaseQueueTable({ cases, onRowClick }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1180px] text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">Updated</th>
            <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">Customer</th>
            <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">PO Number</th>
            <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">Flow Type</th>
            <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">Ship To</th>
            <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">Requested</th>
            <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">Quantity</th>
            <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">Status</th>
            <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">Next Action</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr
              key={c.id}
              onClick={() => onRowClick(c)}
              className="border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <td className="py-3 px-4 text-muted-foreground whitespace-nowrap text-xs">{c.updated}</td>
              <td className="py-3 px-4 font-medium text-foreground">{c.customer}</td>
              <td className="py-3 px-4 text-foreground text-xs font-mono whitespace-nowrap">{c.poNumber}</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded text-[11px] font-semibold ${flowBadge[c.flowType]}`}>
                  {flowLabel[c.flowType]}
                </span>
              </td>
              <td className="py-3 px-4 text-foreground text-xs">{c.shipTo}</td>
              <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">{c.requestedDate}</td>
              <td className="py-3 px-4 text-foreground text-xs whitespace-nowrap">{c.quantity}</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-medium ${statusStyles[c.status]}`}>
                  {c.status}
                </span>
              </td>
              <td className="py-3 px-4 text-primary text-xs">{c.nextAction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
