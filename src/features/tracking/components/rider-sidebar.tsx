"use client";

import { Clock } from "lucide-react";
import { Rider } from "../api/use-tracking";

interface SidebarProps {
  riders: Rider[];
  selectedRider: Rider | null;
  onSelect: (r: Rider) => void;
}

export function RiderSidebar({ riders, selectedRider, onSelect }: SidebarProps) {
  return (
    <div className="w-full lg:w-80 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shrink-0">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Fleet List ({riders.length})</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[400px]">
        {riders.map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${selectedRider?.id === r.id ? "border-sky-500 bg-sky-50" : "border-slate-100 hover:border-sky-200 bg-white"}`}
          >
            <div className="flex justify-between items-start mb-1.5">
              <div>
                <p className="font-bold text-slate-900 text-sm">{r.name}</p>
                <p className="text-[10px] text-slate-500">{r.zone}</p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.status === "ONLINE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{r.status}</span>
            </div>
            
            <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-slate-400">
              <Clock className="h-3 w-3" /> Last Active: {r.lastActive}
            </div>

            <div className="flex justify-between items-end text-xs font-bold mt-2 pt-2 border-t border-slate-200/60">
              <span className="text-slate-500">{r.stopsCompleted}/{r.totalStops} Drops</span>
              <span className="text-amber-600">Rs {r.cashInBag}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}