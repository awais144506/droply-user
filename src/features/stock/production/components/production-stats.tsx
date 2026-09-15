"use client";

import { Layers, CheckCircle2, Factory, Activity } from "lucide-react";
import { ProductionBatch } from "../api/use-production";

export function ProductionStats({ batches }: { batches: ProductionBatch[] }) {
  const totalUnits = batches.reduce((acc, b) => acc + b.quantityProduced, 0);
  const completedBatches = batches.filter(b => b.status === "VERIFIED" || b.status === "COMPLETED").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Output (Yield)</p>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600"><Layers className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalUnits.toLocaleString()} <span className="text-sm font-medium text-slate-400">Units</span></p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Successfully processed across batches</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Batches</p>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{completedBatches}</p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Fully verified and stocked inventory</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Assembly Lines</p>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Factory className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-indigo-600">1 Line</p>
        </div>
        <p className="text-[11px] font-medium text-indigo-600 mt-4"><Activity className="h-3 w-3 inline mr-1 animate-pulse" /> Operating at normal capacity</p>
      </div>
    </div>
  );
}