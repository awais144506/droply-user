"use client";
import { useRole } from "@/lib/hooks/use-role";
import { usePayments } from "@/features/supply/payments/api/use-payments";
import { PaymentsTable } from "@/features/supply/payments/components/main/payment-table";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import Loading from "@/app/loading";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { useSearchParams } from "next/navigation";
import ErrorBoundary from "@/app/error";
import ActivityLogsCard from "@/lib/utils/components/ActivityLogsMainPage";

export default function SupplierPaymentsPage() {
  const searchParamas = useSearchParams();
  const search = searchParamas.get('search') || undefined;
  const status = searchParamas.get('status') || undefined;

  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading, isError, error } = usePayments(branchId, search, status);
  const payments = data?.payments
  const logs = data?.logs;

  if (isTenantLoading || !branchId || isLoading) {
    return <Loading text="Loading Payments..." />;
  }

  if (isError) {
    return <ErrorBoundary error={error?.message || "Failed to load payments"} />;
  }

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
      <ActivityLogsCard
        title="Supplier Payment Activity"
        logs={logs}
      />
    </div>
  );
}