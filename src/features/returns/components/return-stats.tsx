"use client";

import { Undo2, AlertCircle, Banknote, PackagePlus } from "lucide-react";
import { PurchaseReturn } from "../api/use-purchase-returns";

export function ReturnStats({ returns }: { returns: PurchaseReturn[] }) {
  const pendingValue = returns.filter(r => r.status === "PENDING").reduce((acc, r) => acc + r.totalValue, 0);
  const creditReceived = returns.filter(r => r.status === "CREDIT_APPLIED").reduce((acc, r) => acc + r.totalValue, 0);
  const totalReplacedCount = returns.filter(r => r.status === "REPLACED").length;

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Resolution</p>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600">{formatCurrency(pendingValue)}</p>
        </div>
        <p className="text-[11px] font-medium text-amber-600 mt-4">Awaiting supplier response</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credits Recovered</p>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{formatCurrency(creditReceived)}</p>
        </div>
        <p className="text-[11px] font-medium text-emerald-600 mt-4">Deducted from accounts payable</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Replacements</p>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
              <PackagePlus className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalReplacedCount} <span className="text-sm font-medium text-slate-400">Batches</span></p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Inventory successfully replaced</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Log Return</p>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
              <Undo2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-sm font-bold text-sky-600 hover:text-sky-700 cursor-pointer flex items-center gap-1">
            Create Debit Note ↗
          </p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Send damaged items back</p>
      </div>
    </div>
  );
}