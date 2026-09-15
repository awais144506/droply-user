"use client";

import { Banknote, AlertCircle } from "lucide-react";
import { SupplierPayment } from "../api/use-supplier-payments";

export function PaymentStats({ payments, remainingPayable }: { payments: SupplierPayment[], remainingPayable: number }) {
  const totalDisbursed = payments.reduce((acc, p) => acc + p.amountPaid, 0);
  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Total Amount Paid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Amount Paid</p>
            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
              <Banknote className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalDisbursed)}</p>
        </div>
        <p className="text-xs font-medium text-slate-400 mt-4">Across all recorded payment vouchers</p>
      </div>

      {/* Remaining Accounts Payable */}
      <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Remaining Payable</p>
            <div className="p-2.5 bg-rose-50 rounded-lg text-rose-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-bold text-rose-600">{formatCurrency(remainingPayable)}</p>
        </div>
        <p className="text-xs font-medium text-rose-500 mt-4">Total pending supplier liabilities</p>
      </div>
    </div>
  );
}