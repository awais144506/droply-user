"use client";

import { useRole } from "@/lib/hooks/use-role";
import { useProduction } from "@/features/stock/production/api/use-production";
import { ProductionStats } from "@/features/stock/production/components/main/production-stats";
import { ProductionTable } from "@/features/stock/production/components/main/production-table";
import { toast } from "sonner";
import Loading from "@/app/loading";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import ActivityLogsCard from "@/lib/utils/components/ActivityLogsMainPage";

export default function ProductionPage() {
  const { branchId } = useRole();

  // 1. Fetch the data object which contains both { batches, logs }
  const { data, isLoading } = useProduction(branchId);

  const batches = data?.batches || [];
  const logs = data?.logs || [];

  if (isLoading) return <Loading text="Loading batches..." />;

  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">
      <MainPageHeader
        heading="Production & Refill Logs"
        description="Track assembly output, raw material consumption, and daily stock conversions."
        href="/stock/production/create-batch"
        btnText="Log New Batch"
      />

      <ProductionStats batches={batches} />
      <ProductionTable batches={batches} />

      <ActivityLogsCard
        title="Production Batch Logs"
        logs={logs}
        isLoading={isLoading}
      />
    </div>
  );
}