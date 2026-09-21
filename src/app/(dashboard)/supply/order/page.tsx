"use client";
import { useRole } from "@/lib/hooks/use-role";
import { usePurchaseOrders } from "@/features/supply/order/api/use-po";
import { POStats } from "@/features/supply/order/components/main/po-stats";
import { POTable } from "@/features/supply/order/components/main/po-table";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import Loading from "@/app/loading";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { useSearchParams } from "next/navigation";

export default function PurchaseOrdersPage() {
  const { branchId } = useRole();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined
  const { data, isLoading } = usePurchaseOrders(branchId, search, status);

  const orders = data?.orders;
  const stats = data?.stats || { activeOrders: 0, pendingValue: 0, checkedByManager: 0, completedOrders: 0 };

  if (isLoading) return <Loading text="Loading Orders..." />

  return (
    <div className="space-y-6 p-6">
      <MainPageHeader
        heading="Purchase Orders (PO)"
        description="Issue procurement orders to vendors and receive incoming inventory."
        href="/supply/order/create-po"
        btnText="Create PO"
      />

      <POStats stats={stats} />

      <DataTableFilterBar
        searchParamName="search"
        searchPlaceholder="Search by PO number or supplier..."
        tabParamName="status"
        tabs={[
          { label: "All", value: "" },
          { label: "Ordered", value: "ORDERED" },
          { label: "Checked", value: "PENDING_RESTOCK" },
          { label: "Received", value: "RECEIVED" }
        ]}
      />
      <POTable
        orders={orders}
      />
    </div>
  );
}