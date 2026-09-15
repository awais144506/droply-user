"use client";

import { useState, useEffect } from "react";
import { Search, Plus, CheckCircle2, Clock } from "lucide-react";
import { ProductionBatch } from "../api/use-production";
import { Button } from "@/components/ui/button";

export function ProductionTable({ batches, onNewBatch }: { batches: ProductionBatch[], onNewBatch: () => void }) {
  const [localBatches, setLocalBatches] = useState<ProductionBatch[]>([]);
  useEffect(() => { setLocalBatches(batches); }, [batches]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const filteredBatches = localBatches.filter((b) => 
    b.batchCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBatches = filteredBatches.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search batch code or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
        <Button onClick={onNewBatch} className="bg-sky-600 hover:bg-sky-700 text-white h-10 px-4 rounded-xl text-xs font-bold cursor-pointer">
          <Plus className="h-4 w-4 mr-1.5" /> Log New Batch
        </Button>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Batch Code / Date</th>
              <th className="px-6 py-4 whitespace-nowrap">Item Produced</th>
              <th className="px-6 py-4 whitespace-nowrap">Raw Materials Consumed</th>
              <th className="px-6 py-4 whitespace-nowrap">Supervisor</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Yield Quantity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedBatches.length > 0 ? (
              paginatedBatches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{b.batchCode}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(b.date)}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{b.itemName}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-xs truncate" title={b.rawMaterialsConsumed}>
                    {b.rawMaterialsConsumed}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{b.supervisor}</td>
                  <td className="px-6 py-4 text-right font-bold text-sky-600 text-base">
                    +{b.quantityProduced.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">No production logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{Math.min(startIndex + itemsPerPage, filteredBatches.length)}</span>
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