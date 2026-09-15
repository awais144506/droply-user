/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api-client";
import { Vehicle, FuelExpense } from "../types/fleet";
import { VehicleFormValues, FuelExpenseFormValues } from "../schema/fleet.schema";

export const fleetApi = {
    // 1. Fetch Vehicles
    getVehicles: async (branchId: string): Promise<Vehicle[]> => {
        return apiClient.get<any, Vehicle[]>("/fleet/vehicles", {
            params: { branchId }
        });
    },

    // 2. Create Vehicle
    createVehicle: async (newVehicle: VehicleFormValues): Promise<Vehicle> => {
        return apiClient.post<any, Vehicle>("/fleet/vehicles", newVehicle);
    },

    // 3. Fetch Fuel Expenses
    getFuelExpenses: async (vehicleId?: string): Promise<FuelExpense[]> => {
        return apiClient.get<any, FuelExpense[]>("/fleet/fuel", {
            params: { vehicleId }
        });
    },

    // 4. Create Fuel Expense
    createFuelExpense: async (newExpense: FuelExpenseFormValues): Promise<FuelExpense> => {
        return apiClient.post<any, FuelExpense>("/fleet/fuel", newExpense);
    }
}