"use client";

import { useState } from "react";
import { Clock, AlertCircle, RefreshCw } from "lucide-react"; // 🔥 Added RefreshCw
import { Rider } from "../api/use-tracking";
import { useStaffList } from "@/features/admin/staff/api/use-staff";
import { useRiderPresence } from "../api/use-tracking";
import { formatDistanceToNow, differenceInMinutes } from "date-fns";

interface SidebarProps {
  branchId: string;
  riders: Rider[];
  selectedRider: Rider | null;
  onSelect: (r: Rider) => void;
}

type FilterType = "ALL" | "ONLINE" | "OFFLINE" | "DISABLE";

export function RiderSidebar({ branchId, riders, selectedRider, onSelect }: SidebarProps) {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const { data: staffData, isLoading: isStaffLoading } = useStaffList(branchId, "", "RIDER");
  // 🔥 Grab the 'refetch' function from TanStack Query
  const { data: presenceData, isLoading: isPresenceLoading, error, refetch: refetchPresence } = useRiderPresence(branchId);

  if (error) {
    console.log("FETCH ERROR:", error);
  }

  const allStaffRiders = staffData?.staff || [];
  const isLoading = isStaffLoading || isPresenceLoading;

  // Merge Base Staff Data with Live Tracking & Presence Data
  const mergedRiders = allStaffRiders.map((staffRider) => {
    const activeTrackingData = riders.find((tr) => tr.id === staffRider.id);
    const livePresence = presenceData?.find((p: { riderId: string; }) => p.riderId === staffRider.id);

    // 1. Calculate how long it has been since they were last active
    const lastActiveDate = livePresence ? new Date(livePresence.lastActive) : null;
    const isStale = lastActiveDate ? differenceInMinutes(new Date(), lastActiveDate) > 3 : true;

    // 2. If it has been more than 15 minutes, force them OFFLINE visually
    const derivedStatus = isStale ? "OFFLINE" : (livePresence?.status || "OFFLINE");

    // Format last active time gracefully
    const formattedLastActive = livePresence?.lastActive
      ? formatDistanceToNow(new Date(livePresence.lastActive), { addSuffix: true })
      : "Never logged in";

    const baseRider = {
      id: staffRider.id,
      name: staffRider.name,
      zone: "Unassigned",
      isDisable: staffRider.status === "DISABLE",
      status: derivedStatus,
      lastActive: formattedLastActive,
      stopsCompleted: 0,
      totalStops: 0,
      cashInBag: 0,
    };

    if (activeTrackingData) {
      return {
        ...baseRider,
        ...activeTrackingData,
        status: livePresence?.status || activeTrackingData.status,
        lastActive: formattedLastActive,
      } as Rider & { isDisable: boolean };
    }

    return baseRider as Rider & { isDisable: boolean };
  });

  const filteredRiders = mergedRiders.filter((r) => {
    if (filter === "ONLINE") return r.status === "ONLINE" && !r.isDisable;
    if (filter === "DISABLE") return r.isDisable;
    if (filter === "OFFLINE") return r.status === "OFFLINE" && !r.isDisable;
    return true;
  });

  return (
    <div className="w-full lg:w-80 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shrink-0">
      {/* Header & Filters */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Fleet List ({filteredRiders.length})
          </span>

          {/* 🔥 Manual Refresh Button */}
          <button
            onClick={() => refetchPresence()}
            disabled={isPresenceLoading}
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-all active:scale-95 disabled:opacity-50"
            title="Refresh Status"
          >
            <RefreshCw size={14} className={isPresenceLoading ? "animate-spin text-sky-500" : ""} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-lg gap-1">
          {["ONLINE", "OFFLINE", "DISABLE"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as FilterType)}
              className={`flex-1 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all ${filter === f
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Rider List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 h-100">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <div className="h-4 w-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Loading fleet...</span>
          </div>
        ) : filteredRiders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 text-center p-4">
            <AlertCircle className="h-6 w-6 text-slate-300" />
            <span className="text-xs font-medium">No riders found for this filter.</span>
          </div>
        ) : (
          filteredRiders.map((r) => (
            <button
              key={r.id}
              onClick={() => !r.isDisable && onSelect(r)}
              disabled={r.isDisable}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all ${r.isDisable
                ? "opacity-60 bg-slate-50 border-slate-100 cursor-not-allowed"
                : "cursor-pointer"
                } ${selectedRider?.id === r.id
                  ? "border-sky-500 bg-sky-50"
                  : "border-slate-100 hover:border-sky-200 bg-white"
                }`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="font-bold text-slate-900 text-sm truncate max-w-35">{r.name}</p>
                </div>

                {/* Status Badge */}
                {r.isDisable ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                    DISABLED
                  </span>
                ) : (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.status === "ONLINE"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {r.status}
                  </span>
                )}
              </div>

              {/* 🔥 Only render Last Active if they are OFFLINE */}
              {r.status === "OFFLINE" && (
                <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-slate-400">
                  <Clock className="h-3 w-3" /> Last Active: {r.lastActive}
                </div>
              )}

              <div className="flex justify-between items-end text-xs font-bold mt-2 pt-2 border-t border-slate-200/60">
                <span className="text-slate-500">
                  {r.stopsCompleted}/{r.totalStops} Drops
                </span>
                <span className="text-amber-600">Rs {r.cashInBag?.toLocaleString()}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}