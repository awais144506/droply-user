"use client";

import Link from "next/link";
import { MapPin, Users, Package, Wallet, ArrowRight } from "lucide-react";
import { ZoneDetails } from "../types";

interface ZoneCardProps {
  zones: ZoneDetails[];
}

export function ZoneCard({ zones }: ZoneCardProps) {
  // Safe Currency Formatter
  const formatCurrency = (amount: number | string | null | undefined) => {
    const numericAmount = Number(amount || 0);
    if (isNaN(numericAmount)) return "Rs 0";
    return `Rs ${numericAmount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
  };

  if (!zones || zones.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <MapPin className="h-8 w-8 text-slate-300 mb-3" />
        <h3 className="text-sm font-bold text-slate-900">No Zones Found</h3>
        <p className="text-sm text-slate-500 mt-1">Get started by creating your first delivery zone.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {zones.map((zone, index) => {
        const zoneNumber = index + 1;
        return (
          <div key={zone.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500">
                      ZONE {zoneNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1">{zone.name}</h3>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500 font-medium">
                      {zone.customers?.length || 0} Customers
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aggregate Metrics Panel */}
            <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Wallet className="h-3 w-3 text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Khata</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{formatCurrency(zone.calculatedLedger)}</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Package className="h-3 w-3 text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Assets Out</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{zone.calculatedReturnables}</span>
              </div>
            </div>

            {/* Card Footer: View Details Link */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end mt-auto">
              <Link
                href={`/manage/zones/${zone.id}`}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center group transition-colors"
              >
                View Zone Details
                <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}