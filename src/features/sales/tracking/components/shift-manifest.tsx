"use client";

import { useState } from "react";
import { CheckCircle2, Navigation, Clock, Search, ShieldCheck } from "lucide-react";
import { Rider, DeliveryStatus } from "../api/use-tracking";
import { Button } from "@/components/ui/button";

type FilterType = "ALL" | DeliveryStatus;

export function ShiftManifest({ rider }: { rider: Rider | null }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!rider) return null;

  const filteredStops = rider.stops.filter((s) => {
    const matchesSearch = s.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter !== "ALL") return matchesSearch && s.status === statusFilter;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredStops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStops = filteredStops.slice(startIndex, startIndex + itemsPerPage);
  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{rider.name}'s Shift Manifest</h3>
          <p className="text-xs text-slate-500 mt-1">Granular cash tracking and delivery status.</p>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[250px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Order / Location</th>
              <th className="px-6 py-4 whitespace-nowrap">Target Cash</th>
              <th className="px-6 py-4 whitespace-nowrap">Collected Cash</th>
              <th className="px-6 py-4 whitespace-nowrap">Ledger Entry</th>
              <th className="px-6 py-4 whitespace-nowrap">Drop Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedStops.map((stop) => (
              <tr key={stop.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{stop.customerName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{stop.address}</p>
                </td>
                
                <td className="px-6 py-4 font-bold text-slate-400">
                  {formatCurrency(stop.targetCash)}
                </td>
                
                <td className="px-6 py-4">
                  <span className={`font-bold ${stop.collectedCash > 0 ? "text-emerald-600" : "text-slate-300"}`}>
                    {formatCurrency(stop.collectedCash)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {stop.addedToLedger ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                      <ShieldCheck className="h-3 w-3" /> Reconciled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold border border-slate-200">
                      Pending Sync
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {stop.status === "DELIVERED" && <span className="text-xs font-bold text-emerald-600">Delivered</span>}
                  {stop.status === "HEADING_NOW" && <span className="text-xs font-bold text-sky-600">Heading Now</span>}
                  {stop.status === "PENDING_DROP" && <span className="text-xs font-bold text-slate-400">Queued</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}