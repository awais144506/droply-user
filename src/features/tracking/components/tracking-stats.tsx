"use client";

import { MapPin, Droplet, Wallet, Route, AlertTriangle } from "lucide-react";
import { TrackingData } from "../api/use-tracking";

export function TrackingStats({ data }: { data: TrackingData }) {
  const onlineCount = data.riders.filter(r => r.status === "ONLINE").length;
  const offlineCount = data.riders.filter(r => r.status === "OFFLINE").length;
  const liveCash = data.riders.reduce((acc, r) => acc + r.cashInBag, 0);
  
  const totalEstKM = data.riders.reduce((acc, r) => acc + r.estimatedKM, 0);
  const totalCoveredKM = data.riders.reduce((acc, r) => acc + r.coveredKM, 0);
  const deviation = totalCoveredKM > totalEstKM ? ((totalCoveredKM - totalEstKM) / totalEstKM) * 100 : 0;

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fleet Status</p>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600"><MapPin className="h-4 w-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900">{onlineCount} <span className="text-sm font-medium text-slate-500">Online</span></p>
            <p className="text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">{offlineCount} Offline</p>
          </div>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">{data.riders.length} Total registered sector riders</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory Progress</p>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Droplet className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{data.plantStats.totalDropped} <span className="text-sm font-medium text-slate-400">Dropped</span></p>
        </div>
        <p className="text-[11px] font-medium text-slate-500 mt-4">
          <span className="font-bold text-slate-700">{data.plantStats.collectedFromPlant}</span> Collected • <span className="font-bold text-amber-600">{data.plantStats.totalLeft}</span> Left
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Cash in Bag</p>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Wallet className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-amber-600">{formatCurrency(liveCash)}</p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Active transit money in fleet possession</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mileage & Fuel Tracking</p>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Route className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{totalCoveredKM.toFixed(1)} <span className="text-sm font-medium text-slate-400">KM</span></p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <p className="text-[11px] font-medium text-slate-500">Est. {totalEstKM.toFixed(1)} KM</p>
          {deviation > 10 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded uppercase">
              <AlertTriangle className="h-3 w-3" /> High Deviation
            </span>
          )}
        </div>
      </div>
    </div>
  );
}