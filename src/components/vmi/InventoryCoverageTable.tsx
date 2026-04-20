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
  const [selectedSku, setSelectedSku] = useState("All SKUs");
  const [selectedWarehouse, setSelectedWarehouse] = useState("All Warehouses");

  const visibleRows = useMemo(() => {
    const exceptionFiltered = filteredRowIds?.length ? rows.filter((row) => filteredRowIds.includes(row.id)) : rows;

    return exceptionFiltered.filter((row) => {
      const matchesSku = selectedSku === "All SKUs" || row.sku === selectedSku;
      const matchesWarehouse = selectedWarehouse === "All Warehouses" || row.warehouse === selectedWarehouse;
      return matchesSku && matchesWarehouse;
    });
  }, [filteredRowIds, rows, selectedSku, selectedWarehouse]);

  const skuOptions = useMemo(
    () => ["All SKUs", ...new Set(rows.map((row) => row.sku))],
    [rows],
  );

  const warehouseOptions = useMemo(
    () => ["All Warehouses", ...new Set(rows.map((row) => row.warehouse))],
    [rows],
  );

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
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Inventory by SKU and Location</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            SKU
            <select
              value={selectedSku}
              onChange={(event) => setSelectedSku(event.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
            >
              {skuOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            Warehouse
            <select
              value={selectedWarehouse}
              onChange={(event) => setSelectedWarehouse(event.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
            >
              {warehouseOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {grouped.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} className="py-8 text-center text-sm text-muted-foreground">
                No inventory rows match the selected filters.
              </TableCell>
            </TableRow>
          ) : null}
          {grouped.map(([sku, skuRows]) => {
            const first = skuRows[0];
            const expanded = expandedSkus[sku] ?? false;

            return (
              <Fragment key={sku}>
                <TableRow key={`${sku}-group`} className="bg-secondary/40">
                  <TableCell className="font-semibold text-foreground">
                    <button
                      type="button"
                      onClick={() => setExpandedSkus((current) => ({ ...current, [sku]: !expanded }))}
                      className="flex items-center gap-2 text-left"
                    >
                      <span>{expanded ? "−" : "+"}</span>
                      <span>{sku}</span>
                      <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", statusPillStyles[first.riskStatus])}>
                        {first.riskStatus}
                      </span>
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{first.description}</TableCell>
                  <TableCell colSpan={10} className="text-muted-foreground">
                    {skuRows.length} locations
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
