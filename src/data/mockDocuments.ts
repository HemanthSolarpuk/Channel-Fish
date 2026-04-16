export interface Document {
  id: string;
  received: string;
  sender: string;
  vendor: string;
  vendorCode: string;
  documentName: string;
  type: "PO" | "SO" | "INVOICE" | "QUOTE";
  orderNumber: string;
  amount: string;
  currency: string;
  confidence: number;
  status: "Needs Review" | "Verified" | "Sent to ERP" | "ERP Failed";
}

export const mockDocuments: Document[] = [
  {
    id: "1",
    received: "Jan 15, 01:23 AM",
    sender: "orders@seafoodexports.com",
    vendor: "Pacific Seafood Exports",
    vendorCode: "PSE-001",
    documentName: "PO-2024-00156.pdf",
    type: "PO",
    orderNumber: "PO-2024-00156",
    amount: "$45,750.00",
    currency: "USD",
    confidence: 94,
    status: "Needs Review",
  },
  {
    id: "2",
    received: "Jan 15, 12:45 AM",
    sender: "procurement@oceanblue.co.uk",
    vendor: "Ocean Blue Fisheries",
    vendorCode: "OBF-002",
    documentName: "SO-OBF-2401-089.pdf",
    type: "SO",
    orderNumber: "SO-OBF-2401-089",
    amount: "£28,340.00",
    currency: "GBP",
    confidence: 97,
    status: "Verified",
  },
  {
    id: "3",
    received: "Jan 14, 11:12 PM",
    sender: "sales@thaishrimco.th",
    vendor: "Thai Shrimp Co.",
    vendorCode: "TSC-003",
    documentName: "Invoice_INV20240115-001.pdf",
    type: "INVOICE",
    orderNumber: "INV-2024-0115-001",
    amount: "$156,780.00",
    currency: "USD",
    confidence: 72,
    status: "Needs Review",
  },
  {
    id: "4",
    received: "Jan 14, 08:30 AM",
    sender: "orders@nordicfish.no",
    vendor: "Nordic Fish AS",
    vendorCode: "NFA-004",
    documentName: "PurchaseOrder_NF24-0892.pdf",
    type: "PO",
    orderNumber: "NF24-0892",
    amount: "€89,500.00",
    currency: "EUR",
    confidence: 91,
    status: "Sent to ERP",
  },
  {
    id: "5",
    received: "Jan 14, 06:15 AM",
    sender: "export@vietseafood.vn",
    vendor: "Vietnam Seafood Corp",
    vendorCode: "VSC-005",
    documentName: "SO_VSC_2024_00445.pdf",
    type: "SO",
    orderNumber: "VSC-2024-00445",
    amount: "$67,890.00",
    currency: "USD",
    confidence: 88,
    status: "ERP Failed",
  },
  {
    id: "6",
    received: "Jan 14, 03:00 AM",
    sender: "orders@ecuadorshrimp.ec",
    vendor: "Ecuador Shrimp Exports",
    vendorCode: "ESE-006",
    documentName: "Proforma_ESE_2024-112.pdf",
    type: "QUOTE",
    orderNumber: "PRO-ESE-2024-112",
    amount: "$234,500.00",
    currency: "USD",
    confidence: 95,
    status: "Verified",
  },
  {
    id: "7",
    received: "Jan 13, 09:00 PM",
    sender: "sales@indiaseafood.in",
    vendor: "India Seafood Traders",
    vendorCode: "ISE-007",
    documentName: "PO_ISE_2024_00334.pdf",
    type: "PO",
    orderNumber: "ISE-2024-00334",
    amount: "$112,300.00",
    currency: "USD",
    confidence: 89,
    status: "Needs Review",
  },
];
