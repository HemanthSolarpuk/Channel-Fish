import { useNavigate } from "react-router-dom";
import type { RelatedDelivery } from "@/data/vmiProgramsData";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RelatedDeliveriesTable({
  deliveries,
  compact = false,
  maxRows,
}: {
  deliveries: RelatedDelivery[];
  compact?: boolean;
  maxRows?: number;
}) {
  const navigate = useNavigate();
  const visibleDeliveries = maxRows ? deliveries.slice(0, maxRows) : deliveries;

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(148,163,184,0.08)]">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Related Deliveries</h2>
      </div>
      <div className={compact ? "overflow-hidden rounded-2xl border border-border bg-background" : undefined}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Delivery ID / Release ID</TableHead>
              <TableHead>Customer Location</TableHead>
              <TableHead>Requested Date</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Fulfillment Mode</TableHead>
              <TableHead>Status</TableHead>
              {!compact ? <TableHead>Next Action</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleDeliveries.map((delivery) => (
              <TableRow
                key={delivery.deliveryId}
                onClick={() => navigate(`/release-queue?caseId=${delivery.releaseCaseId}`)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium text-foreground">{delivery.deliveryId}</TableCell>
                <TableCell>{delivery.customerLocation}</TableCell>
                <TableCell>{delivery.requestedDate}</TableCell>
                <TableCell>{delivery.quantity}</TableCell>
                <TableCell>{delivery.fulfillmentMode}</TableCell>
                <TableCell>
                  <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", "border border-primary/25 bg-primary/10 text-primary")}>
                    {delivery.status}
                  </span>
                </TableCell>
                {!compact ? <TableCell className="text-primary">{delivery.nextAction}</TableCell> : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
