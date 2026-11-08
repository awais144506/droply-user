"use client";
import { Clock, PackageCheck, Banknote, Calculator } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";
import { formatCurrency } from "@/lib/utils/functions/setFormat";

export function POStats({ stats }: {
    stats: {
        pendingValue: number,
        activeOrders: number,
        checkedByManager: number,
        completedOrders: number,
    }
}) {



    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <PageStatsCard
                title="Pending PO Value"
                value={formatCurrency(stats.pendingValue)}
                prefix="Rs"
                icon={Banknote}
                iconContainerClass="bg-amber-50 text-amber-600"
            />

            <PageStatsCard
                title="Active Orders"
                value={stats.activeOrders}
                postfix="POs"
                icon={Clock}
                valueColorClass="text-sky-600"
            />

            <PageStatsCard
                title="Checked In By (Manger)"
                value={stats.checkedByManager}
                icon={Calculator}
                iconContainerClass="bg-purple-50 text-purple-600"
            />

            <PageStatsCard
                title="Completed Stock-Ins"
                value={stats.completedOrders}
                icon={PackageCheck}
                iconContainerClass="bg-emerald-50 text-emerald-600"
            />


        </div>
    );
}