"use client";

import { useRole } from "@/lib/hooks/use-role";
import { useReturns } from "@/features/supply/returns/api/use-returns";
import { ReturnStats } from "@/features/supply/returns/components/main/return-stats";
import { ReturnTable } from "@/features/supply/returns/components/main/return-table";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import Loading from "@/app/loading";
import ActivityLogsCard from "@/lib/utils/components/ActivityLogsMainPage";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { useSearchParams } from "next/navigation";

export default function PurchaseReturnsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') || undefined;
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading } = useReturns(branchId, search, status);

  if (isTenantLoading || isLoading || !data) return <Loading text="Loading PO Returns..." />

  return (
    <div className="space-y-6 p-6">
      <MainPageHeader
        heading="Purchase Returns"
        description="Manage debit notes for damaged or rejected vendor shipments."
        href="/supply/returns/create-return"
        btnText="New Return"
      />

      <ReturnStats stats={data.stats} />

      <DataTableFilterBar
        searchParamName="search"
        searchPlaceholder="Search by firm / debit note #..."
        tabParamName="status"
        tabs={[
          { label: "All", value: "" },
          { label: "Pending", value: "PENDING" },
          { label: "Resolved", value: "RESOLVED" },
        ]}
      />
      <ReturnTable returns={data.returns} />

      <ActivityLogsCard
        title="Purchase Return Activity"
        logs={data.logs}
        isLoading={isLoading}
      />
    </div>
  );
}