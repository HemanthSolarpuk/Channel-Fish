import { AlertTriangle, ArrowRightLeft, CircleAlert, PackageCheck } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import {
  type VmiAlert,
  type VmiContextRecord,
  type VmiPillTone,
  type VmiSummaryMetric,
  type WarehouseInventoryRow,
} from "@/data/mockVmiContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const toneStyles: Record<VmiPillTone, string> = {
  good: "border border-success/25 bg-success/15 text-success",
  warning: "border border-warning/30 bg-warning/15 text-warning",
  critical: "border border-destructive/25 bg-destructive/15 text-destructive",
  info: "border border-primary/25 bg-primary/10 text-primary",
};

const chartConfig = {
  projected: { label: "Projected OH", color: "hsl(var(--primary))" },
  safetyStock: { label: "Safety Stock", color: "hsl(var(--warning))" },
} as const;

function metricToneClass(metric: VmiSummaryMetric) {
  return metric.tone ? toneStyles[metric.tone] : "border border-primary/15 bg-primary/5 text-primary";
}

function pillClass(tone: VmiPillTone) {
  return toneStyles[tone];
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-dashed border-border bg-white px-6 text-center">
      <div className="max-w-md space-y-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="h-3 w-20 rounded-full bg-stone-100" />
            <div className="mt-4 h-8 w-24 rounded-full bg-stone-200" />
            <div className="mt-3 h-3 w-28 rounded-full bg-stone-100" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
        <div className="h-[320px] rounded-3xl border border-stone-200 bg-white" />
        <div className="h-[320px] rounded-3xl border border-stone-200 bg-white" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.8fr)_minmax(0,1fr)]">
        <div className="h-[280px] rounded-3xl border border-stone-200 bg-white" />
        <div className="h-[280px] rounded-3xl border border-stone-200 bg-white" />
        <div className="h-[280px] rounded-3xl border border-stone-200 bg-white" />
      </div>
    </div>
  );
}

function SectionHeader({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function WarehouseStatus({ row }: { row: WarehouseInventoryRow }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", pillClass(row.tone))}>{row.status}</span>;
}

function AlertCard({ alert }: { alert: VmiAlert }) {
  const icon = alert.tone === "critical" ? CircleAlert : alert.tone === "warning" ? AlertTriangle : alert.tone === "good" ? PackageCheck : ArrowRightLeft;
  const Icon = icon;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn("mt-0.5 rounded-xl p-2", pillClass(alert.tone))}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{alert.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{alert.detail}</p>
          </div>
        </div>
        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", pillClass(alert.tone))}>{alert.tone}</span>
      </div>
      <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Recommended Action</p>
        <p className="mt-1 text-sm text-foreground">{alert.action}</p>
      </div>
    </div>
  );
}

export function VmiContextPanel({ poNumber, context }: { poNumber: string; context?: VmiContextRecord }) {
  if (!context) {
    return <EmptyState title="No VMI context for this PO" detail={`No mocked VMI context is mapped to PO ${poNumber} yet.`} />;
  }

  if (context.state === "loading") {
    return <LoadingState />;
  }

  if (context.state === "error") {
    return <EmptyState title="Unable to load VMI context" detail={context.errorMessage ?? `VMI context for PO ${poNumber} is currently unavailable.`} />;
  }

  if (context.summary.length === 0) {
    return <EmptyState title="VMI context is empty" detail={`PO ${poNumber} has no summary or inventory signals in the mock dataset.`} />;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {context.summary.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_8px_24px_rgba(148,163,184,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{metric.label}</p>
            <div className="mt-3 flex items-start justify-between gap-3">
              <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
              {metric.tone ? (
                <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", metricToneClass(metric))}>{metric.value}</span>
              ) : null}
            </div>
            {metric.detail ? <p className="mt-3 text-sm text-muted-foreground">{metric.detail}</p> : null}
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_36px_rgba(148,163,184,0.12)]">
          <SectionHeader title="Coverage Projection" detail="Projected on-hand inventory vs safety stock for the next 8 weeks." />
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={context.coverageProjection} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={48} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Area
                type="monotone"
                dataKey="projected"
                stroke="var(--color-projected)"
                fill="var(--color-projected)"
                fillOpacity={0.14}
                strokeWidth={3}
              />
              <Line type="monotone" dataKey="safetyStock" stroke="var(--color-safetyStock)" strokeWidth={2} dot={false} strokeDasharray="6 5" />
            </AreaChart>
          </ChartContainer>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_36px_rgba(148,163,184,0.12)]">
          <SectionHeader title="Alerts and Recommended Actions" detail="Operational watchouts tied to inventory cover, inbound health, and demand signals." />
          <div className="space-y-3">
            {context.alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.75fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_36px_rgba(148,163,184,0.12)]">
          <SectionHeader title="Inventory by Warehouse" detail="Available inventory, allocations, and coverage by warehouse." />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Warehouse</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>WOC</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {context.inventoryByWarehouse.map((row) => (
                <TableRow key={row.warehouse}>
                  <TableCell className="font-medium text-foreground">{row.warehouse}</TableCell>
                  <TableCell className="text-muted-foreground">{row.location}</TableCell>
                  <TableCell>{row.available}</TableCell>
                  <TableCell>{row.allocated}</TableCell>
                  <TableCell>{row.weeksOfCover}</TableCell>
                  <TableCell><WarehouseStatus row={row} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_36px_rgba(148,163,184,0.12)]">
          <SectionHeader title="Inbound Tracker" detail="Confirmed inbound loads supporting this PO." />
          <div className="space-y-3">
            {context.inboundTracker.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{entry.id}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{entry.source}</p>
                  </div>
                  <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", pillClass(entry.tone))}>{entry.status}</span>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">ETA</p>
                    <p className="mt-1 text-foreground">{entry.eta}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Quantity</p>
                    <p className="mt-1 text-foreground">{entry.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_36px_rgba(148,163,184,0.12)]">
          <SectionHeader title="Demand Signals" detail="Commercial and pull-through inputs shaping forecast confidence." />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Signal</TableHead>
                <TableHead>Horizon</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Delta</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {context.demandSignals.map((signal) => (
                <TableRow key={signal.signal}>
                  <TableCell className="font-medium text-foreground">{signal.signal}</TableCell>
                  <TableCell>{signal.horizon}</TableCell>
                  <TableCell>{signal.trend}</TableCell>
                  <TableCell>{signal.delta}</TableCell>
                  <TableCell>
                    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", pillClass(signal.tone))}>{signal.confidence}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
}
