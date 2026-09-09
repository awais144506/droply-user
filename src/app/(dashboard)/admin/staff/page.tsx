/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import PageHeader from "@/utils/page-header";
import TierLimitCard from "@/utils/tier-limit-card";
import Loading from "@/app/loading";
import { useStaffList, useStaffLogs } from "@/features/staff/api/use-staff";
import ErrorBoundary from "@/app/error";
import ActivityLogsCard from "@/utils/activity-logs-card";
import { StaffStats } from "@/features/staff/components/staff-stats";
import { StaffTable } from "@/features/staff/components/staff-table";

export default function StaffPage() {
  const { branchId, isLoading: isRoleLoading } = useRole();
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch Staff List & Logs
  const { data: staffData = [], isLoading: isStaffLoading, isError, error } = useStaffList(branchId);
  const { data: logs = [] } = useStaffLogs(branchId);

  if (isRoleLoading || isStaffLoading) return <Loading />;
  if (isError) return <ErrorBoundary error={error.message} />;

  const activeStaffCount = staffData.filter((s: any) => s.status === 'ACTIVE').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

      <PageHeader
        heading="Staff Management"
        description="Manage your team, assign roles, and control system access."
        href="/admin/staff/create-staff"
        btnText="Add Staff"
      />

      <StaffStats staff={staffData} />

      {/* Dynamic Tier Card */}
      <TierLimitCard activeStaffCount={activeStaffCount} />

      {/* Grid Layout: Main Content (Left) & Sidebar Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">

        {/* Left Column: Staff Table & Search */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="p-8 text-center text-slate-500 text-sm">
              <StaffTable
                staff={staffData}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Activity Logs Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ActivityLogsCard
              title="Staff Activity Logs"
              logs={logs}
            />
          </div>
        </div>

      </div>
    </div>
  );
}