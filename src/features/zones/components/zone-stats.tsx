"use client";

import { MapPin, Users, Wallet, RotateCcw } from "lucide-react";
import { ZoneItem } from "../types";

export function ZoneStats({ zones }: { zones: ZoneItem[] }) {
  // Safe reducers mapping to the new optimized backend structure
  const totalCustomers = zones.reduce((acc, z) => acc + (z.customers?.length || 0), 0);
  const totalLedger = zones.reduce((acc, z) => acc + Number(z.ledgerAmount || 0), 0);
  const totalReturnables = zones.reduce((acc, z) => acc + Number(z.itemsReturnable || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Zones</span>
          <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
            <MapPin className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-900">{zones.length}</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Customers</span>
          <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-900">{totalCustomers}</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Outstanding (KHATA)</span>
          <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-amber-600">
          Rs {totalLedger.toLocaleString("en-PK", { maximumFractionDigits: 0 })}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Returnables Items Held</span>
          <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <RotateCcw className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-900">
          {totalReturnables} <span className="text-xs font-normal text-slate-400">items</span>
        </p>
      </div>
    </div>
  );
}