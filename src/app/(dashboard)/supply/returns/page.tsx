"use client";

import { useRole } from "@/lib/hooks/use-role";
import { useReturns } from "@/features/supply/returns/api/use-returns";
import { ReturnStats } from "@/features/supply/returns/components/main/return-stats";
import { ReturnTable } from "@/features/supply/returns/components/main/return-table";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import Loading from "@/app/loading";

export default function PurchaseReturnsPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading } = useReturns(branchId);

  if (isTenantLoading || isLoading || !data) return <Loading text="Loading PO Returns..." />

  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">
      <MainPageHeader
        heading="Purchase Returns"
        description="Manage debit notes for damaged or rejected vendor shipments."
        href="/supply/returns/create-return"
        btnText="New Return"
      />

      <ReturnStats stats={data.stats} />

      <ReturnTable
        returns={data.returns}
      />
    </div>
  );
}