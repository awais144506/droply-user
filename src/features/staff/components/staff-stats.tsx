"use client";

import { Users, ShieldCheck, Bike, Briefcase } from "lucide-react";
import { BranchUserItem } from "../api/use-staff";

interface StaffStatsProps {
  staff: BranchUserItem[];
  maxUsersLimit?: number;
  planName?: string;
}

export function StaffStats({ staff, maxUsersLimit = 15, planName = "Gold Plan" }: StaffStatsProps) {
  const activeStaff = staff.filter((s) => s.isActive);
  const riders = activeStaff.filter((s) => s.role === "RIDER").length;
  const managers = activeStaff.filter((s) => s.role === "MANAGER").length;

  const usagePercentage = Math.min((staff.length / maxUsersLimit) * 100, 100);
  const isNearingLimit = usagePercentage >= 80;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Staff & Plan Limit */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Staff</p>
              <p className="text-[10px] text-sky-600 font-semibold mt-0.5">{planName}</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <p className="text-3xl font-bold text-slate-900">{staff.length}</p>
            <p className="text-sm font-semibold text-slate-400">/ {maxUsersLimit}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${isNearingLimit ? "bg-rose-500" : "bg-sky-500"}`} 
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          {isNearingLimit && (
            <p className="text-[10px] text-rose-600 font-medium mt-1.5">
              Approaching your plan&apos;s user limit.
            </p>
          )}
        </div>
      </div>

      {/* Active Force */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Staff</p>
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <p className="text-3xl font-bold text-emerald-600 mt-2">{activeStaff.length}</p>
      </div>

      {/* Dispatch Riders */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Riders</p>
          <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
            <Bike className="h-4 w-4" />
          </div>
        </div>
        <p className="text-3xl font-bold text-sky-600 mt-2">{riders}</p>
      </div>

      {/* Management */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Management</p>
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Briefcase className="h-4 w-4" />
          </div>
        </div>
        <p className="text-3xl font-bold text-indigo-600 mt-2">{managers}</p>
      </div>
    </div>
  );
}