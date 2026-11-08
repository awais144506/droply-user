"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Fuel, Wrench, ChevronRight, Activity } from "lucide-react";
import { ExpenseLogs } from "../types/fleet";

interface FleetExpenseLogsProps {
  logs: ExpenseLogs[];
}

export function FleetExpenseLogs({ logs }: FleetExpenseLogsProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center min-h-75 text-center">
        <Activity className="h-10 w-10 text-slate-300 mb-3" />
        <h3 className="text-sm font-bold text-slate-700">No Recent Expenses</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-50">
          No fuel or maintenance logs recorded in the last 5 days.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col max-h-150 overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 p-4">
        <h3 className="text-sm font-bold text-slate-800">Recent Expenses</h3>
        <p className="text-xs font-medium text-slate-500">Last 5 days of activity</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {logs.map((log) => {
          const isPetrol = log.category === "PETROL";
          
        return (
            <Link 
              key={log.id} 
              href={`/admin/fleet/${log.vehicleId}`}
              className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              {/* Icon */}
              <div className={`p-2.5 rounded-lg shrink-0 mr-3 ${
                isPetrol 
                  ? "bg-sky-50 text-sky-600" 
                  : "bg-amber-50 text-amber-600"
              }`}>
                {isPetrol ? <Fuel className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
              </div>

              {/* Middle Content (Vehicle, Rider, Odo) */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md text-xs font-bold shrink-0">
                    {log.vehicleRegistration}
                  </span>
                </div>
                  <p className="text-sm font-bold text-slate-800 truncate">
                    By: {log.riderName}
                  </p>
                
                <p className="text-xs font-medium text-slate-500 truncate">
                  Odometer: {log.odometerReading?.toLocaleString() || 'N/A'} KM
                </p>
              </div>

              {/* Right Content (Amount, Time, Chevron) */}
              <div className="flex flex-col items-end shrink-0 ml-3">
                <p className="text-sm font-bold text-slate-900 mb-1">
                  Rs {log.amount.toLocaleString()}
                </p>
                
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 -mr-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}