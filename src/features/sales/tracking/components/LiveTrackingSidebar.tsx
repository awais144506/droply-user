"use client";

import React from "react";
import {
  Bike,
  Navigation,
  Calendar,
  CheckCircle2,
  XCircle,
  Banknote,
  Clock,
  Package,
  Wifi,
  WifiOff,
  RefreshCw,
  Radio,
  PowerOff,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FleetRiderOverview } from "../types/tracking";
import { formatDistanceToNowStrict, isBefore, subDays } from "date-fns";
import { useRole } from "@/lib/hooks/use-role";
import { useSetRiderOffline } from "../api/use-riderStatus-mutate";

type Props = {
  riders?: FleetRiderOverview[];
  selectedRider: FleetRiderOverview | null;
  onSelect: (rider: FleetRiderOverview | null) => void;
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
  isSocketConnected?: boolean;
  onRefetch: () => void;
  isRefetching?: boolean;
};

export const LiveTrackingSidebar = ({
  riders = [],
  selectedRider,
  onSelect,
  selectedDate,
  onDateChange,
  isSocketConnected = false,
  onRefetch,
  isRefetching = false,
}: Props) => {
  const { branchId } = useRole();
  const {
    mutate: setRiderOffline,
    isPending: isSettingOffline,
    variables: offlineTargetId,
  } = useSetRiderOffline(branchId);

  const todayStr = new Date().toLocaleDateString("en-CA");

  const onlineCount = riders.filter(
    (r) => r.presence?.status === "ONLINE"
  ).length;

  return (
    <div className="absolute top-4 left-4 right-4 z-900 flex flex-col gap-2.5 pointer-events-none">
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/85 shadow-xl pointer-events-auto flex flex-col gap-3">

        {/* Top Control Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-sky-600" /> Fleet Command Bar
            </h2>

            {/* Refresh Button */}
            <button
              onClick={onRefetch}
              disabled={isRefetching}
              title="Refresh Fleet Data"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-sky-600" : ""}`} />
            </button>

            <Badge
              variant="outline"
              className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {onlineCount} / {riders.length} Online
            </Badge>

            <Badge
              variant="outline"
              className={`text-[10px] font-semibold flex items-center gap-1 ${
                isSocketConnected
                  ? "bg-sky-50 text-sky-700 border-sky-200"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              {isSocketConnected ? (
                <>
                  <Wifi className="w-3 h-3 text-sky-600" /> Live Socket
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-slate-400" /> Offline Feed
                </>
              )}
            </Badge>
          </div>

          {/* Right Controls: Clear Rider, Date Picker, & Back to Live Button */}
          <div className="flex items-center gap-2.5">
            {selectedRider && (
              <button
                onClick={() => onSelect(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Show All Riders
              </button>
            )}

            {/* Date Picker for History Mode */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
              <Calendar className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
              <span className="text-[11px] font-bold text-slate-400 uppercase mr-2">
                History Date:
              </span>
              <input
                type="date"
                value={selectedDate || ""}
                max={todayStr}
                onChange={(e) => onDateChange(e.target.value ? e.target.value : null)}
                className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              />
            </div>

            {/* Switch back to Live Mode if a date is currently selected */}
            {selectedDate && (
              <button
                onClick={() => onDateChange(null)}
                className="text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Back to Live
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Horizontal Scrollable Rider Cards */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-0.5 scrollbar-thin scrollbar-thumb-slate-200">
          {riders.length === 0 ? (
            <div className="w-full py-3 text-center text-xs font-medium text-slate-400">
              No riders registered in this branch.
            </div>
          ) : (
            riders.map((rider) => {
              const isSelected = selectedRider?.id === rider.id;
              const isOnline = rider.presence?.status === "ONLINE";
              const isThisRiderLoading = isSettingOffline && offlineTargetId === rider.id;

              const rawLastActive = rider.presence?.lastActive;
              const lastActiveDate = rawLastActive ? new Date(rawLastActive) : null;

              let lastActiveFormatted = "Never online";
              if (lastActiveDate && !isNaN(lastActiveDate.getTime())) {
                const isTooOld = isBefore(lastActiveDate, subDays(new Date(), 30));
                if (!isTooOld) {
                  lastActiveFormatted = formatDistanceToNowStrict(lastActiveDate, {
                    addSuffix: true,
                  });
                }
              }
              return (
                <div
                  key={rider.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(isSelected ? null : rider)}
                  className={`min-w-72.5 max-w-77.5 shrink-0 flex flex-col justify-between p-3 rounded-xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                      : "bg-slate-50/80 hover:bg-slate-100/90 text-slate-800 border-slate-200/80"
                  }`}
                >
                  {/* Top Line: Rider Identity + Presence Badge & Force Offline Action */}
                  <div className="flex items-start justify-between gap-2 w-full mb-2.5">
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-sky-500 text-white"
                            : isOnline
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        <Bike className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold truncate">
                            {rider.name}
                          </span>
                        </div>

                        {!isOnline && (
                          <div
                            className={`flex items-center gap-1 text-[10px] font-medium mt-0.5 ${
                              isSelected ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            <Clock className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{lastActiveFormatted}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Presence Pill + Conditional Set Offline Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`shrink-0 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                          isOnline
                            ? isSelected
                              ? "bg-emerald-500 text-white"
                              : "bg-emerald-100 text-emerald-700"
                            : isSelected
                              ? "bg-slate-800 text-slate-400"
                              : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isOnline && (
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        )}
                        {rider.presence?.status || "OFFLINE"}
                      </span>

                      {isOnline && (
                        <button
                          type="button"
                          disabled={isThisRiderLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            setRiderOffline(rider.id);
                          }}
                          title="Set Rider Offline"
                          className={`p-1 rounded-full border transition-colors cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? "bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500 hover:text-white"
                              : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                          } ${isThisRiderLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                          {isThisRiderLoading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <PowerOff className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Today's Stats Strip */}
                  <div
                    className={`grid grid-cols-4 gap-1.5 pt-2 border-t text-[10px] w-full ${
                      isSelected ? "border-slate-800" : "border-slate-200/70"
                    }`}
                  >
                    {/* Active On Truck */}
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          isSelected ? "text-slate-400" : "text-slate-400"
                        }`}
                      >
                        <Package className="w-2.5 h-2.5 text-sky-500" /> Active
                      </span>
                      <span className="font-extrabold text-xs mt-0.5">
                        {rider.activeOrders?.length || 0}
                      </span>
                    </div>

                    {/* Completed Today */}
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          isSelected ? "text-slate-400" : "text-slate-400"
                        }`}
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Done
                      </span>
                      <span className="font-extrabold text-xs mt-0.5">
                        {rider.stats?.completedCount || 0}
                        <span className="text-[9px] font-normal opacity-70">
                          /{rider.stats?.totalDeliveries || 0}
                        </span>
                      </span>
                    </div>

                    {/* Cancelled Today */}
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          isSelected ? "text-slate-400" : "text-slate-400"
                        }`}
                      >
                        <XCircle className="w-2.5 h-2.5 text-rose-500" /> Cancel
                      </span>
                      <span className="font-extrabold text-xs mt-0.5">
                        {rider.stats?.cancelledCount || 0}
                      </span>
                    </div>

                    {/* Cash Collected Today */}
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          isSelected ? "text-slate-400" : "text-slate-400"
                        }`}
                      >
                        <Banknote className="w-2.5 h-2.5 text-amber-500" /> Cash
                      </span>
                      <span className="font-extrabold text-xs mt-0.5 truncate">
                        Rs {rider.stats?.totalAmountCollected || 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};