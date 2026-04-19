export type ProgramStatus = "Healthy" | "Watchlist" | "At Risk" | "Overstocked";
export type ProgramSeverity = "Low" | "Medium" | "High" | "Critical";
export type ProgramTone = "good" | "warning" | "critical" | "info";
export type ProgramDetailState = "ready" | "loading" | "error";
export type DemandGranularity = "weekly" | "monthly";

export interface VmiProgramSummary {
  id: string;
  programName: string;
  customer: string;
  contractPeriod: string;
  onHandPlusConfirmed: string;
  openOrderQuantity: string;
  onWaterQuantity: string;
  totalContractQuantity: string;
  skuCount: number;
  locationCount: number;
  onHandInventory: string;
  confirmedInbound: string;
  avgWeeklyPull: string;
  weeksOfCover: string;
  serviceRisk: ProgramSeverity;
  fillRateOtf: string;
  openExceptions: number;
  lastUpdated: string;
  status: ProgramStatus;
  warehouses: string[];
  buyer: string;
  salesOwner: string;
}

export interface ProgramKpi {
  label: string;
  value: string;
  detail?: string;
  tone?: ProgramTone;
}

export interface CoveragePoint {
  week: string;
  forecastDemand: number;
  actualPull: number;
  availableInventory: number;
  confirmedInbound: number;
  safetyStock: number;
}

export interface CoverageProjectionBySku {
  label: string;
  points: CoveragePoint[];
}

export interface InventoryCoverageRow {
  id: string;
  sku: string;
  description: string;
  warehouse: string;
  customerLocation: string;
  onHand: number;
  allocated: number;
  available: number;
  avg4WeekPull: number;
  avg8WeekPull: number;
  forecastNext4Weeks: number;
  weeksOfCover: number;
  safetyStock: number;
  agingDays: number;
  riskStatus: ProgramStatus;
}

export interface InboundSupplyRow {
  id: string;
  supplier: string;
  originCountry: string;
  supplierPo: string;
  containerNo: string;
  sku: string;
  qty: number;
  stage: "Not Started" | "In Production" | "Packed" | "Booked" | "On Water" | "Customs" | "Arrived";
  eta: string;
  delayVsLeadTime: string;
  destinationWarehouse: string;
  risk: ProgramSeverity;
}

export interface DemandSignalRow {
  id: string;
  location: string;
  bucket: string;
  forecast: number;
  actual: number;
  variancePct: number;
  promotion?: string;
  manualOverride?: string;
  risk: ProgramSeverity;
  granularity: DemandGranularity;
}

export interface ProgramException {
  id: string;
  severity: ProgramSeverity;
  issue: string;
  impactedSku: string;
  impactedLocation: string;
  reason: string;
  recommendedAction: string;
  inventoryRowIds: string[];
  inboundRowIds: string[];
  demandSignalIds: string[];
}

export interface FinanceLensMetric {
  label: string;
  value: string;
  detail: string;
}

export interface RelatedDelivery {
  releaseCaseId: string;
  deliveryId: string;
  customerLocation: string;
  requestedDate: string;
  quantity: string;
  fulfillmentMode: "Pickup Scheduled" | "Carrier Delivery";
  status: string;
  nextAction: string;
}

export interface VmiProgramDetail {
  id: string;
  summary: VmiProgramSummary;
  state: ProgramDetailState;
  customer: string;
  contractPeriod: string;
  salesOwner: string;
  planner: string;
  buyer: string;
  programStatus: ProgramStatus;
  kpis: ProgramKpi[];
  coverageProjection: CoveragePoint[];
  inventoryCoverageRows: InventoryCoverageRow[];
  inboundSupplyRows: InboundSupplyRow[];
  demandSignalRows: DemandSignalRow[];
  exceptions: ProgramException[];
  financeLens: FinanceLensMetric[];
  relatedDeliveries: RelatedDelivery[];
  demandPace: {
    weeklyContract: number;
    monthlyContract: number;
  };
  coverageProjectionBySku: CoverageProjectionBySku[];
  errorMessage?: string;
}

export const vmiPrograms: VmiProgramSummary[] = [
  {
    id: "aldi-northeast-frozen-seafood-vmi",
    programName: "Aldi Northeast Frozen Seafood VMI",
    customer: "Aldi Inc.",
    contractPeriod: "Jan 2026 to Dec 2026",
    onHandPlusConfirmed: "380,000 lbs",
    openOrderQuantity: "148,000 lbs",
    onWaterQuantity: "24,000 lbs",
    totalContractQuantity: "2.65M lbs",
    skuCount: 3,
    locationCount: 3,
    onHandInventory: "268,000 lbs",
    confirmedInbound: "112,000 lbs",
    avgWeeklyPull: "46,800 lbs",
    weeksOfCover: "5.7",
    serviceRisk: "Medium",
    fillRateOtf: "97.8%",
    openExceptions: 4,
    lastUpdated: "Apr 19, 2026 9:40 AM",
    status: "Watchlist",
    warehouses: ["Allentown", "Dallas", "Los Angeles"],
    buyer: "Lena B.",
    salesOwner: "Rini S.",
  },
  {
    id: "kroger-coastal-shrimp-vmi",
    programName: "Kroger Coastal Shrimp VMI",
    customer: "Kroger",
    contractPeriod: "Feb 2026 to Jan 2027",
    onHandPlusConfirmed: "182,000 lbs",
    openOrderQuantity: "46,000 lbs",
    onWaterQuantity: "18,000 lbs",
    totalContractQuantity: "1.92M lbs",
    skuCount: 4,
    locationCount: 4,
    onHandInventory: "154,000 lbs",
    confirmedInbound: "28,000 lbs",
    avgWeeklyPull: "38,500 lbs",
    weeksOfCover: "3.2",
    serviceRisk: "High",
    fillRateOtf: "94.6%",
    openExceptions: 6,
    lastUpdated: "Apr 18, 2026 4:10 PM",
    status: "At Risk",
    warehouses: ["Savannah", "Houston"],
    buyer: "Marta J.",
    salesOwner: "Caleb D.",
  },
  {
    id: "walmart-west-coast-shrimp-vmi",
    programName: "Walmart West Coast Shrimp VMI",
    customer: "Walmart",
    contractPeriod: "Jan 2026 to Dec 2026",
    onHandPlusConfirmed: "434,000 lbs",
    openOrderQuantity: "34,000 lbs",
    onWaterQuantity: "12,000 lbs",
    totalContractQuantity: "3.10M lbs",
    skuCount: 5,
    locationCount: 5,
    onHandInventory: "412,000 lbs",
    confirmedInbound: "22,000 lbs",
    avgWeeklyPull: "41,200 lbs",
    weeksOfCover: "9.8",
    serviceRisk: "Low",
    fillRateOtf: "99.1%",
    openExceptions: 2,
    lastUpdated: "Apr 17, 2026 2:15 PM",
    status: "Overstocked",
    warehouses: ["Los Angeles", "Portland"],
    buyer: "Devon K.",
    salesOwner: "Maya T.",
  },
];

export const vmiProgramDetails: Record<string, VmiProgramDetail> = {
  "aldi-northeast-frozen-seafood-vmi": {
    id: "aldi-northeast-frozen-seafood-vmi",
    summary: vmiPrograms[0],
    state: "ready",
    customer: "Aldi Inc.",
    contractPeriod: "Jan 2026 to Dec 2026",
    salesOwner: "Rini S.",
    planner: "Raghav P.",
    buyer: "Lena B.",
    programStatus: "Watchlist",
    kpis: [
      { label: "Contract Qty", value: "2.65M lbs", detail: "Annual commitment" },
      { label: "Contract Fulfilled Till Now", value: "1.18M lbs", detail: "44.5% of annual contract" },
      { label: "Forecast Next 4 Weeks", value: "188,000 lbs", detail: "Across 3 DCs" },
      { label: "Actual Pull Last 4 Weeks", value: "181,600 lbs", detail: "+3.5% vs forecast" },
      { label: "On Hand", value: "268,000 lbs", detail: "Across 3 warehouses" },
      { label: "Open Order Quantity", value: "148,000 lbs", detail: "Across 4 DC orders pending fulfillment" },
      { label: "Safety Stock Status", value: "Breach Risk", detail: "Cod fillets by week 6" },
      { label: "Fill Rate / OTF", value: "97.8%", detail: "Rolling 8-week service" },
      { label: "On Water Quantity", value: "24,000 lbs", detail: "Vietnam cod shipment" },
    ],
    coverageProjection: [
      { week: "Wk 1", forecastDemand: 44, actualPull: 42, availableInventory: 268, confirmedInbound: 0, safetyStock: 112 },
      { week: "Wk 2", forecastDemand: 47, actualPull: 46, availableInventory: 223, confirmedInbound: 24, safetyStock: 112 },
      { week: "Wk 3", forecastDemand: 48, actualPull: 49, availableInventory: 199, confirmedInbound: 0, safetyStock: 112 },
      { week: "Wk 4", forecastDemand: 49, actualPull: 47, availableInventory: 150, confirmedInbound: 36, safetyStock: 112 },
      { week: "Wk 5", forecastDemand: 50, actualPull: 52, availableInventory: 137, confirmedInbound: 0, safetyStock: 112 },
      { week: "Wk 6", forecastDemand: 52, actualPull: 54, availableInventory: 85, confirmedInbound: 28, safetyStock: 112 },
      { week: "Wk 7", forecastDemand: 53, actualPull: 55, availableInventory: 61, confirmedInbound: 24, safetyStock: 112 },
      { week: "Wk 8", forecastDemand: 50, actualPull: 51, availableInventory: 35, confirmedInbound: 0, safetyStock: 112 },
      { week: "Wk 9", forecastDemand: 49, actualPull: 48, availableInventory: -14, confirmedInbound: 0, safetyStock: 112 },
      { week: "Wk 10", forecastDemand: 48, actualPull: 47, availableInventory: -62, confirmedInbound: 0, safetyStock: 112 },
      { week: "Wk 11", forecastDemand: 47, actualPull: 46, availableInventory: -109, confirmedInbound: 0, safetyStock: 112 },
      { week: "Wk 12", forecastDemand: 47, actualPull: 45, availableInventory: -156, confirmedInbound: 0, safetyStock: 112 },
    ],
    coverageProjectionBySku: [
      {
        label: "All SKUs",
        points: [
          { week: "Wk 1", forecastDemand: 44, actualPull: 42, availableInventory: 268, confirmedInbound: 0, safetyStock: 112 },
          { week: "Wk 2", forecastDemand: 47, actualPull: 46, availableInventory: 223, confirmedInbound: 24, safetyStock: 112 },
          { week: "Wk 3", forecastDemand: 48, actualPull: 49, availableInventory: 199, confirmedInbound: 0, safetyStock: 112 },
          { week: "Wk 4", forecastDemand: 49, actualPull: 47, availableInventory: 150, confirmedInbound: 36, safetyStock: 112 },
          { week: "Wk 5", forecastDemand: 50, actualPull: 52, availableInventory: 137, confirmedInbound: 0, safetyStock: 112 },
          { week: "Wk 6", forecastDemand: 52, actualPull: 54, availableInventory: 85, confirmedInbound: 28, safetyStock: 112 },
          { week: "Wk 7", forecastDemand: 53, actualPull: 55, availableInventory: 61, confirmedInbound: 24, safetyStock: 112 },
          { week: "Wk 8", forecastDemand: 50, actualPull: 51, availableInventory: 35, confirmedInbound: 0, safetyStock: 112 },
          { week: "Wk 9", forecastDemand: 49, actualPull: 48, availableInventory: -14, confirmedInbound: 0, safetyStock: 112 },
          { week: "Wk 10", forecastDemand: 48, actualPull: 47, availableInventory: -62, confirmedInbound: 0, safetyStock: 112 },
          { week: "Wk 11", forecastDemand: 47, actualPull: 46, availableInventory: -109, confirmedInbound: 0, safetyStock: 112 },
          { week: "Wk 12", forecastDemand: 47, actualPull: 45, availableInventory: -156, confirmedInbound: 0, safetyStock: 112 },
        ],
      },
      {
        label: "Fish Sticks & Crunchy Fillets",
        points: [
          { week: "Wk 1", forecastDemand: 19, actualPull: 18, availableInventory: 102, confirmedInbound: 0, safetyStock: 44 },
          { week: "Wk 2", forecastDemand: 20, actualPull: 19, availableInventory: 84, confirmedInbound: 0, safetyStock: 44 },
          { week: "Wk 3", forecastDemand: 20, actualPull: 21, availableInventory: 65, confirmedInbound: 0, safetyStock: 44 },
          { week: "Wk 4", forecastDemand: 21, actualPull: 20, availableInventory: 44, confirmedInbound: 0, safetyStock: 44 },
          { week: "Wk 5", forecastDemand: 21, actualPull: 21, availableInventory: 24, confirmedInbound: 0, safetyStock: 44 },
          { week: "Wk 6", forecastDemand: 22, actualPull: 22, availableInventory: 26, confirmedInbound: 24, safetyStock: 44 },
          { week: "Wk 7", forecastDemand: 22, actualPull: 22, availableInventory: 28, confirmedInbound: 0, safetyStock: 44 },
          { week: "Wk 8", forecastDemand: 21, actualPull: 21, availableInventory: 31, confirmedInbound: 0, safetyStock: 44 },
          { week: "Wk 9", forecastDemand: 21, actualPull: 20, availableInventory: 34, confirmedInbound: 0, safetyStock: 44 },
          { week: "Wk 10", forecastDemand: 20, actualPull: 20, availableInventory: 38, confirmedInbound: 0, safetyStock: 44 },
          { week: "Wk 11", forecastDemand: 20, actualPull: 19, availableInventory: 43, confirmedInbound: 0, safetyStock: 44 },
          { week: "Wk 12", forecastDemand: 19, actualPull: 19, availableInventory: 48, confirmedInbound: 24, safetyStock: 44 },
        ],
      },
      {
        label: "Beer Battered Cod Fillets",
        points: [
          { week: "Wk 1", forecastDemand: 14, actualPull: 15, availableInventory: 28, confirmedInbound: 0, safetyStock: 36 },
          { week: "Wk 2", forecastDemand: 15, actualPull: 16, availableInventory: 12, confirmedInbound: 24, safetyStock: 36 },
          { week: "Wk 3", forecastDemand: 16, actualPull: 17, availableInventory: 19, confirmedInbound: 0, safetyStock: 36 },
          { week: "Wk 4", forecastDemand: 17, actualPull: 17, availableInventory: 2, confirmedInbound: 0, safetyStock: 36 },
          { week: "Wk 5", forecastDemand: 17, actualPull: 18, availableInventory: -16, confirmedInbound: 0, safetyStock: 36 },
          { week: "Wk 6", forecastDemand: 18, actualPull: 19, availableInventory: -7, confirmedInbound: 28, safetyStock: 36 },
          { week: "Wk 7", forecastDemand: 18, actualPull: 19, availableInventory: -26, confirmedInbound: 0, safetyStock: 36 },
          { week: "Wk 8", forecastDemand: 17, actualPull: 18, availableInventory: -44, confirmedInbound: 24, safetyStock: 36 },
          { week: "Wk 9", forecastDemand: 17, actualPull: 17, availableInventory: -61, confirmedInbound: 0, safetyStock: 36 },
          { week: "Wk 10", forecastDemand: 16, actualPull: 16, availableInventory: -77, confirmedInbound: 0, safetyStock: 36 },
          { week: "Wk 11", forecastDemand: 16, actualPull: 16, availableInventory: -93, confirmedInbound: 0, safetyStock: 36 },
          { week: "Wk 12", forecastDemand: 16, actualPull: 15, availableInventory: -108, confirmedInbound: 0, safetyStock: 36 },
        ],
      },
      {
        label: "Breaded Shrimp",
        points: [
          { week: "Wk 1", forecastDemand: 11, actualPull: 9, availableInventory: 138, confirmedInbound: 0, safetyStock: 32 },
          { week: "Wk 2", forecastDemand: 12, actualPull: 11, availableInventory: 127, confirmedInbound: 0, safetyStock: 32 },
          { week: "Wk 3", forecastDemand: 12, actualPull: 11, availableInventory: 116, confirmedInbound: 0, safetyStock: 32 },
          { week: "Wk 4", forecastDemand: 11, actualPull: 10, availableInventory: 106, confirmedInbound: 36, safetyStock: 32 },
          { week: "Wk 5", forecastDemand: 12, actualPull: 11, availableInventory: 131, confirmedInbound: 0, safetyStock: 32 },
          { week: "Wk 6", forecastDemand: 12, actualPull: 11, availableInventory: 120, confirmedInbound: 0, safetyStock: 32 },
          { week: "Wk 7", forecastDemand: 13, actualPull: 12, availableInventory: 108, confirmedInbound: 0, safetyStock: 32 },
          { week: "Wk 8", forecastDemand: 12, actualPull: 11, availableInventory: 97, confirmedInbound: 0, safetyStock: 32 },
          { week: "Wk 9", forecastDemand: 11, actualPull: 11, availableInventory: 86, confirmedInbound: 0, safetyStock: 32 },
          { week: "Wk 10", forecastDemand: 12, actualPull: 11, availableInventory: 75, confirmedInbound: 0, safetyStock: 32 },
          { week: "Wk 11", forecastDemand: 11, actualPull: 11, availableInventory: 64, confirmedInbound: 0, safetyStock: 32 },
          { week: "Wk 12", forecastDemand: 12, actualPull: 11, availableInventory: 53, confirmedInbound: 0, safetyStock: 32 },
        ],
      },
    ],
    inventoryCoverageRows: [
      {
        id: "fish-sticks-allentown-sw",
        sku: "Fish Sticks & Crunchy Fillets",
        description: "Aldi private label fish sticks 24 oz",
        warehouse: "Allentown",
        customerLocation: "South Windsor DC",
        onHand: 68000,
        allocated: 12000,
        available: 56000,
        avg4WeekPull: 11800,
        avg8WeekPull: 11200,
        forecastNext4Weeks: 46000,
        weeksOfCover: 4.7,
        safetyStock: 3.2,
        agingDays: 42,
        riskStatus: "Healthy",
      },
      {
        id: "fish-sticks-dallas-hou",
        sku: "Fish Sticks & Crunchy Fillets",
        description: "Aldi private label fish sticks 24 oz",
        warehouse: "Dallas",
        customerLocation: "Houston DC",
        onHand: 34000,
        allocated: 8000,
        available: 26000,
        avg4WeekPull: 7200,
        avg8WeekPull: 6900,
        forecastNext4Weeks: 28000,
        weeksOfCover: 3.6,
        safetyStock: 2.8,
        agingDays: 38,
        riskStatus: "Healthy",
      },
      {
        id: "cod-allentown-man",
        sku: "Beer Battered Cod Fillets",
        description: "Beer battered cod fillets 20 oz",
        warehouse: "Allentown",
        customerLocation: "Manassas DC",
        onHand: 18000,
        allocated: 7000,
        available: 11000,
        avg4WeekPull: 6100,
        avg8WeekPull: 5600,
        forecastNext4Weeks: 25000,
        weeksOfCover: 1.8,
        safetyStock: 3.0,
        agingDays: 51,
        riskStatus: "At Risk",
      },
      {
        id: "cod-losangeles-sw",
        sku: "Beer Battered Cod Fillets",
        description: "Beer battered cod fillets 20 oz",
        warehouse: "Los Angeles",
        customerLocation: "South Windsor DC",
        onHand: 15000,
        allocated: 5000,
        available: 10000,
        avg4WeekPull: 4200,
        avg8WeekPull: 3900,
        forecastNext4Weeks: 17000,
        weeksOfCover: 2.4,
        safetyStock: 3.0,
        agingDays: 46,
        riskStatus: "At Risk",
      },
      {
        id: "shrimp-losangeles-man",
        sku: "Breaded Shrimp",
        description: "Breaded shrimp family pack 18 oz",
        warehouse: "Los Angeles",
        customerLocation: "Manassas DC",
        onHand: 62000,
        allocated: 9000,
        available: 53000,
        avg4WeekPull: 5200,
        avg8WeekPull: 5000,
        forecastNext4Weeks: 21000,
        weeksOfCover: 10.2,
        safetyStock: 3.5,
        agingDays: 119,
        riskStatus: "Overstocked",
      },
      {
        id: "shrimp-dallas-hou",
        sku: "Breaded Shrimp",
        description: "Breaded shrimp family pack 18 oz",
        warehouse: "Dallas",
        customerLocation: "Houston DC",
        onHand: 71000,
        allocated: 11000,
        available: 60000,
        avg4WeekPull: 6400,
        avg8WeekPull: 6200,
        forecastNext4Weeks: 27000,
        weeksOfCover: 9.4,
        safetyStock: 3.5,
        agingDays: 134,
        riskStatus: "Overstocked",
      },
    ],
    inboundSupplyRows: [
      {
        id: "inbound-cod-vn-001",
        supplier: "Pacific Seafood Exports",
        originCountry: "Vietnam",
        supplierPo: "PSE-ALDI-20418",
        containerNo: "OOLU-4419201",
        sku: "Beer Battered Cod Fillets",
        qty: 24000,
        stage: "On Water",
        eta: "Apr 30, 2026",
        delayVsLeadTime: "+5 days",
        destinationWarehouse: "Allentown",
        risk: "High",
      },
      {
        id: "inbound-cod-cn-002",
        supplier: "Qingdao Ocean Foods",
        originCountry: "China",
        supplierPo: "QOF-ALDI-8821",
        containerNo: "MAEU-7832940",
        sku: "Beer Battered Cod Fillets",
        qty: 28000,
        stage: "Booked",
        eta: "May 11, 2026",
        delayVsLeadTime: "+2 days",
        destinationWarehouse: "Los Angeles",
        risk: "Medium",
      },
      {
        id: "inbound-shrimp-in-003",
        supplier: "Blue Harbor Seafoods",
        originCountry: "India",
        supplierPo: "BHS-ALDI-1192",
        containerNo: "TRHU-9120044",
        sku: "Breaded Shrimp",
        qty: 36000,
        stage: "Packed",
        eta: "May 18, 2026",
        delayVsLeadTime: "-1 day",
        destinationWarehouse: "Dallas",
        risk: "Low",
      },
      {
        id: "inbound-fish-vn-004",
        supplier: "Pacific Seafood Exports",
        originCountry: "Vietnam",
        supplierPo: "PSE-ALDI-20452",
        containerNo: "WHLU-9820031",
        sku: "Fish Sticks & Crunchy Fillets",
        qty: 24000,
        stage: "In Production",
        eta: "May 25, 2026",
        delayVsLeadTime: "On time",
        destinationWarehouse: "Allentown",
        risk: "Low",
      },
    ],
    demandSignalRows: [
      { id: "weekly-sw-1", location: "South Windsor DC", bucket: "Apr 21", forecast: 14000, actual: 13800, variancePct: -1.4, promotion: "None", risk: "Low", granularity: "weekly" },
      { id: "weekly-man-1", location: "Manassas DC", bucket: "Apr 21", forecast: 10200, actual: 11700, variancePct: 14.7, promotion: "Frozen seafood ad", manualOverride: "+8% lift", risk: "High", granularity: "weekly" },
      { id: "weekly-hou-1", location: "Houston DC", bucket: "Apr 21", forecast: 9800, actual: 9400, variancePct: -4.1, promotion: "None", risk: "Low", granularity: "weekly" },
      { id: "weekly-sw-2", location: "South Windsor DC", bucket: "Apr 28", forecast: 14200, actual: 14500, variancePct: 2.1, promotion: "Lent tail", risk: "Medium", granularity: "weekly" },
      { id: "weekly-man-2", location: "Manassas DC", bucket: "Apr 28", forecast: 10500, actual: 11900, variancePct: 13.3, promotion: "Frozen seafood ad", manualOverride: "Manual demand uplift", risk: "High", granularity: "weekly" },
      { id: "weekly-hou-2", location: "Houston DC", bucket: "Apr 28", forecast: 9900, actual: 9500, variancePct: -4.0, promotion: "None", risk: "Low", granularity: "weekly" },
      { id: "monthly-apr-sw", location: "South Windsor DC", bucket: "Apr 2026", forecast: 56000, actual: 57300, variancePct: 2.3, promotion: "Seasonal feature", risk: "Medium", granularity: "monthly" },
      { id: "monthly-apr-man", location: "Manassas DC", bucket: "Apr 2026", forecast: 40800, actual: 46800, variancePct: 14.7, promotion: "Frozen seafood ad", manualOverride: "Promo override active", risk: "High", granularity: "monthly" },
      { id: "monthly-apr-hou", location: "Houston DC", bucket: "Apr 2026", forecast: 39200, actual: 38000, variancePct: -3.1, promotion: "None", risk: "Low", granularity: "monthly" },
    ],
    exceptions: [
      {
        id: "exception-stockout-cod",
        severity: "Critical",
        issue: "Stockout risk before next ETA",
        impactedSku: "Beer Battered Cod Fillets",
        impactedLocation: "Manassas DC / Allentown",
        reason: "Current pull is running 13% above forecast and the Vietnam container is 5 days late.",
        recommendedAction: "Pull 12,000 lbs from Los Angeles reserve and escalate alternate cod allocation.",
        inventoryRowIds: ["cod-allentown-man", "cod-losangeles-sw"],
        inboundRowIds: ["inbound-cod-vn-001", "inbound-cod-cn-002"],
        demandSignalIds: ["weekly-man-1", "weekly-man-2", "monthly-apr-man"],
      },
      {
        id: "exception-safety-stock",
        severity: "High",
        issue: "Safety stock breach in week 6",
        impactedSku: "Beer Battered Cod Fillets",
        impactedLocation: "South Windsor / Manassas",
        reason: "Projected cover falls to 1.8 weeks against a 3.0 week floor.",
        recommendedAction: "Advance the Qingdao shipment booking and temporarily reduce promo allocation.",
        inventoryRowIds: ["cod-allentown-man", "cod-losangeles-sw"],
        inboundRowIds: ["inbound-cod-cn-002"],
        demandSignalIds: ["weekly-man-1", "weekly-man-2"],
      },
      {
        id: "exception-overstock-shrimp",
        severity: "Medium",
        issue: "Overstock and aging inventory",
        impactedSku: "Breaded Shrimp",
        impactedLocation: "Houston / Manassas",
        reason: "Weeks of cover exceeds 9 weeks and aging lots are crossing 120 days.",
        recommendedAction: "Shift 8 pallets into June promotion and pause next shrimp inbound if actual pull stays flat.",
        inventoryRowIds: ["shrimp-losangeles-man", "shrimp-dallas-hou"],
        inboundRowIds: ["inbound-shrimp-in-003"],
        demandSignalIds: ["weekly-hou-1", "weekly-hou-2"],
      },
      {
        id: "exception-demand-variance",
        severity: "Medium",
        issue: "Pull rate materially above forecast",
        impactedSku: "Beer Battered Cod Fillets",
        impactedLocation: "Manassas DC",
        reason: "Promo-driven lift is sustaining at +14% for two consecutive weeks.",
        recommendedAction: "Lock a +10% forecast override for the next 4 weeks and rebalance from Allentown.",
        inventoryRowIds: ["cod-allentown-man"],
        inboundRowIds: [],
        demandSignalIds: ["weekly-man-1", "weekly-man-2", "monthly-apr-man"],
      },
    ],
    financeLens: [
      { label: "On Hand Inventory Value", value: "$1.86M", detail: "Weighted landed cost across program stock" },
      { label: "Landed Cost View", value: "$6.94 / lb", detail: "Average including freight and duties" },
      { label: "Carrying / Storage Exposure", value: "$62.4K / month", detail: "Current warehouse and cold storage run rate" },
      { label: "Inventory Turnover", value: "7.2x", detail: "Trailing annualized program turn" },
      { label: "Aging Value", value: "$412K", detail: "Value tied to lots above 90 aging days" },
    ],
    relatedDeliveries: [
      {
        releaseCaseId: "aldi-south-windsor",
        deliveryId: "REL-ALDI-1048",
        customerLocation: "South Windsor DC",
        requestedDate: "Apr 22, 2026",
        quantity: "120 Cartons",
        fulfillmentMode: "Pickup Scheduled",
        status: "Awaiting Warehouse Confirmation",
        nextAction: "Confirm staging at Americold Allentown",
      },
      {
        releaseCaseId: "aldi-manassas",
        deliveryId: "REL-ALDI-1051",
        customerLocation: "Manassas DC",
        requestedDate: "Apr 24, 2026",
        quantity: "95 Cartons",
        fulfillmentMode: "Carrier Delivery",
        status: "Awaiting Carrier Readiness",
        nextAction: "Lock carrier dispatch after cod reallocation",
      },
      {
        releaseCaseId: "aldi-houston",
        deliveryId: "REL-ALDI-1056",
        customerLocation: "Houston DC",
        requestedDate: "Apr 26, 2026",
        quantity: "88 Cartons",
        fulfillmentMode: "Carrier Delivery",
        status: "Ready for Release",
        nextAction: "Generate final carrier release for shrimp allocation",
      },
    ],
    demandPace: {
      weeklyContract: 51000,
      monthlyContract: 204000,
    },
  },
  "kroger-coastal-shrimp-vmi": {
    id: "kroger-coastal-shrimp-vmi",
    summary: vmiPrograms[1],
    state: "loading",
    customer: "Kroger",
    contractPeriod: "Feb 2026 to Jan 2027",
    salesOwner: "Caleb D.",
    planner: "Marta J.",
    buyer: "Marta J.",
    programStatus: "At Risk",
    kpis: [],
    coverageProjection: [],
    inventoryCoverageRows: [],
    inboundSupplyRows: [],
    demandSignalRows: [],
    exceptions: [],
    financeLens: [],
    relatedDeliveries: [],
    demandPace: {
      weeklyContract: 42000,
      monthlyContract: 168000,
    },
  },
  "walmart-west-coast-shrimp-vmi": {
    id: "walmart-west-coast-shrimp-vmi",
    summary: vmiPrograms[2],
    state: "error",
    customer: "Walmart",
    contractPeriod: "Jan 2026 to Dec 2026",
    salesOwner: "Maya T.",
    planner: "Devon K.",
    buyer: "Devon K.",
    programStatus: "Overstocked",
    kpis: [],
    coverageProjection: [],
    inventoryCoverageRows: [],
    inboundSupplyRows: [],
    demandSignalRows: [],
    exceptions: [],
    financeLens: [],
    relatedDeliveries: [],
    demandPace: {
      weeklyContract: 46000,
      monthlyContract: 184000,
    },
    errorMessage: "Program control tower feed is temporarily unavailable. Retry after the nightly replenishment sync.",
  },
};
