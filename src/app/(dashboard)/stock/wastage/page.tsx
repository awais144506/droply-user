"use client";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import WastageStats from "@/features/stock/wastage/components/main/wastage-stats";
import WastageTable from "@/features/stock/wastage/components/main/wastage-table";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { useSearchParams } from "next/navigation";
import { useWastage } from "@/features/stock/wastage/api/use-wastage";
import { useRole } from "@/lib/hooks/use-role";
import Loading from "@/app/loading";

export default function WastageDashboard() {

  const searchParams = useSearchParams();
  const { branchId } = useRole();
  const search = searchParams.get("search") || undefined;
  const type = searchParams.get("type") || undefined
  const { data, isLoading } = useWastage(branchId, search, type);
  const wastageLogs = data?.logs
  const stats = data?.stats || { totalItemsDamaged: 0, estimatedLossValue: 0 }
  console.log(stats);

  if (isLoading) return <Loading text="Loading wastage logs..." />

  return (
    <div className="space-y-6 p-6">
      <MainPageHeader
        heading="Wastage & Damages"
        description="Track damaged inventory, container leaks, and asset loss."
        href="/stock/wastage/create-wastage"
        btnText="Add Wastage"
      />
      <WastageStats
        totalItemsDamaged={stats.totalItemsDamaged}
        estimatedLossValue={stats.estimatedLossValue}
      />

      <DataTableFilterBar
        searchParamName="search"
        searchPlaceholder="Search by product name..."
        tabParamName="type"
        tabs={[
          { label: "All", value: "" },
          { label: "Production", value: "PRODUCTION" },
          { label: "Others", value: "OTHERS" }
        ]}
      />
      <WastageTable
        wastageLogs={wastageLogs}
      />

    </div>
  );
}