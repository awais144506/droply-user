"use client";

import { AlertCircle, Banknote, PackagePlus } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";
import { formatCurrency } from "@/lib/utils/functions/setFormat";

interface ReturnStatsProps {
    stats: {
        pendingResolutionAmount: number;
        creditsRecoveredAmount: number;
        stockReplacementsCount: number;
    };
    isLoading?: boolean;
}

export function ReturnStats({ stats, isLoading = false }: ReturnStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <PageStatsCard
                title="Pending Resolution"
                value={formatCurrency(stats.pendingResolutionAmount)}
                prefix="Rs"
                icon={AlertCircle}
                iconContainerClass="bg-amber-50 text-amber-600"
                valueColorClass="text-amber-600"
                description="Awaiting supplier response"
                isLoading={isLoading}
            />

            <PageStatsCard
                title="Credits Recovered"
                value={formatCurrency(stats.creditsRecoveredAmount)}
                prefix="Rs"
                icon={Banknote}
                iconContainerClass="bg-emerald-50 text-emerald-600"
                valueColorClass="text-emerald-600"
                description="Deducted from accounts payable"
                isLoading={isLoading}
            />

            <PageStatsCard
                title="Stock Replacements"
                value={stats.stockReplacementsCount}
                postfix="Items"
                icon={PackagePlus}
                iconContainerClass="bg-sky-50 text-sky-600"
                valueColorClass="text-slate-900"
                description="Inventory successfully replaced"
                isLoading={isLoading}
            />
        </div>
    );
}