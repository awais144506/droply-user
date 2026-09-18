/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Search, Pencil, CheckCircle2, Clock, PackageMinus, ShieldAlert, XCircle } from "lucide-react";
import { toast } from "sonner";
import { RecoveryRecord, RecoveryStatus } from "../api/use-recoveries";
import { Button } from "@/components/ui/button";

type FilterType = "ALL" | RecoveryStatus;

export function RecoveryTable({ records, onEdit }: { records: RecoveryRecord[], onEdit: (r: RecoveryRecord) => void }) {
  const [localRecords, setLocalRecords] = useState<RecoveryRecord[]>([]);
  useEffect(() => { setLocalRecords(records); }, [records]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  const filteredRecords = localRecords.filter((r) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = r.customerName.toLowerCase().includes(searchLower) || r.routeZone.toLowerCase().includes(searchLower);
    if (statusFilter !== "ALL") return matchesSearch && r.status === statusFilter;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const markCompleted = (id: string) => {
    setLocalRecords(prev => prev.map(r => r.id === id ? { ...r, status: "COMPLETED" } : r));
    toast.success("Recovery marked as completed. Inventory & Ledgers synced.");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setStatusFilter("ALL")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>All</button>
          <button onClick={() => setStatusFilter("PENDING_PICKUP")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "PENDING_PICKUP" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Pending</button>
          <button onClick={() => setStatusFilter("COMPLETED")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "COMPLETED" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Completed</button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Date / Type</th>
              <th className="px-6 py-4 whitespace-nowrap">Customer Info</th>
              <th className="px-6 py-4 whitespace-nowrap">Items to Recover</th>
              <th className="px-6 py-4 whitespace-nowrap">Ledger Impact</th>
              <th className="px-6 py-4 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 mb-1">{formatDate(r.date)}</p>
                    {r.type === "ASSET_RECOVERY" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100"><PackageMinus className="h-3 w-3" /> Asset Recovery</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100"><ShieldAlert className="h-3 w-3" /> Defective Return</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{r.customerName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Zone: {r.routeZone}</p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {r.items.map((item, idx) => (
                        <p key={idx} className="text-xs font-medium text-slate-600">
                          <span className="font-bold text-slate-900">{item.quantity}x</span> {item.description}
                        </p>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {r.financialImpact > 0 ? (
                      <div>
                        <p className="font-bold text-emerald-600">-{formatCurrency(r.financialImpact)}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{r.type === "ASSET_RECOVERY" ? "Deposit Refund" : "Ledger Credit"}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-medium text-xs">No Impact (Replacement)</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {r.status === "PENDING_PICKUP" && (
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100"><Clock className="h-3 w-3" /> Pending</span>
                        {r.assignedRider && <p className="text-[10px] text-slate-400 font-medium mt-1">Assigned: {r.assignedRider}</p>}
                      </div>
                    )}
                    {r.status === "COMPLETED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100"><CheckCircle2 className="h-3 w-3" /> Completed</span>
                    )}
                    {r.status === "CANCELLED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200"><XCircle className="h-3 w-3" /> Cancelled</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {r.status === "PENDING_PICKUP" && (
                        <Button size="sm" onClick={() => markCompleted(r.id)} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 h-8 text-xs font-bold shadow-none cursor-pointer">
                          Mark Recovered
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => onEdit(r)} className="text-slate-400 hover:text-sky-600 h-8 w-8 rounded-lg cursor-pointer">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">No records match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-4">
          <p className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{Math.min(startIndex + itemsPerPage, filteredRecords.length)}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 rounded-lg text-xs bg-white cursor-pointer">Prev</Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${currentPage === i + 1 ? "bg-sky-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"}`}>
                {i + 1}
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 rounded-lg text-xs bg-white cursor-pointer">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}