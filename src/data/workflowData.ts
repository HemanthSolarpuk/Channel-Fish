export type WorkflowStatus = "pending" | "in-progress" | "complete" | "exception";

export interface WorkflowField {
  label: string;
  value: string;
  source: "PO" | "ERP" | "WMS" | "QA" | "OPS" | "TMS";
}

export interface WorkflowColumnData {
  id: string;
  title: string;
  status: WorkflowStatus;
  fields: WorkflowField[];
  nextAction: string;
  dimmed?: boolean;
}

export interface WorkflowOrder {
  id: string;
  label: string;
  fulfillmentMode: "pickup" | "carrier";
  columns: WorkflowColumnData[];
  chatMessages: { role: "system" | "user"; text: string }[];
}

export const workflowOrders: WorkflowOrder[] = [
  {
    id: "aldi",
    label: "ALDI — Pickup Scheduled",
    fulfillmentMode: "pickup",
    columns: [
      {
        id: "1-context",
        title: "1. Existing Order Context",
        status: "complete",
        nextAction: "Proceed to ERP check",
        fields: [
          { label: "Order #", value: "PO-2024-00156", source: "PO" },
          { label: "Vendor", value: "Pacific Seafood Exports", source: "PO" },
          { label: "Amount", value: "$45,750.00", source: "PO" },
          { label: "Currency", value: "USD", source: "PO" },
          { label: "Document", value: "PO-2024-00156.pdf", source: "PO" },
          { label: "Sender", value: "orders@seafoodexports.com", source: "PO" },
          { label: "Sales Order", value: "SO-40012", source: "ERP" },
          { label: "ERP Sync", value: "Synced — Jan 15 01:45 AM", source: "ERP" },
        ],
      },
      {
        id: "2-fulfillment",
        title: "2. Fulfillment Mode",
        status: "complete",
        nextAction: "Confirm pickup details",
        fields: [
          { label: "Mode", value: "Pickup Scheduled", source: "OPS" },
          { label: "Customer Type", value: "ALDI — Retail DC", source: "PO" },
          { label: "Pickup Window", value: "Jan 18, 6:00–10:00 AM", source: "OPS" },
          { label: "Dock Assignment", value: "Dock 4B", source: "WMS" },
        ],
      },
      {
        id: "3-erp-check",
        title: "2. ERP + Warehouse Check",
        status: "complete",
        nextAction: "Release for staging",
        fields: [
          { label: "Warehouse", value: "WH-Miami-01", source: "WMS" },
          { label: "Lot #", value: "LOT-PSE-24-0887", source: "WMS" },
          { label: "Inventory", value: "Available — 48,000 lbs", source: "WMS" },
          { label: "QA Hold", value: "None", source: "QA" },
          { label: "Credit Check", value: "Passed", source: "ERP" },
          { label: "Allocation", value: "Reserved", source: "ERP" },
        ],
      },
      {
        id: "4-decision",
        title: "3. Decision + Exceptions",
        status: "complete",
        nextAction: "Approve release",
        fields: [
          { label: "Decision", value: "Approved for Release", source: "OPS" },
          { label: "Exceptions", value: "None", source: "OPS" },
          { label: "Approver", value: "Rini S. — Operations", source: "OPS" },
          { label: "Approved At", value: "Jan 16, 9:15 AM", source: "OPS" },
        ],
      },
      {
        id: "5a-pickup",
        title: "4. Pickup Scheduled",
        status: "in-progress",
        nextAction: "Confirm carrier arrival",
        dimmed: false,
        fields: [
          { label: "Pickup Date", value: "Jan 18, 2025", source: "OPS" },
          { label: "Pickup Window", value: "6:00–10:00 AM", source: "OPS" },
          { label: "Carrier", value: "ALDI Fleet — Unit #A-2291", source: "OPS" },
          { label: "Staging", value: "Staged at Dock 4B", source: "WMS" },
          { label: "Pallets", value: "12 pallets / 48,000 lbs", source: "WMS" },
          { label: "Temp Check", value: "32°F — Compliant", source: "QA" },
        ],
      },
      {
        id: "5b-carrier",
        title: "4. Carrier Delivery",
        status: "pending",
        nextAction: "N/A — Pickup order",
        dimmed: true,
        fields: [
          { label: "Status", value: "Not applicable", source: "OPS" },
        ],
      },
      {
        id: "6-execution",
        title: "5. Execution",
        status: "pending",
        nextAction: "Begin loading",
        fields: [
          { label: "Loading Status", value: "Awaiting carrier arrival", source: "WMS" },
          { label: "Seal #", value: "Pending", source: "WMS" },
          { label: "Bill of Lading", value: "Pending generation", source: "TMS" },
          { label: "Gate Out", value: "—", source: "WMS" },
        ],
      },
      {
        id: "7-pod",
        title: "6. POD / Confirmation",
        status: "pending",
        nextAction: "Awaiting delivery",
        fields: [
          { label: "POD Status", value: "Pending", source: "TMS" },
          { label: "Signature", value: "—", source: "TMS" },
          { label: "Delivery Time", value: "—", source: "TMS" },
        ],
      },
      {
        id: "8-invoice",
        title: "7. ERP Update + Invoice",
        status: "pending",
        nextAction: "Generate invoice after POD",
        fields: [
          { label: "Invoice #", value: "Pending", source: "ERP" },
          { label: "Amount", value: "$45,750.00", source: "PO" },
          { label: "ERP Post", value: "Awaiting POD", source: "ERP" },
          { label: "Audit Trail", value: "5 events logged", source: "ERP" },
        ],
      },
    ],
    chatMessages: [
      { role: "system", text: "Order PO-2024-00156 synced to ERP as SO-40012. Inventory reserved at WH-Miami-01." },
      { role: "system", text: "ALDI pickup scheduled for Jan 18, 6:00–10:00 AM at Dock 4B. Staging in progress." },
      { role: "user", text: "Confirm temp check is compliant before loading." },
      { role: "system", text: "QA temp check passed: 32°F — within spec. Ready for loading." },
    ],
  },
  {
    id: "mclane",
    label: "McLane — Carrier Delivery",
    fulfillmentMode: "carrier",
    columns: [
      {
        id: "1-context",
        title: "1. Existing Order Context",
        status: "complete",
        nextAction: "Proceed to ERP check",
        fields: [
          { label: "Order #", value: "NF24-0892", source: "PO" },
          { label: "Vendor", value: "Nordic Fish AS", source: "PO" },
          { label: "Amount", value: "€89,500.00", source: "PO" },
          { label: "Currency", value: "EUR", source: "PO" },
          { label: "Document", value: "PurchaseOrder_NF24-0892.pdf", source: "PO" },
          { label: "Sender", value: "orders@nordicfish.no", source: "PO" },
          { label: "Sales Order", value: "SO-40078", source: "ERP" },
          { label: "ERP Sync", value: "Synced — Jan 14 09:00 AM", source: "ERP" },
        ],
      },
      {
        id: "2-fulfillment",
        title: "2. Fulfillment Mode",
        status: "complete",
        nextAction: "Assign carrier",
        fields: [
          { label: "Mode", value: "Carrier Delivery — Collect Freight", source: "OPS" },
          { label: "Customer Type", value: "McLane — Distribution", source: "PO" },
          { label: "Delivery Window", value: "Jan 20–21, 2025", source: "OPS" },
          { label: "Destination", value: "McLane DC, Temple TX", source: "OPS" },
        ],
      },
      {
        id: "3-erp-check",
        title: "2. ERP + Warehouse Check",
        status: "complete",
        nextAction: "Confirm allocation",
        fields: [
          { label: "Warehouse", value: "WH-Houston-03", source: "WMS" },
          { label: "Lot #", value: "LOT-NFA-24-1204", source: "WMS" },
          { label: "Inventory", value: "Available — 62,000 lbs", source: "WMS" },
          { label: "QA Hold", value: "None", source: "QA" },
          { label: "Credit Check", value: "Passed", source: "ERP" },
          { label: "Allocation", value: "Reserved", source: "ERP" },
        ],
      },
      {
        id: "4-decision",
        title: "3. Decision + Exceptions",
        status: "in-progress",
        nextAction: "Review carrier rate",
        fields: [
          { label: "Decision", value: "Pending — Rate Confirmation", source: "OPS" },
          { label: "Exception", value: "Carrier rate +8% above target", source: "TMS" },
          { label: "Escalation", value: "Flagged to logistics mgr", source: "OPS" },
        ],
      },
      {
        id: "5a-pickup",
        title: "4. Pickup Scheduled",
        status: "pending",
        nextAction: "N/A — Carrier order",
        dimmed: true,
        fields: [
          { label: "Status", value: "Not applicable", source: "OPS" },
        ],
      },
      {
        id: "5b-carrier",
        title: "4. Carrier Delivery",
        status: "in-progress",
        nextAction: "Confirm carrier dispatch",
        dimmed: false,
        fields: [
          { label: "Carrier", value: "XPO Logistics", source: "TMS" },
          { label: "PRO #", value: "XPO-928374651", source: "TMS" },
          { label: "Rate", value: "$3,200 — Collect Freight", source: "TMS" },
          { label: "Pickup ETA", value: "Jan 19, 2:00 PM", source: "TMS" },
          { label: "Delivery ETA", value: "Jan 20–21", source: "TMS" },
          { label: "BOL", value: "BOL-2024-NF-0892", source: "TMS" },
        ],
      },
      {
        id: "6-execution",
        title: "5. Execution",
        status: "pending",
        nextAction: "Schedule dock for loading",
        fields: [
          { label: "Loading Status", value: "Awaiting carrier pickup", source: "WMS" },
          { label: "Seal #", value: "Pending", source: "WMS" },
          { label: "Pallets", value: "18 pallets / 62,000 lbs", source: "WMS" },
          { label: "Gate Out", value: "—", source: "WMS" },
        ],
      },
      {
        id: "7-pod",
        title: "6. POD / Confirmation",
        status: "pending",
        nextAction: "Awaiting delivery",
        fields: [
          { label: "POD Status", value: "Pending", source: "TMS" },
          { label: "Signature", value: "—", source: "TMS" },
          { label: "Delivery Time", value: "—", source: "TMS" },
        ],
      },
      {
        id: "8-invoice",
        title: "7. ERP Update + Invoice",
        status: "pending",
        nextAction: "Generate invoice after POD",
        fields: [
          { label: "Invoice #", value: "Pending", source: "ERP" },
          { label: "Amount", value: "€89,500.00", source: "PO" },
          { label: "ERP Post", value: "Awaiting POD", source: "ERP" },
          { label: "Audit Trail", value: "4 events logged", source: "ERP" },
        ],
      },
    ],
    chatMessages: [
      { role: "system", text: "Order NF24-0892 synced to ERP as SO-40078. Inventory reserved at WH-Houston-03." },
      { role: "system", text: "Carrier assigned: XPO Logistics. Rate $3,200 collect freight — 8% above target." },
      { role: "system", text: "⚠ Exception: Carrier rate exceeds target. Escalated to logistics manager for approval." },
      { role: "user", text: "Approve rate if within 10% threshold. Confirm with McLane on delivery window." },
    ],
  },
];
