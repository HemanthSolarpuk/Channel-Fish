import { Fragment, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceDot,
  XAxis,
  YAxis,
} from "recharts";
import type { DemandGranularity, DemandSignalRow } from "@/data/vmiProgramsData";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { severityPillStyles } from "./vmiStyles";

type DemandUnit = "cases" | "lbs";

const chartConfig = {
  forecast: { label: "Forecast", color: "hsl(var(--info))" },
  actual: { label: "Actual Pull", color: "hsl(var(--primary))" },
  rollingAverage: { label: "4-Week Avg Pull", color: "hsl(var(--warning))" },
  forecastUpper: { label: "Forecast Upper", color: "hsl(var(--info) / 0.35)" },
  forecastLower: { label: "Forecast Lower", color: "hsl(var(--info) / 0.35)" },
  cumulativeActual: { label: "Cumulative Actual", color: "hsl(var(--primary))" },
  cumulativeForecast: { label: "Cumulative Forecast", color: "hsl(var(--info))" },
  cumulativeContractPace: { label: "Contract Pace", color: "hsl(var(--warning))" },
} as const;

const skuToLbsPerCase: Record<string, number> = {
  "Fish Sticks & Crunchy Fillets": 24,
  "Beer Battered Cod Fillets": 20,
  "Breaded Shrimp": 18,
};

function convertUnits(value: number, unit: DemandUnit, sku: string) {
  if (unit === "cases") return value;
  return value * (skuToLbsPerCase[sku] ?? 1);
}

function formatUnitValue(value: number, unit: DemandUnit) {
  return `${Math.round(value).toLocaleString()} ${unit === "cases" ? "cases" : "lbs"}`;
}

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
  const [selectedSku, setSelectedSku] = useState("All SKUs");
  const [selectedLocation, setSelectedLocation] = useState("All DCs");
  const [unit, setUnit] = useState<DemandUnit>("cases");
  const [expandedSkus, setExpandedSkus] = useState<Record<string, boolean>>({});

  const skuOptions = useMemo(() => ["All SKUs", ...new Set(rows.map((row) => row.sku))], [rows]);
  const locationOptions = useMemo(() => ["All DCs", ...new Set(rows.map((row) => row.location))], [rows]);

  const visibleRows = useMemo(
    () =>
      rows
        .filter((row) => row.granularity === granularity)
        .filter((row) => !filteredRowIds?.length || filteredRowIds.includes(row.id))
        .filter((row) => selectedSku === "All SKUs" || row.sku === selectedSku)
        .filter((row) => selectedLocation === "All DCs" || row.location === selectedLocation),
    [filteredRowIds, granularity, rows, selectedLocation, selectedSku],
  );

  const chartRows = useMemo(() => {
    const ordered = Object.values(
      visibleRows.reduce<
        Record<
          string,
          {
            bucket: string;
            forecast: number;
            actual: number;
            topLocations: string[];
            abnormal: boolean;
            projected: boolean;
          }
        >
      >((acc, row) => {
        const forecastValue = convertUnits(row.forecast, unit, row.sku);
        const actualValue = convertUnits(row.actual, unit, row.sku);

        acc[row.bucket] = acc[row.bucket]
          ? {
              ...acc[row.bucket],
              forecast: acc[row.bucket].forecast + forecastValue,
              actual: acc[row.bucket].actual + actualValue,
              topLocations: [...acc[row.bucket].topLocations, `${row.location}: ${formatUnitValue(actualValue, unit)}`],
              abnormal: acc[row.bucket].abnormal || Math.abs(row.variancePct) >= 10,
              projected: acc[row.bucket].projected || Boolean(row.isProjected),
            }
          : {
              bucket: row.bucket,
              forecast: forecastValue,
              actual: actualValue,
              topLocations: [`${row.location}: ${formatUnitValue(actualValue, unit)}`],
              abnormal: Math.abs(row.variancePct) >= 10,
              projected: Boolean(row.isProjected),
            };

        return acc;
      }, {}),
    );

    return ordered.map((row, index) => {
      const rollingWindow = ordered.slice(Math.max(0, index - 3), index + 1);
      const rollingAverage = rollingWindow.reduce((sum, item) => sum + item.actual, 0) / rollingWindow.length;
      const variance = row.actual - row.forecast;
      const variancePct = row.forecast ? (variance / row.forecast) * 100 : 0;

      return {
        ...row,
        rollingAverage,
        variance,
        variancePct,
        forecastUpper: row.forecast * 1.08,
        forecastLower: row.forecast * 0.92,
        topLocations: row.topLocations.slice(0, 3),
      };
    });
  }, [unit, visibleRows]);

  const groupedRows = useMemo(() => {
    return Object.entries(
      visibleRows.reduce<Record<string, DemandSignalRow[]>>((acc, row) => {
        acc[row.sku] = acc[row.sku] ? [...acc[row.sku], row] : [row];
        return acc;
      }, {}),
    );
  }, [visibleRows]);

  const cumulativeRows = useMemo(() => {
    let cumulativeActual = 0;
    let cumulativeForecast = 0;
    let cumulativeContractPace = 0;
    const contractBaseline = granularity === "weekly" ? contractPace.weekly : contractPace.monthly;
    const baselineValue =
      unit === "cases"
        ? contractBaseline
        : contractBaseline * (selectedSku === "All SKUs" ? 21 : skuToLbsPerCase[selectedSku] ?? 21);

    return chartRows.map((row) => {
      cumulativeActual += row.actual;
      cumulativeForecast += row.forecast;
      cumulativeContractPace += baselineValue;

      return {
        bucket: row.bucket,
        cumulativeActual,
        cumulativeForecast,
        cumulativeContractPace,
      };
    });
  }, [chartRows, contractPace.monthly, contractPace.weekly, granularity, selectedSku, unit]);

  const overrides = visibleRows.filter((row) => row.promotion || row.manualOverride);

  const planningConsequence = useMemo(() => {
    const totalActual = chartRows.reduce((sum, row) => sum + row.actual, 0);
    const totalForecast = chartRows.reduce((sum, row) => sum + row.forecast, 0);
    const onHand = unit === "cases" ? 11167 : 268000;
    const inboundNext4Weeks = unit === "cases" ? 4667 : 112000;
    const historicalRows = chartRows.filter((row) => !row.projected);
    const avgActual = historicalRows.length ? historicalRows.reduce((sum, row) => sum + row.actual, 0) / historicalRows.length : totalActual / Math.max(chartRows.length, 1);
    const avgForecast = chartRows.length ? totalForecast / chartRows.length : 0;
    const stockoutBucket = chartRows.find((row) => row.actual > row.forecastUpper)?.bucket ?? "No stockout in horizon";

    return [
      { label: "Current On Hand", value: formatUnitValue(onHand, unit) },
      { label: "Confirmed Inbound Next 4 Weeks", value: formatUnitValue(inboundNext4Weeks, unit) },
      { label: "Weeks of Cover at Actual Pull", value: avgActual ? (onHand / avgActual).toFixed(1) : "0.0" },
      { label: "Weeks of Cover at Forecast Pull", value: avgForecast ? (onHand / avgForecast).toFixed(1) : "0.0" },
      { label: "Projected Stockout Date", value: stockoutBucket },
      { label: "Safety Stock Status", value: avgForecast && onHand / avgForecast < 3 ? "Breach Risk" : "Stable" },
    ];
  }, [chartRows, unit]);

  const insights = useMemo(() => {
    const byLocation = Object.values(
      visibleRows.reduce<Record<string, { location: string; variancePctTotal: number; count: number; actual: number; forecast: number }>>((acc, row) => {
        const actualValue = convertUnits(row.actual, unit, row.sku);
        const forecastValue = convertUnits(row.forecast, unit, row.sku);

        acc[row.location] = acc[row.location]
          ? {
              ...acc[row.location],
              variancePctTotal: acc[row.location].variancePctTotal + row.variancePct,
              count: acc[row.location].count + 1,
              actual: acc[row.location].actual + actualValue,
              forecast: acc[row.location].forecast + forecastValue,
            }
          : {
              location: row.location,
              variancePctTotal: row.variancePct,
              count: 1,
              actual: actualValue,
              forecast: forecastValue,
            };

        return acc;
      }, {}),
    ).map((row) => ({
      ...row,
      averageVariancePct: row.variancePctTotal / row.count,
    }));

    const overpull = [...byLocation].sort((a, b) => b.averageVariancePct - a.averageVariancePct)[0];
    const underpull = [...byLocation].sort((a, b) => a.averageVariancePct - b.averageVariancePct)[0];
    const totalForecast = byLocation.reduce((sum, row) => sum + row.forecast, 0);
    const totalActual = byLocation.reduce((sum, row) => sum + row.actual, 0);
    const forecastAccuracy = totalForecast ? Math.max(0, 100 - (Math.abs(totalActual - totalForecast) / totalForecast) * 100) : 100;
    const varianceValues = chartRows.map((row) => row.variancePct);
    const averageVariance = varianceValues.length ? varianceValues.reduce((sum, value) => sum + value, 0) / varianceValues.length : 0;
    const volatility = varianceValues.length
      ? Math.sqrt(varianceValues.reduce((sum, value) => sum + (value - averageVariance) ** 2, 0) / varianceValues.length)
      : 0;
    const contractAttainment = cumulativeRows.length
      ? (cumulativeRows[cumulativeRows.length - 1].cumulativeActual / cumulativeRows[cumulativeRows.length - 1].cumulativeContractPace) * 100
      : 0;
    const demandRiskStatus = volatility > 7 || forecastAccuracy < 92 ? "High" : forecastAccuracy < 96 ? "Medium" : "Low";

    return [
      { label: "Biggest Overpull Location", value: overpull ? `${overpull.location} (${overpull.averageVariancePct.toFixed(1)}%)` : "None" },
      { label: "Biggest Underpull Location", value: underpull ? `${underpull.location} (${underpull.averageVariancePct.toFixed(1)}%)` : "None" },
      { label: "Forecast Accuracy %", value: `${forecastAccuracy.toFixed(1)}%` },
      { label: "Pull Volatility", value: `${volatility.toFixed(1)} pts` },
      { label: "Contract Attainment %", value: `${contractAttainment.toFixed(1)}%` },
      { label: "Demand Risk Status", value: demandRiskStatus },
    ];
  }, [chartRows, cumulativeRows, unit, visibleRows]);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(148,163,184,0.08)]">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Demand and Pull Signals</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
            Customer Location / DC
            <select
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
            >
              {locationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
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
          <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
            {(["cases", "lbs"] as DemandUnit[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setUnit(value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium uppercase transition-colors",
                  unit === value ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-3.5">
            <p className="text-sm font-semibold text-foreground">Demand vs Plan</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {granularity === "weekly"
                ? "Three observed weeks plus one forward planning week for the selected demand scope."
                : "Last closed month plus the projected current-month close for the selected demand scope."}
            </p>
            <ChartContainer config={chartConfig} className="mt-3 h-[280px] min-h-[280px] w-full">
              <ComposedChart data={chartRows} margin={{ top: 12, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={72} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      formatter={(value, name, item) => {
                        if (!item?.payload) return [value, name];
                        if (name === "actual") {
                          return [formatUnitValue(Number(value), unit), item.payload.projected ? "Projected Pull" : "Actual Pull"];
                        }
                        if (name === "forecast") return [formatUnitValue(Number(value), unit), "Forecast"];
                        if (name === "rollingAverage") return [formatUnitValue(Number(value), unit), "4-Week Avg"];
                        return [value, name];
                      }}
                      labelFormatter={(_, payload) => {
                        const row = payload?.[0]?.payload;
                        if (!row) return "";
                        const pullLabel = row.projected ? "Projected" : "Actual";
                        return `${row.bucket}${row.projected ? " | Projected close" : ""} | Forecast ${formatUnitValue(row.forecast, unit)} | ${pullLabel} ${formatUnitValue(row.actual, unit)} | Variance ${formatUnitValue(row.variance, unit)} (${row.variancePct.toFixed(1)}%) | 4-Week Avg ${formatUnitValue(row.rollingAverage, unit)} | ${row.topLocations.join(", ")}`;
                      }}
                    />
                  }
                />
                <Legend />
                <Line type="monotone" dataKey="forecastUpper" stroke="var(--color-forecastUpper)" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="forecastLower" stroke="var(--color-forecastLower)" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                <Bar dataKey="actual" fill="var(--color-actual)" radius={[6, 6, 0, 0]}>
                  {chartRows.map((row) => (
                    <Cell key={`${row.bucket}-actual`} fill={row.projected ? "hsl(var(--primary) / 0.45)" : "var(--color-actual)"} />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="forecast" stroke="var(--color-forecast)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="rollingAverage" stroke="var(--color-rollingAverage)" strokeWidth={2} dot={false} strokeDasharray="6 5" />
                {chartRows
                  .filter((row) => row.abnormal)
                  .map((row) => (
                    <ReferenceDot key={`${row.bucket}-marker`} x={row.bucket} y={row.actual} r={5} fill="hsl(var(--destructive))" stroke="white" />
                  ))}
              </ComposedChart>
            </ChartContainer>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {planningConsequence.map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-background p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-background p-3.5">
            <p className="text-sm font-semibold text-foreground">Contract Attainment</p>
            <p className="mt-1 text-xs text-muted-foreground">Cumulative progress against forecast and broader contract pace.</p>
            <ChartContainer config={chartConfig} className="mt-3 h-[220px] min-h-[220px] w-full">
              <ComposedChart data={cumulativeRows} margin={{ top: 12, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={72} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Legend />
                <Line type="monotone" dataKey="cumulativeActual" stroke="var(--color-cumulativeActual)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="cumulativeForecast" stroke="var(--color-cumulativeForecast)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="cumulativeContractPace" stroke="var(--color-cumulativeContractPace)" strokeWidth={2} dot={false} strokeDasharray="6 5" />
              </ComposedChart>
            </ChartContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-3.5">
            <p className="text-sm font-semibold text-foreground">Demand Planning Insights</p>
            <div className="mt-3 space-y-2.5">
              {insights.map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-card px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
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
                        <p className="text-sm font-semibold text-foreground">{row.sku}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{row.location} • {row.bucket}</p>
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
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background p-3.5">
        <p className="text-sm font-semibold text-foreground">Demand Variance Table</p>
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              {["SKU", "Customer Location / DC", "Forecast", "Actual", "Variance", "Variance %", "Trend", "Action Flag"].map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedRows.map(([sku, skuRows]) => {
              const expanded = expandedSkus[sku] ?? false;
              const topRisk = skuRows.some((row) => row.risk === "Critical")
                ? "Critical"
                : skuRows.some((row) => row.risk === "High")
                  ? "High"
                  : skuRows.some((row) => row.risk === "Medium")
                    ? "Medium"
                    : "Low";

              return (
                <Fragment key={sku}>
                  <TableRow className="bg-secondary/40">
                    <TableCell className="font-semibold text-foreground">
                      <button
                        type="button"
                        onClick={() => setExpandedSkus((current) => ({ ...current, [sku]: !expanded }))}
                        className="flex items-center gap-2 text-left"
                      >
                        <span>{expanded ? "−" : "+"}</span>
                        <span>{sku}</span>
                        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", severityPillStyles[topRisk])}>
                          {topRisk}
                        </span>
                      </button>
                    </TableCell>
                    <TableCell colSpan={7} className="text-muted-foreground">
                      {skuRows.length} DCs
                    </TableCell>
                  </TableRow>
                  {expanded
                    ? skuRows.map((row) => {
                        const forecastValue = convertUnits(row.forecast, unit, row.sku);
                        const actualValue = convertUnits(row.actual, unit, row.sku);
                        const varianceValue = actualValue - forecastValue;
                        const trend = row.variancePct >= 8 ? "Overpull" : row.variancePct <= -5 ? "Underpull" : "Stable";
                        const actionFlag = row.risk === "High" || row.risk === "Critical" ? "Review now" : row.risk === "Medium" ? "Monitor" : "On track";

                        return (
                          <TableRow key={row.id}>
                            <TableCell className="pl-8 font-medium text-foreground">{row.sku}</TableCell>
                            <TableCell>{row.location}</TableCell>
                            <TableCell>{formatUnitValue(forecastValue, unit)}</TableCell>
                            <TableCell>{formatUnitValue(actualValue, unit)}</TableCell>
                            <TableCell>{varianceValue > 0 ? "+" : ""}{formatUnitValue(varianceValue, unit)}</TableCell>
                            <TableCell className={row.variancePct > 8 ? "text-destructive" : row.variancePct > 3 ? "text-warning" : "text-foreground"}>
                              {row.variancePct > 0 ? "+" : ""}
                              {row.variancePct.toFixed(1)}%
                            </TableCell>
                            <TableCell>{trend}</TableCell>
                            <TableCell>{actionFlag}</TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
