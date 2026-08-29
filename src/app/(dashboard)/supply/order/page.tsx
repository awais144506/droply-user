"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Truck,
  PackageCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  Trash2,
  Printer,
  Calendar,
  Layers,
  ArrowDownRight,
  DollarSign,
  Package,
} from "lucide-react";

// --- TYPES ---
export type PurchaseOrderStatus =
  | "DRAFT"
  | "ORDERED"
  | "IN_TRANSIT"
  | "RECEIVED"
  | "CANCELLED";

export interface PurchaseOrderItem {
  id: string;
  itemName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
  orderDate: string;
  expectedDeliveryDate: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  shippingCharges: number;
  totalAmount: number;
  status: PurchaseOrderStatus;
  receivedAt?: string;
  paymentStatus: "PAID" | "UNPAID" | "PARTIAL";
  notes?: string;
}

// --- DUMMY DATA (Sahiwal Procurement Runs) ---
const MOCK_SUPPLIERS = [
  { id: "sup-1", name: "Al-Sharq Plastics & Polymers", phone: "+92 323 0010950" },
  { id: "sup-2", name: "SES Group Packaging", phone: "+92 301 1117883" },
  { id: "sup-3", name: "Indus RO Filtration & Chemicals", phone: "+92 300 4545678" },
  { id: "sup-4", name: "Pak Pump Dispenser Importers", phone: "+92 333 8989123" },
];

const MOCK_CATALOG_ITEMS = [
  { sku: "BTL-19L-PC", name: "19L Polycarbonate Bottle (Raw)", unitPrice: 850 },
  { sku: "CAP-55MM-BLU", name: "55mm Smart Non-Spill Caps", unitPrice: 14.5 },
  { sku: "SEAL-HEAT-SHRINK", name: "Heat Shrink Neck Seals", unitPrice: 3.2 },
  { sku: "CHM-ANTI-SCALANT", name: "RO Anti-Scalant Chemical (20L Can)", unitPrice: 4800 },
  { sku: "DSP-MANUAL-PUMP", name: "Manual Hand Water Pump", unitPrice: 320 },
];

const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "po-101",
    poNumber: "PO-2026-0801",
    supplierId: "sup-1",
    supplierName: "Al-Sharq Plastics & Polymers",
    supplierPhone: "+92 323 0010950",
    orderDate: "Aug 26, 2026",
    expectedDeliveryDate: "Aug 30, 2026",
    items: [
      {
        id: "poi-1",
        itemName: "19L Polycarbonate Bottle (Raw)",
        sku: "BTL-19L-PC",
        quantity: 200,
        unitPrice: 850,
        lineTotal: 170000,
      },
    ],
    subtotal: 170000,
    shippingCharges: 4000,
    totalAmount: 174000,
    status: "IN_TRANSIT",
    paymentStatus: "PARTIAL",
    notes: "Direct cargo dispatch from Lahore Sundar Estate",
  },
  {
    id: "po-102",
    poNumber: "PO-2026-0802",
    supplierId: "sup-2",
    supplierName: "SES Group Packaging",
    supplierPhone: "+92 301 1117883",
    orderDate: "Aug 27, 2026",
    expectedDeliveryDate: "Sep 02, 2026",
    items: [
      {
        id: "poi-2",
        itemName: "55mm Smart Non-Spill Caps",
        sku: "CAP-55MM-BLU",
        quantity: 5000,
        unitPrice: 14.5,
        lineTotal: 72500,
      },
      {
        id: "poi-3",
        itemName: "Heat Shrink Neck Seals",
        sku: "SEAL-HEAT-SHRINK",
        quantity: 5000,
        unitPrice: 3.2,
        lineTotal: 16000,
      },
    ],
    subtotal: 88500,
    shippingCharges: 2500,
    totalAmount: 91000,
    status: "ORDERED",
    paymentStatus: "UNPAID",
    notes: "Urgent restocking for morning shifts",
  },
  {
    id: "po-103",
    poNumber: "PO-2026-0798",
    supplierId: "sup-3",
    supplierName: "Indus RO Filtration & Chemicals",
    supplierPhone: "+92 300 4545678",
    orderDate: "Aug 15, 2026",
    expectedDeliveryDate: "Aug 19, 2026",
    items: [
      {
        id: "poi-4",
        itemName: "RO Anti-Scalant Chemical (20L Can)",
        sku: "CHM-ANTI-SCALANT",
        quantity: 4,
        unitPrice: 4800,
        lineTotal: 19200,
      },
    ],
    subtotal: 19200,
    shippingCharges: 1000,
    totalAmount: 20200,
    status: "RECEIVED",
    receivedAt: "Aug 19, 2026, 03:30 PM",
    paymentStatus: "PAID",
    notes: "Delivered to Sahiwal plant store",
  },
];

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(MOCK_SUPPLIERS[0].id);
  const [expectedDate, setExpectedDate] = useState("2026-09-03");
  const [shippingCharges, setShippingCharges] = useState(2500);
  const [poNotes, setPoNotes] = useState("");

  // Line items for builder modal
  const [lineItems, setLineItems] = useState<PurchaseOrderItem[]>([
    {
      id: "line-1",
      itemName: MOCK_CATALOG_ITEMS[0].name,
      sku: MOCK_CATALOG_ITEMS[0].sku,
      quantity: 100,
      unitPrice: MOCK_CATALOG_ITEMS[0].unitPrice,
      lineTotal: 100 * MOCK_CATALOG_ITEMS[0].unitPrice,
    },
  ]);

  // Aggregate Metrics
  const totalProcurementValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingInTransitCount = orders.filter(
    (o) => o.status === "IN_TRANSIT" || o.status === "ORDERED"
  ).length;
  const receivedThisMonthCount = orders.filter((o) => o.status === "RECEIVED").length;
  const unpaidPoVolume = orders
    .filter((o) => o.paymentStatus !== "PAID")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Line item manipulation
  const handleAddLineItem = () => {
    const itemToAdd = MOCK_CATALOG_ITEMS[0];
    setLineItems([
      ...lineItems,
      {
        id: `line-${Date.now()}`,
        itemName: itemToAdd.name,
        sku: itemToAdd.sku,
        quantity: 50,
        unitPrice: itemToAdd.unitPrice,
        lineTotal: 50 * itemToAdd.unitPrice,
      },
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleUpdateItemSelect = (index: number, sku: string) => {
    const selectedCatalog = MOCK_CATALOG_ITEMS.find((item) => item.sku === sku);
    if (!selectedCatalog) return;

    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      itemName: selectedCatalog.name,
      sku: selectedCatalog.sku,
      unitPrice: selectedCatalog.unitPrice,
      lineTotal: updated[index].quantity * selectedCatalog.unitPrice,
    };
    setLineItems(updated);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    const updated = [...lineItems];
    const qty = Math.max(1, quantity);
    updated[index] = {
      ...updated[index],
      quantity: qty,
      lineTotal: qty * updated[index].unitPrice,
    };
    setLineItems(updated);
  };

  const handleUpdatePrice = (index: number, unitPrice: number) => {
    const updated = [...lineItems];
    const price = Math.max(0, unitPrice);
    updated[index] = {
      ...updated[index],
      unitPrice: price,
      lineTotal: updated[index].quantity * price,
    };
    setLineItems(updated);
  };

  const currentSubtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const currentTotal = currentSubtotal + Number(shippingCharges);

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = MOCK_SUPPLIERS.find((s) => s.id === selectedSupplierId);

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: selectedSupplierId,
      supplierName: sup?.name || "Supplier Firm",
      supplierPhone: sup?.phone || "",
      orderDate: "Aug 29, 2026",
      expectedDeliveryDate: expectedDate,
      items: lineItems,
      subtotal: currentSubtotal,
      shippingCharges: Number(shippingCharges),
      totalAmount: currentTotal,
      status: "ORDERED",
      paymentStatus: "UNPAID",
      notes: poNotes,
    };

    setOrders([newPO, ...orders]);
    setIsCreateModalOpen(false);
  };

  // Mark as Received (Stock-in)
  const handleMarkAsReceived = (poId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === poId
          ? {
              ...o,
              status: "RECEIVED",
              receivedAt: "Today, Just now",
            }
          : o
      )
    );
  };

  // Filter Logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.itemName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Purchases</span>
            <span>/</span>
            <span className="text-slate-700">Procurement Orders</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Purchase Orders (PO)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Issue procurement orders to vendors, track shipment delivery schedules, and receive incoming inventory.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Sourcing Volume */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Sourcing Volume
            </span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              Rs {totalProcurementValue.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Across all vendor supply runs</p>
          </div>
        </div>

        {/* In-Transit Deliveries */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Shipments in Transit
            </span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-950 font-mono">
              {pendingInTransitCount}{" "}
              <span className="text-xs text-slate-400 font-sans font-normal">Active Orders</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Awaiting plant gate arrival</p>
          </div>
        </div>

        {/* Received & Stocked */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Completed Stock-Ins
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <PackageCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-700 font-mono">
              {receivedThisMonthCount}{" "}
              <span className="text-xs text-slate-400 font-sans font-normal">Shipments</span>
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Stock automatically synchronized
            </p>
          </div>
        </div>

        {/* Unsettled PO Balance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Unsettled PO Balance
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600 font-mono">
              Rs {unpaidPoVolume.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Payable under credit terms</p>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search PO #, supplier name, or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600 self-start md:self-auto">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs font-semibold" : ""
              }`}
            >
              All POs
            </button>
            <button
              onClick={() => setStatusFilter("IN_TRANSIT")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "IN_TRANSIT" ? "bg-white text-indigo-700 shadow-2xs font-semibold" : ""
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setStatusFilter("ORDERED")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "ORDERED" ? "bg-white text-sky-700 shadow-2xs font-semibold" : ""
              }`}
            >
              Ordered
            </button>
            <button
              onClick={() => setStatusFilter("RECEIVED")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "RECEIVED" ? "bg-white text-emerald-700 shadow-2xs font-semibold" : ""
              }`}
            >
              Received
            </button>
          </div>
        </div>

        {/* PO Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">PO # & Order Date</th>
                <th className="py-3 px-4">Supplier Firm</th>
                <th className="py-3 px-4">Ordered Items</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* PO # & Date */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{po.poNumber}</span>
                      <span className="text-[10px] text-slate-400">{po.orderDate}</span>
                    </td>

                    {/* Supplier */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{po.supplierName}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{po.supplierPhone}</div>
                    </td>

                    {/* Items Preview */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {po.items.map((item, idx) => (
                          <div key={idx} className="text-slate-700 text-[11px]">
                            <strong className="font-mono text-slate-900">{item.quantity.toLocaleString()}x</strong> {item.itemName}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      Rs {po.totalAmount.toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center">
                      {po.status === "RECEIVED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Received</span>
                        </span>
                      ) : po.status === "IN_TRANSIT" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <Truck className="h-3 w-3" />
                          <span>In Transit</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          <Clock className="h-3 w-3" />
                          <span>Ordered</span>
                        </span>
                      )}
                    </td>

                    {/* Payment Status */}
                    <td className="py-3 px-4 text-center font-semibold text-[10px]">
                      {po.paymentStatus === "PAID" ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Paid
                        </span>
                      ) : po.paymentStatus === "PARTIAL" ? (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Partial
                        </span>
                      ) : (
                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          Unpaid
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {po.status !== "RECEIVED" && (
                          <button
                            onClick={() => handleMarkAsReceived(po.id)}
                            className="h-7 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold inline-flex items-center gap-1 transition-colors shadow-2xs"
                            title="Receive Shipment & Stock In"
                          >
                            <PackageCheck className="h-3 w-3" />
                            <span>Receive</span>
                          </button>
                        )}

                        <button
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Print PO Sheet"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No purchase orders match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: CREATE PURCHASE ORDER */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Issue Purchase Order (PO)</h2>
                  <p className="text-[11px] text-slate-400">Order inventory materials from verified vendors</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4">
              {/* Supplier & Delivery Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Select Vendor *</label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white focus:ring-2 focus:ring-sky-500/20"
                  >
                    {MOCK_SUPPLIERS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              {/* Order Items Builder */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Order Items
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-2xs"
                    >
                      {/* Item Selector */}
                      <div className="col-span-5">
                        <select
                          value={item.sku}
                          onChange={(e) => handleUpdateItemSelect(index, e.target.value)}
                          className="w-full h-8 rounded-lg border border-slate-300 px-2 text-xs bg-white"
                        >
                          {MOCK_CATALOG_ITEMS.map((cat) => (
                            <option key={cat.sku} value={cat.sku}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(index, Number(e.target.value))}
                          placeholder="Qty"
                          className="w-full h-8 rounded-lg border border-slate-300 px-2 text-center text-xs font-mono font-bold bg-white"
                        />
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.1"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdatePrice(index, Number(e.target.value))}
                          placeholder="Cost"
                          className="w-full h-8 rounded-lg border border-slate-300 px-2 text-right text-xs font-mono bg-white"
                        />
                      </div>

                      {/* Line Total */}
                      <div className="col-span-2 text-right font-mono font-bold text-slate-900">
                        Rs {item.lineTotal.toLocaleString()}
                      </div>

                      {/* Remove */}
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Freight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Estimated Freight / Shipping (Rs)</label>
                  <input
                    type="number"
                    value={shippingCharges}
                    onChange={(e) => setShippingCharges(Number(e.target.value))}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Dispatch Instructions / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Deliver to Sahiwal plant gate directly"
                    value={poNotes}
                    onChange={(e) => setPoNotes(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Total Calculation Summary */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal:</span>
                  <span className="font-mono font-semibold">Rs {currentSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping & Delivery:</span>
                  <span className="font-mono font-semibold">Rs {Number(shippingCharges).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200">
                  <span>Total Purchase Order Value:</span>
                  <span className="text-sm font-mono text-sky-700">Rs {currentTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-9 px-4 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Confirm & Send PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}