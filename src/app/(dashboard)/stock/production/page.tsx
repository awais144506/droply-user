"use client";

import { useRole } from "@/lib/hooks/use-role";
import { useProduction } from "@/features/stock/production/api/use-production";
import { ProductionStats } from "@/features/stock/production/components/main/production-stats";
import { ProductionTable } from "@/features/stock/production/components/main/production-table";
import Loading from "@/app/loading";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import ActivityLogsCard from "@/lib/utils/components/ActivityLogsMainPage";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { useSearchParams } from "next/navigation";

export default function ProductionPage() {
  const { branchId } = useRole();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined

  const { data, isLoading } = useProduction(branchId, search, status);
  const stats = data?.stats || { totalYield: 0, completedBatches: 0, inProgressBatches: 0 }
  const batches = data?.batchesData || [];
  const logs = data?.logsData|| [];
  if (isLoading) return <Loading text="Loading batches..." />;
  return (
    <div className="space-y-6 p-6">
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
      <DataTableFilterBar
        searchParamName="search"
        searchPlaceholder="Search by batchNo / item produced..."
        tabParamName="status"
        tabs={[
          { label: "All", value: "" },
          { label: "Completed", value: "COMPLETED" },
          { label: "In Progress", value: "IN_PROGRESS" },
        ]}
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