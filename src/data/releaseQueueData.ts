export type FlowType = "pickup" | "carrier";

export type ReleaseStatus =
  | "Ready for Release"
  | "Awaiting Warehouse Confirmation"
  | "Awaiting Carrier Readiness"
  | "POD Received"
  | "Invoice Generated";

export interface ReleaseCase {
  id: string;
  updated: string;
  customer: string;
  poNumber: string;
  flowType: FlowType;
  shipTo: string;
  requestedDate: string;
  quantity: string;
  status: ReleaseStatus;
  nextAction: string;
  programId?: string;
  // Reference data — used to drive the drawer content
  isAldi?: boolean;
  isMcLane?: boolean;
}

export const releaseCases: ReleaseCase[] = [
  {
    id: "aldi-south-windsor",
    updated: "Apr 02, 09:14 AM",
    customer: "Aldi Inc.",
    poNumber: "7516245499",
    flowType: "pickup",
    shipTo: "South Windsor DC, CT",
    requestedDate: "04/07/2026",
    quantity: "100 Cartons",
    status: "Awaiting Warehouse Confirmation",
    nextAction: "Confirm staging at Americold Allentown",
    programId: "aldi-northeast-frozen-seafood-vmi",
    isAldi: true,
  },
  {
    id: "aldi-manassas",
    updated: "Apr 03, 01:20 PM",
    customer: "Aldi Inc.",
    poNumber: "7516245503",
    flowType: "carrier",
    shipTo: "Manassas DC, VA",
    requestedDate: "04/24/2026",
    quantity: "95 Cartons",
    status: "Awaiting Carrier Readiness",
    nextAction: "Confirm cod fillets transfer into outbound staging",
    programId: "aldi-northeast-frozen-seafood-vmi",
    isAldi: true,
  },
  {
    id: "aldi-houston",
    updated: "Apr 04, 10:05 AM",
    customer: "Aldi Inc.",
    poNumber: "7516245511",
    flowType: "carrier",
    shipTo: "Houston DC, TX",
    requestedDate: "04/26/2026",
    quantity: "88 Cartons",
    status: "Ready for Release",
    nextAction: "Generate final carrier release for shrimp allocation",
    programId: "aldi-northeast-frozen-seafood-vmi",
    isAldi: true,
  },
  {
    id: "mclane",
    updated: "Feb 22, 03:47 PM",
    customer: "McLane Foodservice, Inc.",
    poNumber: "11428530",
    flowType: "carrier",
    shipTo: "Manassas, VA",
    requestedDate: "02/27/2026",
    quantity: "700 CA / 14 Pallets",
    status: "Awaiting Carrier Readiness",
    nextAction: "Confirm dispatch with VANTIX LOGISTICS",
    programId: "mclane-midatlantic-protein-vmi",
    isMcLane: true,
  },
  {
    id: "sysco",
    updated: "Apr 01, 11:30 AM",
    customer: "Sysco Corporation",
    poNumber: "SYS-220184",
    flowType: "carrier",
    shipTo: "Houston DC, TX",
    requestedDate: "04/12/2026",
    quantity: "420 CA / 9 Pallets",
    status: "Ready for Release",
    nextAction: "Generate carrier release",
    programId: "sysco-gulf-seafood-vmi",
  },
  {
    id: "usfoods",
    updated: "Mar 30, 02:10 PM",
    customer: "US Foods",
    poNumber: "USF-7798321",
    flowType: "pickup",
    shipTo: "Tempe DC, AZ",
    requestedDate: "04/05/2026",
    quantity: "60 Cartons",
    status: "Ready for Release",
    nextAction: "Generate pickup release",
  },
  {
    id: "kroger",
    updated: "Mar 29, 08:45 AM",
    customer: "Kroger",
    poNumber: "KR-9981402",
    flowType: "carrier",
    shipTo: "Cincinnati DC, OH",
    requestedDate: "03/30/2026",
    quantity: "320 CA",
    status: "POD Received",
    nextAction: "Generate invoice",
  },
  {
    id: "walmart",
    updated: "Mar 28, 04:20 PM",
    customer: "Walmart",
    poNumber: "WM-3344219",
    flowType: "pickup",
    shipTo: "Bentonville DC, AR",
    requestedDate: "03/29/2026",
    quantity: "180 Cartons",
    status: "Invoice Generated",
    nextAction: "Closed — share with finance",
  },
];
