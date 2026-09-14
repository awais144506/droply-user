// src/features/fleet/api/use-vehicles.ts
import { useQuery } from "@tanstack/react-query";
import { fleetKeys } from "./query-keys";
import { fleetApi } from "./fleet.service";
import { displayPakistaniPhone } from "@/lib/utils/setFormat";

export function useVehicles(branchId: string, statusFilter?: string, searchFilter?: string) {
  return useQuery({
    queryKey: fleetKeys.vehicles.list({ branchId }),
    queryFn: () => fleetApi.getVehicles(branchId),
    select: (vehicles) => {
      const activeCount = vehicles.filter(v => v.status === "ACTIVE").length;
      const maintenanceCount = vehicles.filter(v => v.status === "MAINTENANCE").length;
      const retiredCount = vehicles.filter(v => v.status === "RETIRED").length;

      const filteredVehicles = vehicles.filter(vehicle => {
        const matchesStatus = statusFilter ? vehicle.status === statusFilter : true;
        const searchLower = searchFilter?.toLowerCase() || "";
        const matchesSearch = searchFilter
          ? (vehicle.registration?.toLowerCase() || "").includes(searchLower) ||
          (vehicle.modelInfo?.toLowerCase() || "").includes(searchLower)
          : true;
        return matchesStatus && matchesSearch;
      });
      const formattedList = filteredVehicles.map(vehicle => ({
        ...vehicle,
        driverPhone: displayPakistaniPhone(vehicle.assignedTo?.phone),
        displayName: `${vehicle.modelInfo} (${vehicle.registration})`,
      }));

      const vehicleOptions = vehicles.map(z => ({ value: z.id, label: z.registration }));

      return {
        list: formattedList,
        vehicleOptions,
        stats: {
          total: vehicles.length,
          active: activeCount,
          inMaintenance: maintenanceCount,
          retired: retiredCount,
        }
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}