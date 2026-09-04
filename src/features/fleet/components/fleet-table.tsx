"use client";

import { useState, useEffect } from "react";
import { Search, Pencil, Fuel, Wrench, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Vehicle, VehicleStatus } from "../api/use-fleet";
import { Button } from "@/components/ui/button";

type FilterType = "ALL" | VehicleStatus;

export function FleetTable({ fleet, onEdit }: { fleet: Vehicle[], onEdit: (v: Vehicle) => void }) {
  const [localFleet, setLocalFleet] = useState<Vehicle[]>([]);
  useEffect(() => { setLocalFleet(fleet); }, [fleet]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  const filteredFleet = localFleet.filter((v) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = v.registrationNumber.toLowerCase().includes(searchLower) || v.assignedRider.toLowerCase().includes(searchLower);
    if (statusFilter !== "ALL") return matchesSearch && v.status === statusFilter;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredFleet.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFleet = filteredFleet.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
  
  const getTypeLabel = (type: string) => {
    return type.replace("_", " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toggleMaintenance = (vehicle: Vehicle) => {
    const newStatus = vehicle.status === "ACTIVE" ? "IN_MAINTENANCE" : "ACTIVE";
    setLocalFleet(prev => prev.map(v => v.id === vehicle.id ? { ...v, status: newStatus } : v));
    toast.success(`${vehicle.registrationNumber} is now ${newStatus === "ACTIVE" ? "Active" : "in Maintenance"}.`);
  };

  const handleLogFuel = (regNumber: string) => {
    toast.info(`Opening fuel log modal for ${regNumber}...`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by registration or rider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setStatusFilter("ALL")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>All</button>
          <button onClick={() => setStatusFilter("ACTIVE")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "ACTIVE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Active</button>
          <button onClick={() => setStatusFilter("IN_MAINTENANCE")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "IN_MAINTENANCE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Maintenance</button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Registration / Model</th>
              <th className="px-6 py-4 whitespace-nowrap">Assigned To</th>
              <th className="px-6 py-4 whitespace-nowrap">Fuel (This Month)</th>
              <th className="px-6 py-4 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedFleet.length > 0 ? (
              paginatedFleet.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-base">{v.registrationNumber}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{getTypeLabel(v.type)} • {v.capacityDesc}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{v.assignedRider}</td>
                  <td className="px-6 py-4 font-bold text-rose-600">{formatCurrency(v.monthlyFuelCost)}</td>
                  <td className="px-6 py-4">
                    {v.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100">
                        <Wrench className="h-3 w-3" /> In Maintenance
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" onClick={() => handleLogFuel(v.registrationNumber)} className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 h-8 text-xs font-bold shadow-none cursor-pointer">
                        <Fuel className="h-3.5 w-3.5 mr-1.5" /> Log Fuel
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => toggleMaintenance(v)} className="text-slate-400 hover:text-amber-600 h-8 w-8 rounded-lg cursor-pointer">
                        <Wrench className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onEdit(v)} className="text-slate-400 hover:text-sky-600 h-8 w-8 rounded-lg cursor-pointer">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">No vehicles found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/50">
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