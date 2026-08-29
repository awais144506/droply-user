"use client";

import { useState } from "react";
import {
  Store,
  Truck,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  X,
  Printer,
} from "lucide-react";

// --- TYPES ---
export type OrderChannel = "WALK_IN" | "DELIVERY";
export type OrderStatus = "COMPLETED" | "DISPATCHED" | "PENDING" | "CANCELLED";

export interface SaleOrder {
  id: string;
  orderNumber: string;
  channel: OrderChannel;
  customerName: string;
  customerPhone?: string;
  address?: string;
  zoneName?: string;
  bottlesFull: number;
  bottlesEmptyReturned: number;
  totalAmount: number;
  cashReceived: number;
  khataAmount: number;
  assignedRider?: string;
  status: OrderStatus;
  createdAt: string;
}

// --- DUMMY DATA ---
const MOCK_ORDERS: SaleOrder[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-9021",
    channel: "WALK_IN",
    customerName: "Counter Walk-in (Farhan)",
    customerPhone: "+92 300 1234567",
    bottlesFull: 2,
    bottlesEmptyReturned: 2,
    totalAmount: 400,
    cashReceived: 400,
    khataAmount: 0,
    status: "COMPLETED",
    createdAt: "Today, 02:45 PM",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-9022",
    channel: "DELIVERY",
    customerName: "Tariq Mahmood",
    customerPhone: "+92 321 4455667",
    address: "House 14, Block Y, Farid Town, Sahiwal",
    zoneName: "Farid Town (Block Y & Z)",
    bottlesFull: 4,
    bottlesEmptyReturned: 4,
    totalAmount: 800,
    cashReceived: 800,
    khataAmount: 0,
    assignedRider: "Majid Ali",
    status: "DISPATCHED",
    createdAt: "Today, 01:15 PM",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-9023",
    channel: "DELIVERY",
    customerName: "Al-Madina Sweets",
    customerPhone: "+92 300 7788990",
    address: "Shop 12-14, Main Bazar, Sahiwal",
    zoneName: "Tariq Bin Ziad Colony",
    bottlesFull: 10,
    bottlesEmptyReturned: 10,
    totalAmount: 2000,
    cashReceived: 1000,
    khataAmount: 1000,
    assignedRider: "Majid Ali",
    status: "PENDING",
    createdAt: "Today, 11:30 AM",
  },
  {
    id: "ord-4",
    orderNumber: "ORD-9020",
    channel: "WALK_IN",
    customerName: "Walk-in Guest (New Customer)",
    customerPhone: "+92 333 9988771",
    bottlesFull: 1,
    bottlesEmptyReturned: 0, // Paid bottle deposit
    totalAmount: 1200, // 200 Refill + 1000 Security
    cashReceived: 1200,
    khataAmount: 0,
    status: "COMPLETED",
    createdAt: "Today, 10:10 AM",
  },
];

export default function SaleOrdersPage() {
  const [orders, setOrders] = useState<SaleOrder[]>(MOCK_ORDERS);
  const [selectedChannelMode, setSelectedChannelMode] = useState<OrderChannel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<"ALL" | OrderChannel>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");

  // Form State for Walk-In Sale
  const [walkInForm, setWalkInForm] = useState({
    customerName: "",
    phone: "",
    bottlesFull: 1,
    bottlesEmpty: 1,
    ratePerBottle: 200,
    newBottleDepositCount: 0,
    depositPerBottle: 1000,
    cashReceived: 200,
  });

  // Form State for Scheduled Delivery
  const [deliveryForm, setDeliveryForm] = useState({
    customerId: "c-101",
    customerName: "Tariq Mahmood",
    address: "House 14, Block Y, Farid Town, Sahiwal",
    zone: "Farid Town (Block Y & Z)",
    bottlesToDeliver: 4,
    expectedEmpty: 4,
    bottleRate: 200,
    assignedRider: "Majid Ali",
    cashToCollect: 800,
    scheduledSlot: "Evening Dispatch (04:00 PM)",
  });

  // Filtered List
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.address && order.address.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (channelFilter !== "ALL" && order.channel !== channelFilter) return false;
    if (statusFilter !== "ALL" && order.status !== statusFilter) return false;

    return true;
  });

  // Calculations for Walk-In Form
  const walkInTotal =
    walkInForm.bottlesFull * walkInForm.ratePerBottle +
    walkInForm.newBottleDepositCount * walkInForm.depositPerBottle;

  const handleCreateWalkInOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: SaleOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      channel: "WALK_IN",
      customerName: walkInForm.customerName || "Walk-in Counter Customer",
      customerPhone: walkInForm.phone,
      bottlesFull: walkInForm.bottlesFull,
      bottlesEmptyReturned: walkInForm.bottlesEmpty,
      totalAmount: walkInTotal,
      cashReceived: Number(walkInForm.cashReceived),
      khataAmount: Math.max(0, walkInTotal - Number(walkInForm.cashReceived)),
      status: "COMPLETED",
      createdAt: "Just now",
    };

    setOrders([newOrder, ...orders]);
    setSelectedChannelMode(null);
  };

  const handleCreateDeliveryOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const total = deliveryForm.bottlesToDeliver * deliveryForm.bottleRate;
    const newOrder: SaleOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      channel: "DELIVERY",
      customerName: deliveryForm.customerName,
      address: deliveryForm.address,
      zoneName: deliveryForm.zone,
      bottlesFull: deliveryForm.bottlesToDeliver,
      bottlesEmptyReturned: deliveryForm.expectedEmpty,
      totalAmount: total,
      cashReceived: Number(deliveryForm.cashToCollect),
      khataAmount: Math.max(0, total - Number(deliveryForm.cashToCollect)),
      assignedRider: deliveryForm.assignedRider,
      status: "PENDING",
      createdAt: "Just now",
    };

    setOrders([newOrder, ...orders]);
    setSelectedChannelMode(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Sales & Dispatch Orders
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Generate instant plant counter bills or schedule route deliveries for Sahiwal sectors.
        </p>
      </div>

      {/* Primary Channel Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Walk-In Plant POS */}
        <div
          onClick={() => setSelectedChannelMode("WALK_IN")}
          className="group relative bg-white p-5 rounded-3xl border-2 border-slate-200/90 hover:border-sky-500 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-105 transition-transform">
              <Store className="h-6 w-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/60">
              <span>Plant Gate POS</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
              Walk-In Customer Sale
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Immediate over-the-counter billing. Collect cash, exchange returned empties, or issue new security bottles on the spot.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Instant Cash & Bottle Exchange</span>
            <span className="text-sky-600 font-bold group-hover:underline">Open Counter Form &rarr;</span>
          </div>
        </div>

        {/* Card 2: Scheduled Route Delivery */}
        <div
          onClick={() => setSelectedChannelMode("DELIVERY")}
          className="group relative bg-white p-5 rounded-3xl border-2 border-slate-200/90 hover:border-indigo-500 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
              <Truck className="h-6 w-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
              <span>Rider Dispatch</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Route Delivery Order
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Schedule delivery for residential or commercial clients. Assign route riders, track live GPS drops, and update customer Khata.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Sector Dispatch & Khata Sync</span>
            <span className="text-indigo-600 font-bold group-hover:underline">Schedule Route &rarr;</span>
          </div>
        </div>
      </div>

      {/* Orders Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search order #, customer name, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Quick Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setChannelFilter("ALL")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  channelFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs font-semibold" : ""
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setChannelFilter("WALK_IN")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  channelFilter === "WALK_IN" ? "bg-white text-sky-700 shadow-2xs font-semibold" : ""
                }`}
              >
                Walk-In Gate
              </button>
              <button
                onClick={() => setChannelFilter("DELIVERY")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  channelFilter === "DELIVERY" ? "bg-white text-indigo-700 shadow-2xs font-semibold" : ""
                }`}
              >
                Route Deliveries
              </button>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="DISPATCHED">Dispatched (On Route)</option>
              <option value="PENDING">Pending Schedule</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Customer & Location</th>
                <th className="py-3 px-4 text-center">Bottles (Full / Empty)</th>
                <th className="py-3 px-4 text-right">Payment</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Order Number & Timestamp */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{order.orderNumber}</span>
                      <span className="text-[10px] text-slate-400">{order.createdAt}</span>
                    </td>

                    {/* Channel */}
                    <td className="py-3 px-4">
                      {order.channel === "WALK_IN" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                          <Store className="h-3 w-3" />
                          <span>Walk-in Gate</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                          <Truck className="h-3 w-3" />
                          <span>Delivery ({order.assignedRider || "Unassigned"})</span>
                        </span>
                      )}
                    </td>

                    {/* Customer Info */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{order.customerName}</div>
                      {order.address && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate max-w-xs">{order.address}</span>
                        </div>
                      )}
                    </td>

                    {/* Bottles */}
                    <td className="py-3 px-4 text-center font-mono font-medium">
                      <span className="text-sky-600 font-bold">{order.bottlesFull} Full</span>
                      <span className="text-slate-300 mx-1.5">/</span>
                      <span className="text-emerald-600 font-bold">{order.bottlesEmptyReturned} Empty</span>
                    </td>

                    {/* Financial Breakdown */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-bold font-mono text-slate-900">
                        Rs {order.totalAmount.toLocaleString()}
                      </div>
                      {order.khataAmount > 0 ? (
                        <span className="text-[10px] font-bold text-amber-600 block">
                          Khata: Rs {order.khataAmount}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-600 block">Paid Cash</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {order.status === "COMPLETED" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Completed</span>
                        </span>
                      ) : order.status === "DISPATCHED" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          <Clock className="h-3 w-3" />
                          <span>On Route</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="h-3 w-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Print Slip"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: WALK-IN PLANT COUNTER FORM */}
      {/* ========================================================= */}
      {selectedChannelMode === "WALK_IN" && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Store className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Plant Gate POS (Walk-in)</h2>
                  <p className="text-[11px] text-slate-400">Instant counter billing & bottle exchange</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChannelMode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkInOrder} className="space-y-3">
              {/* Optional Name/Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Customer (Optional)</label>
                  <input
                    type="text"
                    placeholder="Guest / Name"
                    value={walkInForm.customerName}
                    onChange={(e) => setWalkInForm({ ...walkInForm, customerName: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone (Optional)</label>
                  <input
                    type="text"
                    placeholder="+92 300..."
                    value={walkInForm.phone}
                    onChange={(e) => setWalkInForm({ ...walkInForm, phone: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              {/* Core Bottle Exchange Counters */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Full 19L Bottles Taken</span>
                  <input
                    type="number"
                    min="1"
                    value={walkInForm.bottlesFull}
                    onChange={(e) =>
                      setWalkInForm({ ...walkInForm, bottlesFull: Math.max(1, Number(e.target.value)) })
                    }
                    className="w-20 h-8 rounded-lg border border-slate-300 px-2 text-center text-xs font-mono font-bold bg-white"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Empty Bottles Returned</span>
                  <input
                    type="number"
                    min="0"
                    value={walkInForm.bottlesEmpty}
                    onChange={(e) =>
                      setWalkInForm({ ...walkInForm, bottlesEmpty: Number(e.target.value) })
                    }
                    className="w-20 h-8 rounded-lg border border-slate-300 px-2 text-center text-xs font-mono font-bold bg-white"
                  />
                </div>

                {/* Additional New Security Bottles (If empties returned < bottles taken) */}
                {walkInForm.bottlesFull > walkInForm.bottlesEmpty && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-amber-800">
                    <span className="text-[11px] font-semibold">
                      New Bottle Deposits (Rs 1,000/ea)
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={walkInForm.newBottleDepositCount}
                      onChange={(e) =>
                        setWalkInForm({ ...walkInForm, newBottleDepositCount: Number(e.target.value) })
                      }
                      className="w-20 h-8 rounded-lg border border-amber-300 px-2 text-center text-xs font-mono font-bold bg-white text-amber-900"
                    />
                  </div>
                )}
              </div>

              {/* Total & Cash Collection */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total Order Amount:</span>
                  <span className="text-base font-bold font-mono text-slate-900">
                    Rs {walkInTotal.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Cash Received at Counter (Rs) *</label>
                  <input
                    type="number"
                    value={walkInForm.cashReceived}
                    onChange={(e) => setWalkInForm({ ...walkInForm, cashReceived: Number(e.target.value) })}
                    className="w-full h-10 rounded-xl border border-slate-300 px-3 text-sm font-bold font-mono text-slate-900 bg-emerald-50/40 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedChannelMode(null)}
                  className="h-9 px-4 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Complete & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SCHEDULED ROUTE DELIVERY FORM */}
      {/* ========================================================= */}
      {selectedChannelMode === "DELIVERY" && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Create Route Delivery</h2>
                  <p className="text-[11px] text-slate-400">Assign rider and dispatch order</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChannelMode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeliveryOrder} className="space-y-3">
              {/* Customer Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Select Customer *</label>
                <select
                  value={deliveryForm.customerName}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, customerName: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                >
                  <option value="Tariq Mahmood">Tariq Mahmood (Farid Town - Block Y)</option>
                  <option value="Al-Madina Sweets">Al-Madina Sweets (Main Bazar)</option>
                  <option value="Dr. Shahida Parveen">Dr. Shahida Parveen (Fateh Sher Colony)</option>
                  <option value="Muhammad Bilal">Muhammad Bilal (High Street)</option>
                </select>
              </div>

              {/* Delivery Quantities */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">19L Bottles to Deliver *</label>
                  <input
                    type="number"
                    min="1"
                    value={deliveryForm.bottlesToDeliver}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, bottlesToDeliver: Math.max(1, Number(e.target.value)) })
                    }
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Expected Empty Returns</label>
                  <input
                    type="number"
                    min="0"
                    value={deliveryForm.expectedEmpty}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, expectedEmpty: Number(e.target.value) })
                    }
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Assign Fleet Rider */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Assign Delivery Rider *</label>
                <select
                  value={deliveryForm.assignedRider}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, assignedRider: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                >
                  <option value="Majid Ali">Majid Ali (Active on Farid Town Route)</option>
                  <option value="Usman Tariq">Usman Tariq (Active on Commercial Route)</option>
                </select>
              </div>

              {/* Scheduled Time Slot */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Delivery Time Window</label>
                <select
                  value={deliveryForm.scheduledSlot}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, scheduledSlot: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                >
                  <option value="Morning Dispatch (09:00 AM - 12:00 PM)">Morning Dispatch (09:00 AM - 12:00 PM)</option>
                  <option value="Evening Dispatch (03:00 PM - 06:00 PM)">Evening Dispatch (03:00 PM - 06:00 PM)</option>
                </select>
              </div>

              {/* Cash Collection Target */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Order Value (4 x Rs 200):</span>
                  <span className="font-mono font-bold text-slate-900">
                    Rs {deliveryForm.bottlesToDeliver * deliveryForm.bottleRate}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Target Rider Cash Collection:</span>
                  <span className="font-mono font-bold text-amber-600">
                    Rs {deliveryForm.cashToCollect}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedChannelMode(null)}
                  className="h-9 px-4 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Schedule & Push to Rider App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}