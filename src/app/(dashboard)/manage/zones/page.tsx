"use client"
import MainPageHeader from "@/lib/utils/components/MainPageHeader"
import ActivityLogsCard from "@/lib/utils/components/ActivityLogsMainPage"
import { useZoneLogs, useZones } from "@/features/manage/zones/api/use-zones"
import { useRole } from "@/lib/hooks/use-role"
import Loading from "@/app/loading"
import ErrorBoundary from "@/app/error"
import { ZoneStats } from "@/features/manage/zones/components/main/zone-stats"
import { ZoneCard } from "@/features/manage/zones/components/main/zone-card"
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar"
import { useSearchParams } from "next/navigation"


const ZonePage = () => {
  const { branchId } = useRole();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const { data: logs = [], isLoading: isLoadingLogs } = useZoneLogs(branchId);
  const { data, isError, error, isLoading: isLoadingZones } = useZones(branchId, search);
  const zones = data?.zones || [];
  const stats = data?.stats || { totalZones: 0, totalCustomers: 0, totalLedger: 0, totalReturnables: 0 };

  if (isLoadingZones) return <Loading text="Loading Zones..."/>
  if (isError && !data?.zones) return <ErrorBoundary error={error.message} />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <MainPageHeader
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
        isLoadingZones={isLoadingZones}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 space-y-4">
          <DataTableFilterBar
            searchPlaceholder="Search by zone name..."
            searchParamName="search"
          />
          <ZoneCard zones={zones} />
        </div>


        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ActivityLogsCard
              title="Zone Activity Logs"
              logs={logs}
              isLoading={isLoadingLogs}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default ZonePage