"use client";

import { Package, AlertCircle, RotateCcw, Network } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";

interface ProductStatsProps {
    totalItems: number;
    lowStockCount: number;
    returnablesCount: number;
    recipeItemsCount: number;
}
export function ProductStats({
    totalItems,
    lowStockCount,
    returnablesCount,
    recipeItemsCount,
}: ProductStatsProps) {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <PageStatsCard
                title="Total Catalog Items"
                value={totalItems}
                icon={Package}
            />

            <PageStatsCard
                title="Total Recipes"
                value={recipeItemsCount}
                icon={Network}
                iconContainerClass="bg-amber-50 text-amber-600"
            />

            <PageStatsCard
                title="Returnable Assets"
                value={returnablesCount}
                icon={RotateCcw}
                iconContainerClass="bg-indigo-50 text-indigo-600"
            />

            <PageStatsCard
                title="Low Stock Alerts"
                value={lowStockCount}
                icon={AlertCircle}
                iconContainerClass={lowStockCount > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}
                valueColorClass={lowStockCount > 0 ? "text-rose-600" : "text-emerald-600"}
            />

        </div>
    );
}