import { useQuery } from "@tanstack/react-query";

export type VehicleStatus = "ACTIVE" | "IN_MAINTENANCE" | "OUT_OF_SERVICE";
export type VehicleType = "TRUCK_MAZDA" | "MINI_PICKUP" | "CARGO_TRICYCLE" | "MOTORCYCLE";

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: VehicleType;
  capacityDesc: string;
  assignedRider: string;
  status: VehicleStatus;
  monthlyFuelCost: number;
  lastMaintenanceDate: string;
}

export function useFleet(branchId: string) {
  return useQuery({
    queryKey: ["fleet", branchId],
    queryFn: async (): Promise<Vehicle[]> => {
      return [
        {
          id: "1", registrationNumber: "LXZ-9921", type: "TRUCK_MAZDA", capacityDesc: "350 Bottles (19L)",
          assignedRider: "Chaudhry Bilal", status: "ACTIVE", monthlyFuelCost: 45000, lastMaintenanceDate: "2026-08-15"
        },
        {
          id: "2", registrationNumber: "SAQ-402", type: "MINI_PICKUP", capacityDesc: "150 Bottles (19L)",
          assignedRider: "Rider Usman", status: "ACTIVE", monthlyFuelCost: 28500, lastMaintenanceDate: "2026-07-22"
        },
        {
          id: "3", registrationNumber: "RI-99", type: "CARGO_TRICYCLE", capacityDesc: "40 Bottles (19L)",
          assignedRider: "Rider Ali", status: "IN_MAINTENANCE", monthlyFuelCost: 12000, lastMaintenanceDate: "2026-09-01"
        },
        {
          id: "4", registrationNumber: "MN-4412", type: "MOTORCYCLE", capacityDesc: "Khata/Recovery",
          assignedRider: "Manager Tariq", status: "ACTIVE", monthlyFuelCost: 8500, lastMaintenanceDate: "2026-08-30"
        }
      ];
    },
    enabled: Boolean(branchId),
  });
}