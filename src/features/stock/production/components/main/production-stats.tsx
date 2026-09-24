"use client";

import { Layers, CheckCircle2, Clock } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";

export function ProductionStats({ totalYield, completedBatches, inProgressBatches }:
  { totalYield: number, completedBatches: number, inProgressBatches: number }) {


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Card 1: Total Output */}
      <PageStatsCard
        title="Total Output (Yield)"
        value={totalYield}
        postfix="Items"
        icon={Layers}
        description="Successfully processed across batches"
        iconContainerClass="bg-sky-50 text-sky-600"
      />

      {/* Card 2: Completed Batches[cite: 2] */}
      <PageStatsCard
        title="Completed Batches"
        value={completedBatches}
        icon={CheckCircle2}
        description="Fully verified and stocked inventory"
        iconContainerClass="bg-emerald-50 text-emerald-600"
        valueColorClass="text-emerald-600"
      />

      <PageStatsCard
        title="Pending Batches"
        value={inProgressBatches}
        icon={Clock}
        description="Pending production batch."
        iconContainerClass="bg-amber-50 text-amber-600"
        valueColorClass="text-amber-600"
      />
    </div>
  );
}