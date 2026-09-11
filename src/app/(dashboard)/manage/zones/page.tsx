"use client"
import PageHeader from "@/utils/page-header"
import ActivityLogsCard from "@/utils/activity-logs-card"
import { useZoneLogs, useZones } from "@/features/zones/api/use-zones"
import { useRole } from "@/hooks/use-role"
import Loading from "@/app/loading"
import ErrorBoundary from "@/app/error"
import { ZoneStats } from "@/features/zones/components/zone-stats"
import { ZoneCard } from "@/features/zones/components/zone-card"
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar"
import { useSearchParams } from "next/navigation"

const ZonePage = () => {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const { data: logs = [] } = useZoneLogs(branchId);
  const { data, isError, error, isLoading } = useZones(branchId, search);
  const zones = data?.zones || [];
  const stats = data?.stats || { totalZones: 0, totalCustomers: 0, totalLedger: 0, totalReturnables: 0 };


  if (isTenantLoading || isLoading) return <Loading />
  if (isError) return <ErrorBoundary error={error.message} />

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        heading="Delivery Zones"
        description="Manage distribution sectors, route riders, and track total liabilities per area."
        href="/manage/zones/create-zone"
        btnText="Create Zone"
      />

      <ZoneStats
        totalZones={stats.totalZones}
        totalCustomers={stats.totalCustomers}
        totalLedger={stats.totalLedger}
        totalReturnables={stats.totalReturnables}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 space-y-4">
          <DataTableFilterBar
            searchPlaceholder="Search zone by name..."
            searchParamName="search"
          />
          <ZoneCard zones={zones} />
        </div>

        {/* Sidebar: Activity Logs */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ActivityLogsCard
              title="Zone Activity Logs"
              logs={logs}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default ZonePage