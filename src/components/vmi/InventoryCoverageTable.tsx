import { Fragment, useMemo, useState } from "react";
import type { InventoryCoverageRow } from "@/data/vmiProgramsData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { statusPillStyles } from "./vmiStyles";

interface Props {
  rows: InventoryCoverageRow[];
  filteredRowIds?: string[];
}

export function InventoryCoverageTable({ rows, filteredRowIds }: Props) {
  const [expandedSkus, setExpandedSkus] = useState<Record<string, boolean>>({});
  const visibleRows = filteredRowIds?.length ? rows.filter((row) => filteredRowIds.includes(row.id)) : rows;
  const grouped = useMemo(() => {
    return Object.entries(
      visibleRows.reduce<Record<string, InventoryCoverageRow[]>>((acc, row) => {
        acc[row.sku] = acc[row.sku] ? [...acc[row.sku], row] : [row];
        return acc;
      }, {}),
    );
  }, [visibleRows]);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(148,163,184,0.08)]">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Inventory by SKU and Location</h2>
        <p className="mt-1 text-xs text-muted-foreground">Grouped by SKU, expandable into warehouse and customer destination detail.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Customer Location / DC</TableHead>
            <TableHead>On Hand</TableHead>
            <TableHead>Allocated</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Avg 4-Week Pull</TableHead>
            <TableHead>Avg 8-Week Pull</TableHead>
            <TableHead>Forecast Next 4 Weeks</TableHead>
            <TableHead>Weeks of Cover</TableHead>
            <TableHead>Safety Stock</TableHead>
            <TableHead>Aging Days</TableHead>
            <TableHead>Risk Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grouped.map(([sku, skuRows]) => {
            const first = skuRows[0];
            const expanded = expandedSkus[sku] ?? true;

            return (
              <Fragment key={sku}>
                <TableRow key={`${sku}-group`} className="bg-secondary/40">
                  <TableCell className="font-semibold text-foreground">
                    <button
                      type="button"
                      onClick={() => setExpandedSkus((current) => ({ ...current, [sku]: !expanded }))}
                      className="text-left"
                    >
                      {expanded ? "−" : "+"} {sku}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{first.description}</TableCell>
                  <TableCell colSpan={10} className="text-muted-foreground">
                    {skuRows.length} location rows
                  </TableCell>
                  <TableCell>
                    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", statusPillStyles[first.riskStatus])}>
                      {first.riskStatus}
                    </span>
                  </TableCell>
                </TableRow>
                {expanded
                  ? skuRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="pl-8 text-foreground">{row.sku}</TableCell>
                        <TableCell className="text-muted-foreground">{row.description}</TableCell>
                        <TableCell>{row.warehouse}</TableCell>
                        <TableCell>{row.customerLocation}</TableCell>
                        <TableCell>{row.onHand.toLocaleString()}</TableCell>
                        <TableCell>{row.allocated.toLocaleString()}</TableCell>
                        <TableCell>{row.available.toLocaleString()}</TableCell>
                        <TableCell>{row.avg4WeekPull.toLocaleString()}</TableCell>
                        <TableCell>{row.avg8WeekPull.toLocaleString()}</TableCell>
                        <TableCell>{row.forecastNext4Weeks.toLocaleString()}</TableCell>
                        <TableCell>{row.weeksOfCover.toFixed(1)}</TableCell>
                        <TableCell>{row.safetyStock.toFixed(1)} wks</TableCell>
                        <TableCell>{row.agingDays}</TableCell>
                        <TableCell>
                          <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", statusPillStyles[row.riskStatus])}>
                            {row.riskStatus}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
