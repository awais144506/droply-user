"use client";

import { PackageMinus, ShieldAlert, Banknote, Clock } from "lucide-react";
import { RecoveryRecord } from "../api/use-recoveries";

export function RecoveryStats({ records }: { records: RecoveryRecord[] }) {
  const pendingCount = records.filter(r => r.status === "PENDING_PICKUP").length;
  const defectiveCount = records.filter(r => r.type === "DEFECTIVE_RETURN").length;
  
  // Calculate total deposit refunds issued for completed asset recoveries
  const totalRefunded = records
    .filter(r => r.status === "COMPLETED" && r.type === "ASSET_RECOVERY")
    .reduce((acc, r) => acc + r.financialImpact, 0);

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Pickups</p>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Clock className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Awaiting rider assignment & collection</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Recoveries</p>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600"><PackageMinus className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-sky-600">
            {records.filter(r => r.type === "ASSET_RECOVERY").length}
          </p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Bottles/Dispensers returning to stock</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Defective Logs</p>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><ShieldAlert className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-rose-600">{defectiveCount}</p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Quality control issues reported</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deposits Refunded</p>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Banknote className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalRefunded)}</p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Security deposits returned to clients</p>
      </div>
    </div>
  );
}