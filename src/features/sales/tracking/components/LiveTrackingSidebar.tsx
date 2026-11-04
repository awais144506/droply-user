/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Bike, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
    riders?: any[] | undefined;
    selectedRider: any | null;
    onSelect: (rider: any) => void;
};

export const LiveTrackingSidebar = ({ riders, selectedRider, onSelect }: Props) => {
    const onShiftCount = riders?.filter((r) => r.isOnShift).length;

    return (
        <div className="absolute top-4 right-10 w-80 max-h-[calc(100vh-6rem)] flex flex-col gap-3 pointer-events-none z-999">
            {/* Header & Rider List Card */}
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-sky-600" /> Fleet Tracking
                    </h2>
                    <Badge variant="outline" className="text-[10px] font-bold bg-sky-50 text-sky-700 border-sky-200">
                        {onShiftCount} On Shift
                    </Badge>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {riders?.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No riders found.</p>
                    ) : (
                        riders?.map((rider) => {
                            const isSelected = selectedRider?.id === rider.id;
                            return (
                                <button
                                    key={rider.id}
                                    onClick={() => onSelect(rider)}
                                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSelected
                                            ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5 truncate">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-white/20 text-white" : "bg-sky-100 text-sky-700"
                                            }`}>
                                            <Bike className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex flex-col text-left truncate">
                                            <span className="truncate">{rider.name}</span>
                                            <span className={`text-[9px] font-medium ${isSelected ? "text-sky-100" : "text-slate-400"}`}>
                                                {rider.phone || "No Phone"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 pl-2">
                                        {rider?.isOnShift ? (
                                            <span className={`flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-extrabold ${isSelected ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-700"
                                                }`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> On Shift
                                            </span>
                                        ) : (
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${isSelected ? "bg-slate-700 text-slate-200" : "bg-slate-200 text-slate-500"
                                                }`}>
                                                Offline
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};