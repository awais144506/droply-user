"use client";
import { useRole } from "@/lib/hooks/use-role";
import { usePayments } from "@/features/supply/payments/api/use-payments";
import { PaymentsTable } from "@/features/supply/payments/components/main/payment-table";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import Loading from "@/app/loading";

export default function SupplierPaymentsPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading } = usePayments(branchId);
  const payments = data?.payments

  if (isTenantLoading || isLoading || !data) return <Loading text="Loading Payments..." />

  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">
      <MainPageHeader
        heading="Supplier Payments Out"
        description="Record bank transfers, cash vouchers, and cheques issued to vendors."
        href="/supply/payments/create-payment"
        btnText="New Payment"
      />

      <PaymentsTable
        branchId={branchId}
        payments={payments}
      />
    </div>
  );
}