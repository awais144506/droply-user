"use client";

import { Wallet, AlertCircle, TrendingUp, FileText } from "lucide-react";
import { Supplier } from "../api/use-suppliers";

export function SupplierStats({ suppliers }: { suppliers: Supplier[] }) {
  const totalPayable = suppliers.reduce((acc, s) => acc + s.payableBalance, 0);
  const suppliersWithDues = suppliers.filter(s => s.payableBalance > 0).length;
  const totalVolume = suppliers.reduce((acc, s) => acc + s.totalPurchases, 0);

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Accounts Payable</p>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-rose-600">{formatCurrency(totalPayable)}</p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Outstanding supplier bills to settle</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suppliers With Dues</p>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {suppliersWithDues} <span className="text-sm font-medium text-slate-400">/ {suppliers.length} Firms</span>
          </p>
        </div>
        <p className="text-[11px] font-medium text-amber-600 mt-4">Payment terms active</p>
      </div>
    </div>
  );
}