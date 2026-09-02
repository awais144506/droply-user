"use client";

import { useState } from "react";
import { Search, MapPin, Phone, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import { ZoneDetails } from "../api/use-zone-details";

interface ZoneCustomersTableProps {
  customers: ZoneDetails["customers"];
}

export function ZoneCustomersTable({ customers }: ZoneCustomersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const formatCurrency = (amount: number | string | null | undefined) => {
    const numericAmount = Number(amount || 0);
    if (isNaN(numericAmount) || numericAmount === 0) return "-";
    return `Rs ${numericAmount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Table Header & Search */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-800">
          Enrolled Customers ({customers.length})
        </h3>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Customer Info</th>
              <th className="px-4 py-3 whitespace-nowrap">Contact & Address</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Khata (Credit)</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Assets Held</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{customer.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {customer.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span className="text-xs font-medium">{customer.phone}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3 w-3 text-slate-400 mt-0.5" />
                      <span className="text-xs text-slate-500 line-clamp-1 max-w-50">
                        {customer.address}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {customer.status === "ACTIVE" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3" /> ACTIVE
                      </span>
                    )}
                    {customer.status === "INACTIVE" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                        <AlertCircle className="h-3 w-3" /> INACTIVE
                      </span>
                    )}
                    {customer.status === "BLOCKED" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-50 text-rose-700 text-[10px] font-bold">
                        <ShieldAlert className="h-3 w-3" /> BLOCKED
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-bold text-sm ${Number(customer.customerCredit) > 0 ? "text-amber-600" : "text-slate-600"}`}>
                      {formatCurrency(customer.customerCredit)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs">
                      {customer.openingReturnables}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-xs">
                  No customers found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}