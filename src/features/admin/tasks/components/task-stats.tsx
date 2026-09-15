"use client";

import { CheckCircle2, CircleDashed, AlertOctagon, Users } from "lucide-react";
import { Task } from "../api/use-tasks";

export function TaskStats({ tasks }: { tasks: Task[] }) {
  const pending = tasks.filter(t => t.status === "INCOMPLETE").length;
  const completed = tasks.filter(t => t.status === "COMPLETED").length;
  const urgent = tasks.filter(t => t.type === "URGENT" && t.status === "INCOMPLETE").length;
  const total = tasks.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Tasks</p>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600"><CircleDashed className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-sky-600">{pending}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urgent Action</p>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><AlertOctagon className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-rose-600">{urgent}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</p>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{completed}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Delegated</p>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><Users className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{total}</p>
        </div>
      </div>
    </div>
  );
}