"use client";

import React from "react";
import { Calendar, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    isFetching: boolean;
    isLoading: boolean;
    onRefetch: () => void;
};

export const DailySalesHeader = ({
    selectedDate,
    setSelectedDate,
    isFetching,
    isLoading,
    onRefetch,
}: Props) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daily Operations & Summary</h1>
                    {isFetching && !isLoading && (
                        <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                    )}
                </div>
                <p className="text-sm text-slate-500 mt-1">High-level financial totals, category order counts, and active stock-out telemetry for the day.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex items-center">
                    <Calendar className="absolute left-3 w-4 h-4 text-slate-400" />
                    <Input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-9 h-10 w-full sm:w-48 bg-slate-50 border-slate-200 font-semibold text-slate-700 rounded-xl"
                    />
                </div>

                {/* 🔥 Manual Refetch Button */}
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onRefetch}
                    disabled={isFetching}
                    className="h-10 w-10 shrink-0 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-sky-600" : ""}`} />
                </Button>
            </div>
        </div>
    );
};