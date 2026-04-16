## "Release to POD to Invoice" Workflow Board

### Overview

A new horizontally-scrollable Kanban board at `/workflow` with 8 workflow columns, two preloaded example orders, and a right-side chat panel. Each column has a compact card separating PO source data from derived ERP/WMS/QA data.

### New files

`**src/data/workflowData.ts**` — Types and two preloaded orders:

- **ALDI order** uses PO-2024-00156 source data (Pacific Seafood Exports, $45,750, USD). Fulfillment mode: Pickup Scheduled. Column 5A active, 5B greyed.
- **McLane order** uses NF24-0892 source data (Nordic Fish AS, €89,500, EUR). Fulfillment mode: Carrier Delivery. Column 5B active, 5A greyed.

Each order has 8 column states with: `sourceFields` (from PO — vendor, amount, order number, sender, document name), `derivedFields` (mock ERP/WMS — warehouse, lot, carrier, BOL, QA status, invoice number), `status` badge, and `nextAction` string.

`**src/pages/WorkflowBoard.tsx**` — Main page layout:

- Top bar: title "Release to POD to Invoice" + order selector tabs (ALDI / McLane)
- Center: horizontal scrolling board with 8 columns
- Right: fixed 320px "Ubik Workflow Chat" panel

`**src/components/workflow/WorkflowColumn.tsx**` — Column with header label + single compact card

`**src/components/workflow/WorkflowCard.tsx**` — Card with:

- Status badge (color-coded: pending/in-progress/complete/exception)
- "Source (PO)" section with key-value fields in muted style
- "Derived (ERP/WMS)" section with key-value fields
- Next action button/label at bottom
- Column 5A/5B cards show dimmed state when not applicable to selected order's fulfillment mode

`**src/components/workflow/WorkflowChat.tsx**` — Right panel with mock chat messages contextual to the selected order, input field at bottom

`**src/components/workflow/OrderSelector.tsx**` — Tab toggle between the two example orders

### Modified files

`**src/App.tsx**` — Add route `/workflow` → `WorkflowBoard`

`**src/components/AppSidebar.tsx**` — Add "Workflow" nav item between Queue and Settings

### Design

- Change to clean white with color tokens from existing app- 
- Cards: `bg-card` with subtle border, compact padding (p-3)
- Source fields labeled with a small "PO" tag, derived fields with "ERP"/"WMS"/"QA" tags
- Status badges reuse existing status colors (green=complete, amber=in-progress, red=exception, gray=pending)
- Horizontal scroll with snap for the 8 columns
- Responsive: columns min-width ~180px, chat panel collapsible on small screens