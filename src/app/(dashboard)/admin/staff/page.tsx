"use client";
import { useRole } from "@/lib/hooks/use-role";
import PageHeader from "@/lib/utils/components/MainPageHeader";
import TierLimitCard from "@/features/admin/staff/components/main/tier-limit-card";
import Loading from "@/app/loading";
import { useStaffList, useStaffLogs } from "@/features/admin/staff/api/use-staff";
import ErrorBoundary from "@/app/error";
import ActivityLogsCard from "@/lib/utils/components/ActivityLogsMainPage";
import { StaffStats } from "@/features/admin/staff/components/main/staff-stats";
import { StaffTable } from "@/features/admin/staff/components/main/staff-table";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { useSearchParams } from "next/navigation";

export default function StaffPage() {
  const { branchId, maxUsersLimit } = useRole();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const role = searchParams.get("role") || undefined;
  const status = searchParams.get("status") || undefined;

  const { data, isLoading, isError, error } = useStaffList(branchId, search, role, status);
  const { data: logs = [], isLoading: isLoadingLogs } = useStaffLogs(branchId);

  const staffData = data?.staff || [];
  const stats = data?.stats || { totalStaff: 0, activeStaffCount: 0, activeManagers: 0, activeRiders: 0, disableStaff: 0 };
  const isLimitReached = data?.isLimitReached

  if (isLoading) return <Loading text="Loading Staff..."/>;
  if (isError) return <ErrorBoundary error={error.message} />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      <PageHeader
        heading="Staff Management"
        description="Manage your team, assign roles, and control system access."
        href="/admin/staff/create-staff"
        btnText="Add Staff"
        isDisabled={isLimitReached}
      />

      <TierLimitCard
        activeStaffCount={stats.activeStaffCount}
        maxUsersLimit={maxUsersLimit}
        isLimitReached={isLimitReached}
      />

      <StaffStats
        totalStaff={stats.totalStaff}
        activeStaffCount={stats.activeStaffCount}
        activeManagers={stats.activeManagers}
        activeRiders={stats.activeRiders}
        disableStaff={stats.disableStaff}
      />

      <div>
        <div className="lg:col-span-2 space-y-4">
          <DataTableFilterBar
            searchPlaceholder="Search staff by name..."
            searchParamName="search"
            tabParamName="role"
            tabs={[
              { label: "All", value: "" },
              { label: "Managers", value: "MANAGER" },
              { label: "Riders", value: "RIDER" }
            ]}
            dropdownParamName="status"
            dropdownPlaceholder="All Statuses"
            dropdownOptions={[
              { label: "Active", value: "ACTIVE" },
              { label: "Disabled", value: "DISABLE" },
            ]}
          />
          <StaffTable staff={staffData} />
        </div>

        <div className="mt-5">
          <div className="sticky top-6">
            <ActivityLogsCard
              title="Staff Activity Logs"
              logs={logs}
              isLoading={isLoadingLogs}
            />
          </div>
        </div>

      </div>
    </div>
  );
}