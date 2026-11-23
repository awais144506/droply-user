"use client";

import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import ActivityLogsCard from "@/lib/utils/components/ActivityLogsMainPage";
import { useZones } from "@/features/manage/zones/api/use-zones";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { useRole } from "@/lib/hooks/use-role";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import { ZoneStats } from "@/features/manage/zones/components/main/zone-stats";
import { ZoneCard } from "@/features/manage/zones/components/main/zone-card";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { useSearchParams } from "next/navigation";
import { FileDown, MapPin } from "lucide-react";
import { exportZonesToBwPdf } from "@/lib/utils/functions/generatePdfs/export-zones-pdf";

const ZonePage = () => {
  const { branchId } = useRole();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;

  const {
    data,
    isError,
    error,
    isLoading: isLoadingZones,
    refetch,
    isRefetching,
  } = useZones(branchId, search);
  const { data: branchSettings } = useBranchSettings(branchId);

  const zones = data?.zones || [];
  const stats = data?.stats || {
    totalZones: 0,
    totalCustomers: 0,
    totalLedger: 0,
    totalReturnables: 0,
  };
  const logs = data?.logs || [];

  const handleDownloadPdf = () => {
    exportZonesToBwPdf({
      zones,
      stats,
      branchSettings,
      search,
    });
  };

  if (isLoadingZones || !data?.zones) return <Loading text="Loading Zones..." />;
  if (isError) return <ErrorBoundary error={error.message} />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <MainPageHeader
        heading="Delivery Zones"
        description="Manage distribution sectors, route riders, and track total liabilities per area."
        href="/manage/zones/create-zone"
        btnText="Create Zone"
        onRefresh={refetch}
        isRefreshing={isRefetching}
        icon={MapPin}
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
            rightSlot={
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={zones.length === 0}
                title="Download delivery zones as B&W PDF"
                className="h-11 px-3.5 bg-slate-600 hover:bg-slate-900 text-white border border-slate-200 hover:border-slate-900 rounded-xl flex items-center gap-2 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FileDown className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            }
          />
          <ZoneCard zones={zones} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ActivityLogsCard title="Zone Activity Logs" logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonePage;