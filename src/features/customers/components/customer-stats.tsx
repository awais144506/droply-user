"use client";

import { Users, Wallet, Package, ShieldCheck } from "lucide-react";
import { CustomerItem } from "../api/use-customers";

interface CustomerStatsProps {
  customers: CustomerItem[];
}

export function CustomerStats({ customers }: CustomerStatsProps) {
  const activeCount = customers.filter((c) => c.status === "ACTIVE").length;
  
  const totalDebt = customers.reduce((sum, c) => sum + Number(c.customerCredit || 0), 0);
  const totalAssets = customers.reduce((sum, c) => sum + Number(c.openingReturnables || 0), 0);
  const totalSecurity = customers.reduce((sum, c) => sum + Number(c.securityHeld || 0), 0);

  const formatCurrency = (val: number) => 
    `Rs ${val.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Accounts */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Accounts</p>
          <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-slate-900">{customers.length}</p>
          <p className="text-xs font-semibold text-emerald-600">({activeCount} Active)</p>
        </div>
      </div>

      {/* Outstanding Khata */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Outstanding Khata</p>
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
        <p className="text-3xl font-bold text-amber-600">{formatCurrency(totalDebt)}</p>
      </div>

      {/* Assets in Market */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assets In Market</p>
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Package className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-slate-900">{totalAssets}</p>
          <p className="text-xs font-medium text-slate-500">units</p>
        </div>
      </div>


    </div>
  );
}