"use client";

import { Truck, Droplet, Wrench, Route } from "lucide-react";
import { Vehicle } from "../api/use-fleet";

export function FleetStats({ fleet }: { fleet: Vehicle[] }) {
  const activeCount = fleet.filter(v => v.status === "ACTIVE").length;
  const maintenanceCount = fleet.filter(v => v.status === "IN_MAINTENANCE").length;
  const totalFuel = fleet.reduce((acc, v) => acc + v.monthlyFuelCost, 0);
  
  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Fuel (This Month)</p>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><Droplet className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-rose-600">{formatCurrency(totalFuel)}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Fleet</p>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Truck className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{activeCount}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Maintenance</p>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Wrench className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-amber-600">{maintenanceCount}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Routes</p>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600"><Route className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-sky-600">{activeCount}</p>
        </div>
      </div>
    </div>
  );
}