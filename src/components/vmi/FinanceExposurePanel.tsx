import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FinanceLensMetric, InventoryCoverageRow } from "@/data/vmiProgramsData";
import { cn } from "@/lib/utils";

const skuSalesPricePerLb: Record<string, number> = {
  "Fish Sticks & Crunchy Fillets": 8.1,
  "Beer Battered Cod Fillets": 9.8,
  "Breaded Shrimp": 11.4,
};

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value).toLocaleString()}`;
}

export function FinanceExposurePanel({
  metrics,
  inventoryRows,
}: {
  metrics: FinanceLensMetric[];
  inventoryRows: InventoryCoverageRow[];
}) {
  const [open, setOpen] = useState(true);
  const [expandedWarehouses, setExpandedWarehouses] = useState<Record<string, boolean>>({});

  const warehouseValues = useMemo(() => {
    return Object.entries(
      inventoryRows.reduce<
        Record<
          string,
          {
            warehouse: string;
            totalLbs: number;
            totalValue: number;
            items: {
              sku: string;
              customerLocation: string;
              onHand: number;
              value: number;
              pricePerLb: number;
            }[];
          }
        >
      >((acc, row) => {
        const pricePerLb = skuSalesPricePerLb[row.sku] ?? 8.5;
        const value = row.onHand * pricePerLb;
        acc[row.warehouse] = acc[row.warehouse]
          ? {
              ...acc[row.warehouse],
              totalLbs: acc[row.warehouse].totalLbs + row.onHand,
              totalValue: acc[row.warehouse].totalValue + value,
              items: [
                ...acc[row.warehouse].items,
                { sku: row.sku, customerLocation: row.customerLocation, onHand: row.onHand, value, pricePerLb },
              ],
            }
          : {
              warehouse: row.warehouse,
              totalLbs: row.onHand,
              totalValue: value,
              items: [{ sku: row.sku, customerLocation: row.customerLocation, onHand: row.onHand, value, pricePerLb }],
            };
        return acc;
      }, {}),
    ).sort((a, b) => b[1].totalValue - a[1].totalValue);
  }, [inventoryRows]);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(148,163,184,0.08)]">
      <button type="button" onClick={() => setOpen((current) => !current)} className="flex w-full items-center justify-between text-left">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Finance Lens</h2>
          <p className="mt-1 text-xs text-muted-foreground">Lighter financial exposure view tied to the program inventory position.</p>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open ? "rotate-180" : "")} />
      </button>

      {open ? (
        <div className="mt-3 space-y-4">
          <div className="rounded-xl border border-border bg-background p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Warehouse On Hand Value</p>
                <p className="mt-1 text-xs text-muted-foreground">Warehouse-level inventory value, drillable into SKU lines using mock sales prices.</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Program Total</p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {formatCurrency(warehouseValues.reduce((sum, [, warehouse]) => sum + warehouse.totalValue, 0))}
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2.5">
              {warehouseValues.map(([warehouseName, warehouse]) => {
                const expanded = expandedWarehouses[warehouseName] ?? false;

                return (
                  <div key={warehouseName} className="rounded-lg border border-border bg-card">
                    <button
                      type="button"
                      onClick={() => setExpandedWarehouses((current) => ({ ...current, [warehouseName]: !expanded }))}
                      className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{warehouseName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{warehouse.totalLbs.toLocaleString()} lbs on hand</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{formatCurrency(warehouse.totalValue)}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{warehouse.items.length} SKU lanes</p>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded ? "rotate-180" : "")} />
                      </div>
                    </button>

                    {expanded ? (
                      <div className="border-t border-border px-3 py-2.5">
                        <div className="grid gap-2">
                          {warehouse.items.map((item) => (
                            <div
                              key={`${warehouseName}-${item.sku}-${item.customerLocation}`}
                              className="grid gap-2 rounded-lg border border-border bg-background px-3 py-2.5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto_auto]"
                            >
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.sku}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{item.customerLocation}</p>
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Sales Price</p>
                                <p className="mt-1 text-sm font-medium text-foreground">${item.pricePerLb.toFixed(2)} / lb</p>
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">On Hand</p>
                                <p className="mt-1 text-sm font-medium text-foreground">{item.onHand.toLocaleString()} lbs</p>
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Inventory Value</p>
                                <p className="mt-1 text-sm font-semibold text-foreground">{formatCurrency(item.value)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-border bg-background p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{metric.label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{metric.value}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
