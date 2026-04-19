import { type ChangeEvent } from "react";
import { Bar, ComposedChart, Legend, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import type { CoveragePoint } from "@/data/vmiProgramsData";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  forecastDemand: { label: "Forecast Demand", color: "hsl(var(--info))" },
  actualPull: { label: "Actual Pull", color: "hsl(var(--primary))" },
  availableInventory: { label: "Available Inventory", color: "hsl(var(--success))" },
  confirmedInbound: { label: "Inbound Arrivals", color: "hsl(var(--warning))" },
  safetyStock: { label: "Safety Stock", color: "hsl(var(--destructive))" },
} as const;

interface Props {
  points: CoveragePoint[];
  skuOptions: string[];
  selectedSku: string;
  onSkuChange: (value: string) => void;
}

export function CoverageProjectionChart({ points, skuOptions, selectedSku, onSkuChange }: Props) {
  const handleSkuChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSkuChange(event.target.value);
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(148,163,184,0.08)]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-sm font-semibold text-foreground">Coverage and Demand</h2>
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          SKU
          <select
            value={selectedSku}
            onChange={handleSkuChange}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
          >
            {skuOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ChartContainer config={chartConfig} className="h-[320px] min-h-[320px] w-full">
        <ComposedChart data={points} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="week" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={56} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Legend />
          <Bar dataKey="confirmedInbound" fill="var(--color-confirmedInbound)" radius={[6, 6, 0, 0]} />
          <Line type="monotone" dataKey="forecastDemand" stroke="var(--color-forecastDemand)" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="actualPull" stroke="var(--color-actualPull)" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="availableInventory" stroke="var(--color-availableInventory)" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="safetyStock" stroke="var(--color-safetyStock)" strokeWidth={2} dot={false} strokeDasharray="6 5" />
        </ComposedChart>
      </ChartContainer>
    </section>
  );
}
