/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Users, Bike, Briefcase, UserX } from "lucide-react";
import PageStatsCard from "@/utils/page-stats-card";

interface StaffStatsProps {
  staff: any[];
}

export function StaffStats({ staff }: StaffStatsProps) {
  // Calculate stats dynamically
  const totalStaff = staff.length;
  const activeManagers = staff.filter(s => s.designation === "MANAGER" && s.status === "ACTIVE").length;
  const activeRiders = staff.filter(s => s.designation === "RIDER" && s.status === "ACTIVE").length;
  const inactiveStaff = staff.filter(s => s.status === "DISABLE").length; // Or 'SUSPENDED' based on your enum

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <PageStatsCard
        title="Total Staff"
        value={totalStaff}
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
        value={inactiveStaff}
        icon={UserX}
        iconContainerClass="bg-rose-50 text-rose-600"
        valueColorClass={inactiveStaff > 0 ? "text-rose-600" : "text-slate-900"} // Optional: turn the number red if there are inactive users
      />
    </div>
  );
}