export type VmiDisplayState = "ready" | "loading" | "error";

export type VmiPillTone = "good" | "warning" | "critical" | "info";

export interface VmiSummaryMetric {
  label: string;
  value: string;
  detail?: string;
  tone?: VmiPillTone;
}

export interface VmiCoveragePoint {
  week: string;
  onHand: number;
  projected: number;
  safetyStock: number;
}

export interface VmiAlert {
  id: string;
  tone: VmiPillTone;
  title: string;
  detail: string;
  action: string;
}

export interface WarehouseInventoryRow {
  warehouse: string;
  location: string;
  available: string;
  allocated: string;
  weeksOfCover: string;
  status: string;
  tone: VmiPillTone;
}

export interface InboundTrackerEntry {
  id: string;
  eta: string;
  source: string;
  quantity: string;
  status: string;
  tone: VmiPillTone;
}

export interface DemandSignalRow {
  signal: string;
  horizon: string;
  trend: string;
  delta: string;
  confidence: string;
  tone: VmiPillTone;
}

export interface VmiContextRecord {
  state: VmiDisplayState;
  summary: VmiSummaryMetric[];
  coverageProjection: VmiCoveragePoint[];
  alerts: VmiAlert[];
  inventoryByWarehouse: WarehouseInventoryRow[];
  inboundTracker: InboundTrackerEntry[];
  demandSignals: DemandSignalRow[];
  errorMessage?: string;
}

export const mockVmiContext: Record<string, VmiContextRecord> = {
  "7516245499": {
    state: "ready",
    summary: [
      { label: "On Hand", value: "48,200 lbs", detail: "Across 3 warehouses" },
      { label: "Confirmed Inbound", value: "16,000 lbs", detail: "2 inbound loads" },
      { label: "Avg Weekly Pull", value: "9,200 lbs", detail: "Trailing 6 weeks" },
      { label: "Weeks of Cover", value: "6.2 weeks", detail: "At current pull" },
      { label: "Safety Stock Status", value: "Covered", detail: "1.8 weeks above floor", tone: "good" },
      { label: "Program Risk", value: "Low", detail: "No disruption expected", tone: "good" },
    ],
    coverageProjection: [
      { week: "Wk 1", onHand: 48.2, projected: 39.1, safetyStock: 22 },
      { week: "Wk 2", onHand: 39.1, projected: 33.4, safetyStock: 22 },
      { week: "Wk 3", onHand: 33.4, projected: 29.2, safetyStock: 22 },
      { week: "Wk 4", onHand: 29.2, projected: 35.5, safetyStock: 22 },
      { week: "Wk 5", onHand: 35.5, projected: 30.8, safetyStock: 22 },
      { week: "Wk 6", onHand: 30.8, projected: 25.6, safetyStock: 22 },
      { week: "Wk 7", onHand: 25.6, projected: 24.4, safetyStock: 22 },
      { week: "Wk 8", onHand: 24.4, projected: 22.8, safetyStock: 22 },
    ],
    alerts: [
      {
        id: "aldi-coverage",
        tone: "warning",
        title: "Cover tightens in week 7",
        detail: "Projected stock approaches safety stock by the end of the 8-week window.",
        action: "Advance the April replenishment PO by 3 days.",
      },
      {
        id: "aldi-mix",
        tone: "info",
        title: "Warehouse mix is unbalanced",
        detail: "Allentown holds 58% of current inventory while the Midwest lane is trending higher.",
        action: "Reallocate 4 pallets to Chicago cold storage.",
      },
      {
        id: "aldi-demand",
        tone: "good",
        title: "Demand signal stable",
        detail: "Customer pull remains within 4% of trailing baseline.",
        action: "Keep current release cadence unchanged.",
      },
    ],
    inventoryByWarehouse: [
      { warehouse: "Americold Allentown", location: "Allentown, PA", available: "28,000 lbs", allocated: "8,400 lbs", weeksOfCover: "3.0", status: "Healthy", tone: "good" },
      { warehouse: "Lineage Chicago", location: "Joliet, IL", available: "12,600 lbs", allocated: "2,100 lbs", weeksOfCover: "1.4", status: "Watch", tone: "warning" },
      { warehouse: "Preferred Freezer Atlanta", location: "McDonough, GA", available: "7,600 lbs", allocated: "1,900 lbs", weeksOfCover: "0.8", status: "Tight", tone: "critical" },
    ],
    inboundTracker: [
      { id: "INB-ALDI-201", eta: "Apr 22", source: "Vietnam Seafood Corp", quantity: "8,000 lbs", status: "Booked", tone: "info" },
      { id: "INB-ALDI-205", eta: "Apr 29", source: "Pacific Seafood Exports", quantity: "8,000 lbs", status: "Confirmed", tone: "good" },
    ],
    demandSignals: [
      { signal: "Customer forecast", horizon: "Next 4 weeks", trend: "Stable", delta: "+2.1%", confidence: "High", tone: "good" },
      { signal: "Recent pull-through", horizon: "Trailing 2 weeks", trend: "Up", delta: "+5.4%", confidence: "Medium", tone: "warning" },
      { signal: "Promo lift assumption", horizon: "Week 6", trend: "Flat", delta: "0.0%", confidence: "Medium", tone: "info" },
    ],
  },
  "11428530": {
    state: "ready",
    summary: [
      { label: "On Hand", value: "62,000 lbs", detail: "Across Houston + Dallas" },
      { label: "Confirmed Inbound", value: "12,400 lbs", detail: "1 supplier load" },
      { label: "Avg Weekly Pull", value: "11,600 lbs", detail: "Trailing 6 weeks" },
      { label: "Weeks of Cover", value: "5.4 weeks", detail: "Includes inbound" },
      { label: "Safety Stock Status", value: "At Risk", detail: "Below target by week 6", tone: "warning" },
      { label: "Program Risk", value: "Medium", detail: "Carrier timing impacts cover", tone: "warning" },
    ],
    coverageProjection: [
      { week: "Wk 1", onHand: 62, projected: 50.4, safetyStock: 28 },
      { week: "Wk 2", onHand: 50.4, projected: 42.1, safetyStock: 28 },
      { week: "Wk 3", onHand: 42.1, projected: 35.9, safetyStock: 28 },
      { week: "Wk 4", onHand: 35.9, projected: 31.2, safetyStock: 28 },
      { week: "Wk 5", onHand: 31.2, projected: 26.4, safetyStock: 28 },
      { week: "Wk 6", onHand: 26.4, projected: 24.8, safetyStock: 28 },
      { week: "Wk 7", onHand: 24.8, projected: 21.9, safetyStock: 28 },
      { week: "Wk 8", onHand: 21.9, projected: 18.6, safetyStock: 28 },
    ],
    alerts: [
      {
        id: "mclane-risk",
        tone: "critical",
        title: "Safety stock breach projected",
        detail: "Coverage dips below target starting week 5 if the inbound shipment slips.",
        action: "Escalate alternate supply from Gulf Coast reserve inventory.",
      },
      {
        id: "mclane-dispatch",
        tone: "warning",
        title: "Inbound load still awaiting dispatch",
        detail: "The replenishment carrier has not confirmed dock departure.",
        action: "Confirm dispatch with VANTIX LOGISTICS by 2 PM.",
      },
      {
        id: "mclane-demand",
        tone: "info",
        title: "Demand pulse up vs plan",
        detail: "Recent order cadence is 7% above prior forecast.",
        action: "Review pull forecast before finalizing next release.",
      },
    ],
    inventoryByWarehouse: [
      { warehouse: "WH-Houston-03", location: "Houston, TX", available: "39,500 lbs", allocated: "17,200 lbs", weeksOfCover: "3.4", status: "Watch", tone: "warning" },
      { warehouse: "Dallas Cold Hub", location: "Dallas, TX", available: "22,500 lbs", allocated: "8,900 lbs", weeksOfCover: "2.0", status: "Tight", tone: "critical" },
    ],
    inboundTracker: [
      { id: "INB-MCL-118", eta: "Apr 23", source: "Nordic Fish AS", quantity: "12,400 lbs", status: "Awaiting Dispatch", tone: "warning" },
    ],
    demandSignals: [
      { signal: "Customer forecast", horizon: "Next 8 weeks", trend: "Up", delta: "+6.8%", confidence: "High", tone: "warning" },
      { signal: "Recent pull-through", horizon: "Trailing 2 weeks", trend: "Up", delta: "+7.2%", confidence: "Medium", tone: "warning" },
      { signal: "Backorder pressure", horizon: "Week 5+", trend: "Rising", delta: "+2 sites", confidence: "Low", tone: "critical" },
    ],
  },
  "USF-7798321": {
    state: "loading",
    summary: [],
    coverageProjection: [],
    alerts: [],
    inventoryByWarehouse: [],
    inboundTracker: [],
    demandSignals: [],
  },
  "KR-9981402": {
    state: "error",
    summary: [],
    coverageProjection: [],
    alerts: [],
    inventoryByWarehouse: [],
    inboundTracker: [],
    demandSignals: [],
    errorMessage: "VMI context feed failed to load. Retry after the warehouse sync completes.",
  },
};
