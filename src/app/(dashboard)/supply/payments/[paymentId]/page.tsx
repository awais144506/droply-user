"use client";

import { useParams } from "next/navigation";
import PaymentForm from "@/features/supply/payments/components/create/PaymentForm";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";
import { usePayment } from "@/features/supply/payments/api/use-payments";
import Loading from "@/app/loading"; // Adjust based on your loading component

export default function EditSupplierPayment() {
  const params = useParams();
  const paymentId = params.paymentId as string;

  // Fetch the existing payment
  const { data: initialData, isLoading } = usePayment(paymentId);

  if (isLoading) return <Loading text="Loading payment details..." />;
  if (!initialData) return <div className="p-6 text-slate-500">Payment not found.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 space-y-6">
      <CreateFormHeader
        title="Edit Payment Voucher"
        href="/supply/payments"
      />

      <div className="w-full">
        {/* Pass the fetched data to the form */}
        <PaymentForm initialData={initialData} />
      </div>
    </div>
  );
}