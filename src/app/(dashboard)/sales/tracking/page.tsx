"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Calendar, Radio, History, Info } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { useTracking, Rider } from "@/features/tracking/api/use-tracking";
import { TrackingStats } from "@/features/tracking/components/tracking-stats";
import { RiderSidebar } from "@/features/tracking/components/rider-sidebar";
import { ShiftManifest } from "@/features/tracking/components/shift-manifest";

const TrackingMap = dynamic(() => import("@/features/tracking/components/tracking-map"), {
  ssr: false,
  loading: () => <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 animate-pulse h-full" />
});

export default function TrackingPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);

  const { data, isLoading } = useTracking(branchId, selectedDate);
  const isHistoryMode = selectedDate !== todayStr;

  if (isTenantLoading || isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Establishing satellite connection...</p>
      </div>
    );
  }

  if (!selectedRider && data.riders.length > 0) {
    setSelectedRider(data.riders[0]);
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      
      {/* Dynamic Header: Color shifts completely based on Live vs History mode */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-sm transition-colors duration-300 ${
        isHistoryMode 
          ? "bg-amber-50 border-amber-200" 
          : "bg-emerald-50 border-emerald-200"
      }`}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            {isHistoryMode ? "Historical Dispatch Tracking" : "Live Fleet Dispatch"}
            {!isHistoryMode ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 animate-pulse">
                <Radio className="h-3 w-3" /> Live GPS
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200">
                <History className="h-3 w-3" /> Archive Mode
              </span>
            )}
          </h1>
          
          <p className={`text-sm mt-1.5 flex items-center gap-1.5 font-medium ${isHistoryMode ? "text-amber-700" : "text-emerald-700"}`}>
            <Info className="h-4 w-4" />
            {isHistoryMode 
              ? "Viewing past route history and execution data. Select today's date to return to live tracking." 
              : "Monitoring active riders, real-time locations, and current transit cash."}
          </p>
        </div>

        <div className="relative shrink-0">
          <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isHistoryMode ? "text-amber-500" : "text-emerald-500"}`} />
          <input
            type="date" 
            max={todayStr} 
            value={selectedDate}
            onChange={(e) => { setSelectedDate(e.target.value); setSelectedRider(null); }}
            className={`h-11 pl-10 pr-4 rounded-xl border bg-white text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 cursor-pointer shadow-sm transition-colors ${
              isHistoryMode 
                ? "border-amber-200 focus:ring-amber-500/20" 
                : "border-emerald-200 focus:ring-emerald-500/20"
            }`}
          />
        </div>
      </div>

      <TrackingStats data={data} />

      <div className="flex flex-col lg:flex-row gap-6 h-[450px]">
        <TrackingMap rider={selectedRider} isHistoryMode={isHistoryMode} />
        <RiderSidebar riders={data.riders} selectedRider={selectedRider} onSelect={setSelectedRider} />
      </div>

      <ShiftManifest rider={selectedRider} />
    </div>
  );
}