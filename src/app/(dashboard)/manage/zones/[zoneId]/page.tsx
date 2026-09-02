"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Package, Wallet, Users, Truck } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { useZoneDetails } from "@/features/zones/api/use-zone-details";
import { ZoneCustomersTable } from "@/features/zones/components/zone-customers-table";

export default function ZoneDetailsPage() {
  const params = useParams();
  const zoneId = params.zoneId as string;
  const { branchId, isLoading: isTenantLoading } = useRole();

  const { data: zone, isLoading } = useZoneDetails(branchId, zoneId);

  const formatCurrency = (amount: number | string | null | undefined) => {
    const numericAmount = Number(amount || 0);
    if (isNaN(numericAmount)) return "Rs 0";
    return `Rs ${numericAmount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
  };

  if (isLoading || isTenantLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-sm font-medium">Loading zone details...</p>
      </div>
    );
  }

  if (!zone) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <p className="text-slate-500">Zone not found.</p>
        <Link href="/manage/zones" className="text-sky-600 mt-4 inline-block hover:underline">
          Return to Zones
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      
      {/* 1. Header Navigation */}
      <div className="flex items-center gap-4">
        <Link 
          href="/manage/zones"
          className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{zone.name}</h1>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Zone Overview & Customer Directory
          </p>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
              <Users className="h-4 w-4 text-sky-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Customers</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{zone.customers?.length || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-amber-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Zone Khata</h3>
          </div>
          <p className="text-2xl font-bold text-amber-600">{formatCurrency(zone.ledgerAmount)}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Package className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assets Out</h3>
          </div>
          <p className="text-2xl font-bold text-indigo-600">{zone.itemsReturnable}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Truck className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Riders</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {zone.riders && zone.riders.length > 0 ? (
              zone.riders.map((rider) => (
                <span key={rider.id} className="px-2 py-1 rounded bg-slate-100 text-[11px] font-bold text-slate-700">
                  {rider.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Unassigned</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Customers Table */}
      <ZoneCustomersTable customers={zone.customers} />
      
    </div>
  );
}