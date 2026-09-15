"use client";
import { useSearchParams } from "next/navigation";
import FleetMainPageHeader from "@/lib/utils/components/MainPageHeader";
import { FleetStats } from "@/features/admin/fleet/components/fleet-stats";
import { useVehicles } from "@/features/admin/fleet/api/use-fleet";
import { useRole } from "@/lib/hooks/use-role";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { FleetTable } from "@/features/admin/fleet/components/fleet-table";


export default function FleetManagementPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const { branchId } = useRole();
  const { data, isLoading, isError, error } = useVehicles(branchId, status, search);
  const { list: vehicles, stats } = data || { list: [], stats: { total: 0, active: 0, inMaintenance: 0, retired: 0 } };

  if (isLoading) return <Loading />
  if (isError) return <ErrorBoundary error={error.message} />
  return (
    <div className="p-6 space-y-8">
      <FleetMainPageHeader
        heading="Fleet & Fuel"
        description="Manage your delivery vehicles, track maintenance, and monitor fuel expenses."
        href="/admin/fleet/create-fleet"
        btnText="Add Vehicle"
      />
      <FleetStats
        total={stats.total}
        active={stats.active}
        inMaintenance={stats.inMaintenance}
        retired={stats.retired}
      />
      <DataTableFilterBar
        searchPlaceholder="Search registration or model..."
        searchParamName="search"
        tabParamName="status"
        tabs={[
          { label: "All", value: "" },
          { label: "Active", value: "ACTIVE" },
          { label: "Maintenance", value: "MAINTENANCE" },
          { label: "Retired", value: "RETIRED" }
        ]}
      />
      <FleetTable
        vehicles={vehicles}
      />
    </div>
  );
}