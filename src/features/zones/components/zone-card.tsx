import Link from "next/link";
import { MapPin, ArrowRight, Bike } from "lucide-react";
import { ZoneItem } from "../types";

interface ZoneCardProps {
  zone: ZoneItem;
  onEdit: (zone: ZoneItem) => void;
  onDelete: (zoneId: string) => void;
}

export function ZoneCard({ zone, onEdit, onDelete }: ZoneCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-4">
        {/* Header: Name + Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <MapPin className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {zone.name}
            </h3>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
          <div className="bg-slate-50/70 rounded-xl p-2">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Customers
            </span>
            <span className="text-sm font-bold text-slate-800">
              {zone.metrics.customerCount}
            </span>
          </div>

          <div className="bg-slate-50/70 rounded-xl p-2">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Outstanding
            </span>
            <span
              className={`text-sm font-bold ${
                zone.metrics.outstandingAmount > 0
                  ? "text-amber-600"
                  : "text-slate-800"
              }`}
            >
              {zone.metrics.outstandingAmount > 0
                ? `Rs ${zone.metrics.outstandingAmount.toLocaleString()}`
                : "Rs 0"}
            </span>
          </div>

          <div className="bg-slate-50/70 rounded-xl p-2">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Returnables
            </span>
            <span
              className={`text-sm font-bold ${
                zone.metrics.itemsReturnable > 0
                  ? "text-indigo-600"
                  : "text-slate-800"
              }`}
            >
              {zone.metrics.itemsReturnable}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Riders & Route Desk Navigation */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
          {zone.riders && zone.riders.length > 0 ? (
            <div className="flex items-center gap-1.5 text-slate-700 truncate">
              <Bike className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span className="truncate font-medium text-[11px]">
                {zone.riders.map((r) => r.name).join(", ")}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-slate-400 italic text-[11px]">
              <Bike className="h-3.5 w-3.5" />
              <span>No riders assigned</span>
            </div>
          )}
        </div>

        <Link
          href={`/manage/zones/${zone.id}`}
          className="text-sky-600 font-semibold hover:text-sky-700 inline-flex items-center gap-1 group/link shrink-0"
        >
          <span>Details</span>
          <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}