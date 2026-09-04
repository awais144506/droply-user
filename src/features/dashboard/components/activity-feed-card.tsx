"use client";

import { Activity, AlertCircle, CheckCircle2, ShoppingBag, Info } from "lucide-react";
import { ActivityLog } from "../api/use-dashboard";

export function ActivityFeed({ logs }: { logs: ActivityLog[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "ALERT": return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case "SALE": return <ShoppingBag className="h-4 w-4 text-emerald-500" />;
      case "SUCCESS": return <CheckCircle2 className="h-4 w-4 text-sky-500" />;
      default: return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:hidden flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Activity className="h-5 w-5 text-sky-600" /> Live Operations Log
        </h3>
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 pr-2">
        {logs.map(log => (
          <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
            <div className="mt-0.5 bg-white shadow-sm p-1.5 rounded-lg border border-slate-100">
              {getIcon(log.type)}
            </div>
            <div>
              <p className={`text-sm font-bold ${log.type === "ALERT" ? "text-rose-700" : "text-slate-700"}`}>
                {log.message}
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}