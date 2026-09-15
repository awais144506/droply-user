/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import PageHeader from "@/lib/utils/components/MainPageHeader";
import { useOrders } from "@/features/sales/orders/api/use-order";
import {
  Search, Store, Truck, MapPin, CheckCircle,
  Clock, Printer, Edit, Trash2, ChevronDown, CheckCircle2
} from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
const Orders = () => {
  const { branchId } = useRole();
  const { data: realOrders = [], isLoading } = useOrders(branchId);

  const [activeTab, setActiveTab] = useState("All Orders");


  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        heading="Sales & Despatch Orders"
        description="Generate instant branch counter bills or schedule route deliveries for zones."
        href="/sales/orders/create-sale"
        btnText="Create New Sale"
      />

      {/* Container mapping the exact shape of your screenshot */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Top Filter Bar */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search order #, customer name, or sector..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-300 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Segmented Control */}
            <div className="flex bg-slate-50 border border-slate-200 rounded-full p-1">
              {["All Orders", "Walk-In Gate", "Route Deliveries"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${activeTab === tab
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Status Dropdown */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              All Statuses <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-slate-400">Order #</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-slate-400">Channel</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-slate-400">Customer & Location</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-slate-400">Bottles (Full / Empty)</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-slate-400">Payment</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-slate-400">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {realOrders.map((order: any, idx) => (
                <tr key={order.id || idx} className="hover:bg-slate-50/50 transition-colors group">

                  {/* Order # */}
                  <td className="px-6 py-4">
                    <div className="font-extrabold text-[13px] text-slate-900">
                      {order.id.includes('ORD') ? order.id : `ORD-${order.id.slice(0, 4).toUpperCase()}`}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Today, {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Channel */}
                  <td className="px-6 py-4">
                    {order.type === 'WALK_IN' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-600 border border-sky-100">
                        <Store className="w-3.5 h-3.5" /> Walk-in Gate
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <Truck className="w-3.5 h-3.5" /> Delivery ({order.rider?.name || 'Assigned'})
                      </span>
                    )}
                  </td>

                  {/* Customer & Location */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-[13px] text-slate-800">
                      {order.customer?.name || "Unknown Customer"}
                    </div>
                    {order.type === 'DELIVERY' && order.customer?.address && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" /> {order.customer.address}
                      </div>
                    )}
                  </td>

                  {/* Bottles (Full / Empty) */}
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-bold">
                      <span className="text-sky-600">{order.totalFull || 0} Full</span>
                      <span className="text-slate-300 mx-2">/</span>
                      <span className="text-emerald-600">{order.totalEmpty || 0} Empty</span>
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4">
                    <div className="font-extrabold text-[13px] text-slate-900">
                      Rs {order.totalAmount?.toLocaleString()}
                    </div>
                    <div className={`text-[11px] font-bold mt-0.5 ${order.paymentMethod === 'KHATA' ? 'text-amber-600' : 'text-emerald-500'}`}>
                      {order.paymentMethod === 'KHATA' ? `Khata: Rs ${(order.totalAmount - (order.amountPaid || 0)).toLocaleString()}` : 'Paid Cash'}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {order.status === 'COMPLETED' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                    {order.status === 'ON_ROUTE' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-600 border border-sky-200">
                        <Clock className="w-3.5 h-3.5" /> On Route
                      </span>
                    )}
                    {order.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </td>

                  {/* Actions (Print, Edit, Delete) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 text-slate-400">
                      <button className="p-1.5 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="Print Receipt">
                        <Printer className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Order">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Order">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;