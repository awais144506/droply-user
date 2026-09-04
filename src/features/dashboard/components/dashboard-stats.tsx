"use client";

import { Wallet, Package, MapPin, ShieldAlert } from "lucide-react";
import { DashboardData } from "../api/use-dashboard";

export function DashboardStats({ stats }: { stats: DashboardData["stats"] }) {
  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Revenue</p>
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Wallet className="h-4 w-4" /></div>
        </div>
        <p className="text-3xl font-bold text-slate-900">{formatCurrency(stats.todayRevenue)}</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Drops</p>
          <div className="p-2 bg-sky-50 rounded-lg text-sky-600"><Package className="h-4 w-4" /></div>
        </div>
        <p className="text-3xl font-bold text-sky-600">{stats.pendingDrops}</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Fleet</p>
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><MapPin className="h-4 w-4" /></div>
        </div>
        <p className="text-3xl font-bold text-indigo-600">{stats.activeRiders} Riders</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm flex flex-col justify-between bg-rose-50/30">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Action Required</p>
          <div className="p-2 bg-rose-100 rounded-lg text-rose-700"><ShieldAlert className="h-4 w-4" /></div>
        </div>
        <p className="text-3xl font-bold text-rose-600">{stats.lowStockAlerts} Alerts</p>
      </div>
    </div>
  );
}