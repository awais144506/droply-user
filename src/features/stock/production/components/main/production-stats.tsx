"use client";

import { Layers, CheckCircle2, Factory } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";
import { ProductionBatch } from "../../types/production"; // Adjust import path if needed

interface ProductionStatsProps {
  batches: ProductionBatch[];
}

export function ProductionStats({ batches = [] }: ProductionStatsProps) {
  const totalYield = batches.reduce((sum, batch) => sum + (batch.yieldQuantity || 0), 0);
  const totalBatches = batches.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Card 1: Total Output */}
      <PageStatsCard
        title="Total Output (Yield)"
        value={totalYield.toLocaleString()}
        postfix="Units"
        icon={Layers}
        description="Successfully processed across batches"
        iconContainerClass="bg-sky-50 text-sky-600"
      />

      {/* Card 2: Completed Batches[cite: 2] */}
      <PageStatsCard
        title="Completed Batches"
        value={totalBatches.toLocaleString()}
        icon={CheckCircle2}
        description="Fully verified and stocked inventory"
        iconContainerClass="bg-emerald-50 text-emerald-600"
        valueColorClass="text-emerald-600"
      />

      {/* Card 3: Active Assembly Lines[cite: 2] */}
      <PageStatsCard
        title="Active Assembly Lines"
        value="1"
        postfix="Line"
        icon={Factory}
        description="Operating at normal capacity"
        iconContainerClass="bg-indigo-50 text-indigo-600"
        valueColorClass="text-indigo-600"
        postfixTextColor="text-indigo-600"
      />
    </div>
  );
}