"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import PageHeader from "@/utils/page-header"
import ActivityLogsCard from "@/utils/activity-logs-card"
import { useZoneLogs, useZones } from "@/features/zones/api/use-zones"
import { useRole } from "@/hooks/use-role"
import Loading from "@/app/loading"
import ErrorBoundary from "@/app/error"
import { ZoneStats } from "@/features/zones/components/zone-stats"
import { ZoneCard } from "@/features/zones/components/zone-card"

const ZonePage = () => {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: logs = [] } = useZoneLogs(branchId);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isError, error, isLoading } = useZones(branchId);
  const zones = data?.zones || [];
  const stats = data?.stats || { totalZones: 0, totalCustomers: 0, totalLedger: 0, totalReturnables: 0 };

  const filteredZones = zones.filter((zone) =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search zones by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
            />
          </div>

          <ZoneCard zones={filteredZones} />
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