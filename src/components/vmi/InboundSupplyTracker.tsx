import type { InboundSupplyRow } from "@/data/vmiProgramsData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { severityPillStyles } from "./vmiStyles";

export function InboundSupplyTracker({ rows, filteredRowIds }: { rows: InboundSupplyRow[]; filteredRowIds?: string[] }) {
  const visibleRows = filteredRowIds?.length ? rows.filter((row) => filteredRowIds.includes(row.id)) : rows;

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(148,163,184,0.08)]">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Inbound Supply Tracker</h2>
        <p className="mt-1 text-xs text-muted-foreground">Program-level inbound supply from supplier PO through arrival.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {["Supplier", "Origin Country", "Supplier PO", "Container No", "SKU", "Qty", "Stage", "ETA", "Delay vs Standard Lead Time", "Destination Warehouse", "Risk"].map((label) => (
              <TableHead key={label}>{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium text-foreground">{row.supplier}</TableCell>
              <TableCell>{row.originCountry}</TableCell>
              <TableCell>{row.supplierPo}</TableCell>
              <TableCell>{row.containerNo}</TableCell>
              <TableCell>{row.sku}</TableCell>
              <TableCell>{row.qty.toLocaleString()}</TableCell>
              <TableCell>{row.stage}</TableCell>
              <TableCell>{row.eta}</TableCell>
              <TableCell>{row.delayVsLeadTime}</TableCell>
              <TableCell>{row.destinationWarehouse}</TableCell>
              <TableCell>
                <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", severityPillStyles[row.risk])}>
                  {row.risk}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
