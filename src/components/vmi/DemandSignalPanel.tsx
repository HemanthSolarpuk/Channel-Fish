import { useMemo } from "react";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, XAxis, YAxis } from "recharts";
import type { DemandGranularity, DemandSignalRow } from "@/data/vmiProgramsData";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { severityPillStyles } from "./vmiStyles";

const chartConfig = {
  contractPace: { label: "Contract Pace", color: "hsl(var(--warning))" },
  forecast: { label: "Forecast", color: "hsl(var(--info))" },
  actual: { label: "Actual Pull", color: "hsl(var(--primary))" },
} as const;

export function DemandSignalPanel({
  rows,
  filteredRowIds,
  granularity,
  onGranularityChange,
  contractPace,
}: {
  rows: DemandSignalRow[];
  filteredRowIds?: string[];
  granularity: DemandGranularity;
  onGranularityChange: (value: DemandGranularity) => void;
  contractPace: {
    weekly: number;
    monthly: number;
  };
}) {
  const visibleRows = rows.filter((row) => row.granularity === granularity).filter((row) => !filteredRowIds?.length || filteredRowIds.includes(row.id));
  const chartRows = useMemo(() => {
    return Object.values(
      visibleRows.reduce<Record<string, { bucket: string; forecast: number; actual: number; contractPace: number }>>((acc, row) => {
        const bucket = row.bucket;
        const baseline = granularity === "weekly" ? contractPace.weekly : contractPace.monthly;

        acc[bucket] = acc[bucket]
          ? {
              ...acc[bucket],
              forecast: acc[bucket].forecast + row.forecast,
              actual: acc[bucket].actual + row.actual,
            }
          : { bucket, forecast: row.forecast, actual: row.actual, contractPace: baseline };

        return acc;
      }, {}),
    );
  }, [contractPace.monthly, contractPace.weekly, granularity, visibleRows]);
  const overrides = visibleRows.filter((row) => row.promotion || row.manualOverride);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(148,163,184,0.08)]">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Demand and Pull Signals</h2>
          <p className="mt-1 text-xs text-muted-foreground">Weekly pull by location, forecast variance, promotions, and manual overrides.</p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
          {(["weekly", "monthly"] as DemandGranularity[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onGranularityChange(value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                granularity === value ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
        <div className="rounded-xl border border-border bg-background p-3.5">
          <p className="text-sm font-semibold text-foreground">Contract vs Forecast vs Actual Pull</p>
          <p className="mt-1 text-xs text-muted-foreground">Default view uses {granularity} buckets across customer locations.</p>
          <ChartContainer config={chartConfig} className="mt-3 h-[250px] min-h-[250px] w-full">
            <ComposedChart data={chartRows} margin={{ top: 12, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={56} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Legend />
              <Bar dataKey="forecast" fill="var(--color-forecast)" radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="contractPace" stroke="var(--color-contractPace)" strokeWidth={2} dot={false} strokeDasharray="6 5" />
            </ComposedChart>
          </ChartContainer>
        </div>

        <div className="rounded-xl border border-border bg-background p-3.5">
          <p className="text-sm font-semibold text-foreground">Promotion and Override Signals</p>
          <p className="mt-1 text-xs text-muted-foreground">Manual demand adjustments and promo-driven lift affecting the plan.</p>
          <div className="mt-3 space-y-2.5">
            {overrides.length > 0 ? (
              overrides.map((row) => (
                <div key={`${row.id}-override`} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{row.location}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{row.bucket}</p>
                    </div>
                    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", severityPillStyles[row.risk])}>
                      {row.risk}
                    </span>
                  </div>
                  <div className="mt-2.5 grid gap-1.5 text-xs text-muted-foreground">
                    <p><span className="font-medium text-foreground">Promotion:</span> {row.promotion ?? "None"}</p>
                    <p><span className="font-medium text-foreground">Manual Override:</span> {row.manualOverride ?? "None"}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-card px-4 py-6 text-center text-xs text-muted-foreground">
                No promotions or manual overrides in the current {granularity} view.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              {["Location", granularity === "weekly" ? "Week" : "Month", "Forecast", "Actual Pull", "Variance", "Promotion", "Manual Override", "Risk"].map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-foreground">{row.location}</TableCell>
                <TableCell>{row.bucket}</TableCell>
                <TableCell>{row.forecast.toLocaleString()}</TableCell>
                <TableCell>{row.actual.toLocaleString()}</TableCell>
                <TableCell className={row.variancePct > 8 ? "text-destructive" : row.variancePct > 3 ? "text-warning" : "text-foreground"}>
                  {row.variancePct > 0 ? "+" : ""}
                  {row.variancePct.toFixed(1)}%
                </TableCell>
                <TableCell>{row.promotion ?? "None"}</TableCell>
                <TableCell>{row.manualOverride ?? "None"}</TableCell>
                <TableCell>
                  <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", severityPillStyles[row.risk])}>
                    {row.risk}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
