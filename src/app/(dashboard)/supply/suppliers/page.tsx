"use client";
import { useRole } from "@/lib/hooks/use-role";
import { useSuppliers } from "@/features/supply/suppliers/api/use-suppliers";
import { SupplierStats } from "@/features/supply/suppliers/components/main/supplier-stats";
import { SupplierTable } from "@/features/supply/suppliers/components/main/supplier-table";
import Loading from "@/app/loading";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { useSearchParams } from "next/navigation";


export default function SuppliersPage() {
  const { branchId } = useRole();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined

  const { data, isLoading } = useSuppliers(branchId, search, status);
  const { suppliers, totalDueAmount } = data || {};
  if (isLoading) return <Loading text="Loading Suppliers..." />

  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">
      <MainPageHeader
        heading="Suppliers & Vendor Accounts"
        description="Vendors you purchase inventory, raw materials, and plant equipment from."
        href="/supply/suppliers/create-supplier"
        btnText="Create Supplier"
      />
      <SupplierStats
        totalDueAmount={totalDueAmount}
      />
      <DataTableFilterBar
        searchParamName="search"
        searchPlaceholder="Search by firm name..."
        tabParamName="status"
        tabs={[
          { label: "All", value: "" },
          { label: "Balance", value: "DEBT" },
          { label: "Clear", value: "CLEAR" },]
        }
      />
      <SupplierTable suppliers={suppliers} />

    </div>
  );
}