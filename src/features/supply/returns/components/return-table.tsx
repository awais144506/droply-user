"use client";

import { useState, useEffect } from "react";
import { Search, RotateCcw, CheckCircle2, Clock, PackageCheck, CreditCard } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { PurchaseReturn, ReturnResolution } from "../api/use-purchase-returns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FilterType = "ALL" | ReturnResolution;

export function ReturnTable({ returns, onEdit }: { returns: PurchaseReturn[], onEdit: (r: PurchaseReturn) => void }) {
  const [localReturns, setLocalReturns] = useState<PurchaseReturn[]>([]);
  useEffect(() => { setLocalReturns(returns); }, [returns]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("ALL");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<PurchaseReturn | null>(null);
  const [resolutionType, setResolutionType] = useState<"CREDIT_APPLIED" | "REPLACED">("CREDIT_APPLIED");

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  const filteredReturns = localReturns.filter((r) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = r.returnNumber.toLowerCase().includes(searchLower) || r.supplierName.toLowerCase().includes(searchLower);
    if (statusFilter !== "ALL") return matchesSearch && r.status === statusFilter;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReturns = filteredReturns.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleResolveClick = (ret: PurchaseReturn) => {
    setSelectedReturn(ret);
    setResolutionType("CREDIT_APPLIED");
    setResolveModalOpen(true);
  };

  const confirmResolve = () => {
    if (!selectedReturn) return;
    setLocalReturns(prev => prev.map(r => r.id === selectedReturn.id ? { ...r, status: resolutionType } : r));
    
    if (resolutionType === "CREDIT_APPLIED") {
      toast.success(`Accounts Payable reduced by ${formatCurrency(selectedReturn.totalValue)}`);
    } else {
      toast.success(`Inventory stock added back for ${selectedReturn.returnNumber}`);
    }
    setResolveModalOpen(false);
  };

  const handleUndo = (ret: PurchaseReturn) => {
    setLocalReturns(prev => prev.map(r => r.id === ret.id ? { ...r, status: "PENDING" } : r));
    toast.info(`Resolution reversed for ${ret.returnNumber}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by debit note # or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setStatusFilter("ALL")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>All</button>
          <button onClick={() => setStatusFilter("PENDING")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "PENDING" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Pending</button>
          <button onClick={() => setStatusFilter("CREDIT_APPLIED")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "CREDIT_APPLIED" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Credit Applied</button>
          <button onClick={() => setStatusFilter("REPLACED")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "REPLACED" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Replaced</button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Debit Note #</th>
              <th className="px-6 py-4 whitespace-nowrap">Supplier Firm</th>
              <th className="px-6 py-4 whitespace-nowrap">Returned Items</th>
              <th className="px-6 py-4 whitespace-nowrap">Total Value</th>
              <th className="px-6 py-4 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedReturns.length > 0 ? (
              paginatedReturns.map((ret) => (
                <tr key={ret.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{ret.returnNumber}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(ret.returnDate)}</p>
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{ret.supplierName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Ref: {ret.poRef}</p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {ret.items.map((item, idx) => (
                        <p key={idx} className="text-xs text-slate-600">
                          <span className="font-bold text-rose-600">-{item.quantity}x</span> {item.description}
                        </p>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-700">
                    {formatCurrency(ret.totalValue)}
                  </td>

                  <td className="px-6 py-4">
                    {ret.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100">
                        <Clock className="h-3 w-3" /> Pending Resolution
                      </span>
                    )}
                    {ret.status === "CREDIT_APPLIED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                        <CheckCircle2 className="h-3 w-3" /> Credit Applied
                      </span>
                    )}
                    {ret.status === "REPLACED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-100">
                        <PackageCheck className="h-3 w-3" /> Replaced
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ret.status === "PENDING" ? (
                        <Button size="sm" onClick={() => handleResolveClick(ret)} className="bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 h-8 text-xs font-bold shadow-none cursor-pointer">
                          Resolve Case
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleUndo(ret)} className="text-slate-400 hover:text-amber-600 h-8 px-2 text-xs font-semibold cursor-pointer">
                          <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Undo
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">No return records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5 ml-auto">
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

      {/* Resolution Dialog */}
      <AlertDialog open={resolveModalOpen} onOpenChange={setResolveModalOpen}>
        <AlertDialogContent className="rounded-3xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Resolve Return Case</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              How did <span className="font-bold text-slate-900">{selectedReturn?.supplierName}</span> compensate for this return?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 flex flex-col gap-3">
            <button
              onClick={() => setResolutionType("CREDIT_APPLIED")}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${resolutionType === "CREDIT_APPLIED" ? "border-emerald-500 bg-emerald-50" : "border-slate-100 hover:border-emerald-200 bg-white"}`}
            >
              <CreditCard className={`h-5 w-5 mt-0.5 ${resolutionType === "CREDIT_APPLIED" ? "text-emerald-600" : "text-slate-400"}`} />
              <div>
                <p className="font-bold text-slate-900 text-sm">Issued Account Credit</p>
                <p className="text-xs text-slate-500 mt-0.5">Deducts {formatCurrency(selectedReturn?.totalValue || 0)} from payable balance.</p>
              </div>
            </button>
            
            <button
              onClick={() => setResolutionType("REPLACED")}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${resolutionType === "REPLACED" ? "border-sky-500 bg-sky-50" : "border-slate-100 hover:border-sky-200 bg-white"}`}
            >
              <PackageCheck className={`h-5 w-5 mt-0.5 ${resolutionType === "REPLACED" ? "text-sky-600" : "text-slate-400"}`} />
              <div>
                <p className="font-bold text-slate-900 text-sm">Provided Replacement Stock</p>
                <p className="text-xs text-slate-500 mt-0.5">Adds items back into your active inventory.</p>
              </div>
            </button>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-slate-200 cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResolve} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md cursor-pointer">
              Confirm Resolution
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}