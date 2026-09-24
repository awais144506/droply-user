"use client";

import { useRole } from "@/lib/hooks/use-role";
import { useProduction } from "@/features/stock/production/api/use-production";
import { ProductionStats } from "@/features/stock/production/components/main/production-stats";
import { ProductionTable } from "@/features/stock/production/components/main/production-table";
import Loading from "@/app/loading";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import ActivityLogsCard from "@/lib/utils/components/ActivityLogsMainPage";

export default function ProductionPage() {
  const { branchId } = useRole();

  const { data, isLoading } = useProduction(branchId);

  const stats = data?.stats || { totalYield: 0, completedBatches: 0, inProgressBatches: 0 }
  const batches = data?.batchesData.batches || [];
  const logs = data?.batchesData.logs || [];
  if (isLoading) return <Loading text="Loading batches..." />;
  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">
      <MainPageHeader
        heading="Production & Refill Logs"
        description="Track assembly output, raw material consumption, and daily stock conversions."
        href="/stock/production/create-batch"
        btnText="Log New Batch"
      />

      <ProductionStats
        totalYield={stats.totalYield}
        completedBatches={stats.completedBatches}
        inProgressBatches={stats.inProgressBatches}
      />
      <ProductionTable batches={batches} />

      <ActivityLogsCard
        title="Production Batch Logs"
        logs={logs}
        isLoading={isLoading}
      />
    </div>
  );
}