"use client";
import { Users, Bike, Briefcase, UserX } from "lucide-react";
import PageStatsCard from "@/utils/page-stats-card";

interface StaffStatsProps {
  activeStaffCount: number;
  activeManagers: number;
  activeRiders: number;
  disableStaff: number
}

export function StaffStats({ activeStaffCount, activeManagers, activeRiders, disableStaff }: StaffStatsProps) {

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <PageStatsCard
        title="Total Staff"
        value={activeStaffCount}
        icon={Users}
        iconContainerClass="bg-blue-50 text-blue-600"
      />
      <PageStatsCard
        title="Active Managers"
        value={activeManagers}
        icon={Briefcase}
        iconContainerClass="bg-indigo-50 text-indigo-600"
      />
      <PageStatsCard
        title="Active Riders"
        value={activeRiders}
        icon={Bike}
        iconContainerClass="bg-emerald-50 text-emerald-600"
      />
      <PageStatsCard
        title="Inactive / Disabled"
        value={disableStaff}
        icon={UserX}
        iconContainerClass="bg-rose-50 text-rose-600"
        valueColorClass={disableStaff > 0 ? "text-rose-600" : "text-slate-900"} // Optional: turn the number red if there are inactive users
      />
    </div>
  );
}