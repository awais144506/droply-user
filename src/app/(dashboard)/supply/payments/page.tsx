"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { useSupplierPayments, SupplierPayment } from "@/features/payments/api/use-supplier-payments";
import { PaymentStats } from "@/features/payments/components/payment-stats";
import { PaymentTable } from "@/features/payments/components/payment-table";
import { Button } from "@/components/ui/button";

export default function SupplierPaymentsPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading } = useSupplierPayments(branchId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<SupplierPayment | null>(null);

  if (isTenantLoading || isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading payment ledgers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Supplier Payments Out</h1>
          <p className="text-sm text-slate-500 mt-1">
            Record bank transfers, cash vouchers, and cheques issued to vendors.
          </p>
        </div>
        <Button 
          onClick={() => { setEditingPayment(null); setIsModalOpen(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white h-10 px-4 rounded-xl shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" /> Record Payment
        </Button>
      </div>

      <PaymentStats payments={data.payments} remainingPayable={data.totalRemainingPayable} />
      
      <PaymentTable 
        payments={data.payments} 
        onEdit={(payment) => {
          setEditingPayment(payment);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}