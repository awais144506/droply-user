"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";

// --- DUMMY DATA FOR WASTAGE PAGE ---
const MOCK_WASTAGE_DATA = [
  { id: "WST-1029", date: "2026-09-23", item: "19L Polycarbonate Bottle", category: "Container", quantity: 12, reason: "Leaking / Punctured", reportedBy: "Majid Ali", status: "Discarded" },
  { id: "WST-1028", date: "2026-09-22", item: "Bottle Caps", category: "Consumable", quantity: 150, reason: "Factory Defect (Seal broken)", reportedBy: "Inventory Team", status: "Pending Review" },
  { id: "WST-1027", date: "2026-09-20", item: "Manual Pump Dispenser", category: "Equipment", quantity: 3, reason: "Spring broken", reportedBy: "Route 4 Driver", status: "Replaced" },
  { id: "WST-1026", date: "2026-09-18", item: "19L Polycarbonate Bottle", category: "Container", quantity: 5, reason: "Cracked during transit", reportedBy: "Kamran", status: "Discarded" },
];

export default function WastageDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFA] font-sans">
      {/* Top Header */}
      <header className="px-8 py-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wastage</h1>
          <p className="text-sm text-slate-500 mt-1">Track damaged inventory, container leaks, and asset loss.</p>
        </div>
        <button className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" />
          Log New Wastage
        </button>
      </header>

      {/* Content Body */}
      <div className="px-8 pb-8 flex-1 overflow-y-auto">
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Items Damaged</p>
            <h3 className="text-2xl font-black text-slate-900 mt-2">170<span className="text-sm font-medium text-slate-500 ml-1">units</span></h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Loss Value</p>
            <h3 className="text-2xl font-black text-rose-600 mt-2">Rs 18,500</h3>
          </div>
        </div>

        {/* Main Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search item, reason, or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
              />
            </div>
            <button className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2 cursor-pointer transition-colors">
              <Filter className="w-4 h-4" />
              Filter Logs
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 text-slate-500">
                <tr>
                  <th className="font-semibold px-6 py-4">Date</th>
                  <th className="font-semibold px-6 py-4">Item Details</th>
                  <th className="font-semibold px-6 py-4">Qty</th>
                  <th className="font-semibold px-6 py-4">Reason</th>
                  <th className="font-semibold px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_WASTAGE_DATA.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{new Date(row.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{row.item}</p>
                      <p className="text-[11px] text-slate-500">{row.category}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{row.quantity}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{row.reason}</p>
                      <p className="text-[11px] text-slate-500">Rep: {row.reportedBy}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}