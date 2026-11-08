"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useDailySales } from "@/features/sales/daily/api/use-dailysales";
import { DailySalesHeader } from "@/features/sales/daily/components/DailySalesHeader";
import { DailySalesKpiCards } from "@/features/sales/daily/components/DailySalesKpiCards";
import { DailySalesBreakdown } from "@/features/sales/daily/components/DailySalesBreakdown";

export default function DailySales() {
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    const { data: summaryData, isLoading, isFetching, refetch } = useDailySales(selectedDate);

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            <DailySalesHeader
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                isFetching={isFetching}
                isLoading={isLoading}
                onRefetch={() => refetch()}
            />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-2xl border border-slate-200">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                    <p className="text-xs font-medium text-slate-400">Loading Daily Sales Data...</p>
                </div>
            ) : (
                <>
                    <DailySalesKpiCards kpis={summaryData?.kpis} />
                    <DailySalesBreakdown 
                        categories={summaryData?.categories || []} 
                        alerts={summaryData?.alerts || { criticalCount: 0, items: [] }} 
                    />
                </>
            )}
        </div>
    );
}