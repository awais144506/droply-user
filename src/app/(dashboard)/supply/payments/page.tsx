"use client";
import { useRole } from "@/lib/hooks/use-role";
import { usePayments } from "@/features/supply/payments/api/use-payments";
import { PaymentsTable } from "@/features/supply/payments/components/main/payment-table";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import Loading from "@/app/loading";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { useSearchParams } from "next/navigation";

export default function SupplierPaymentsPage() {
  const searchParamas = useSearchParams();
  const search = searchParamas.get('search') || undefined;
  const status = searchParamas.get('status') || undefined;

  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading } = usePayments(branchId, search, status);
  const payments = data?.payments

  if (isTenantLoading || isLoading || !data) return <Loading text="Loading Payments..." />

  return (
    <div className="space-y-6 p-6">
      <MainPageHeader
        heading="Supplier Payments Out"
        description="Record bank transfers, cash vouchers, and cheques issued to vendors."
        href="/supply/payments/create-payment"
        btnText="New Payment"
      />

      <DataTableFilterBar
        searchParamName="search"
        searchPlaceholder="Search by firm / voucher..."
        tabParamName="status"
        tabs={[
          { label: "All", value: "" },
          { label: "Partial", value: "PARTIAL" },
          { label: "Clear", value: "CLEARED" }
        ]}
      />
      <PaymentsTable
        branchId={branchId}
        payments={payments}
      />
    </div>
  );
}