/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api-client";
import { Vehicle, VehicleExpense } from "../types/fleet";
import { VehicleFormValues, VehicleExpenseFormValues } from "../schema/fleet.schema";

export const fleetApi = {
    // --- VEHICLE ROUTES ---

    getVehicles: async (branchId: string): Promise<Vehicle[]> => {
        return apiClient.get<any, Vehicle[]>("/fleet/vehicles", {
            params: { branchId }
        });
    },

    getVehicle: async (id: string): Promise<Vehicle> => {
        return apiClient.get(`/fleet/vehicles/${id}`);
    },

    createVehicle: async (newVehicle: VehicleFormValues): Promise<Vehicle> => {
        return apiClient.post<any, Vehicle>("/fleet/vehicles", newVehicle);
    },

    updateVehicle: async (id: string, updateData: Partial<VehicleFormValues>): Promise<Vehicle> => {
        return apiClient.patch<any, Vehicle>(`/fleet/vehicles/${id}`, updateData);
    },

    deleteVehicle: async (id: string): Promise<void> => {
        return apiClient.delete(`/fleet/vehicles/${id}`);
    },

    getVehicleExpenses: async (vehicleId?: string): Promise<VehicleExpense[]> => {
        return apiClient.get<any, VehicleExpense[]>("/fleet/expenses", {
            params: { vehicleId }
        });
    },

    createVehicleExpense: async (newExpense: VehicleExpenseFormValues): Promise<VehicleExpense> => {
        return apiClient.post<any, VehicleExpense>("/fleet/expenses", newExpense);
    },

    deleteExpenseRecord: async (id: string) => {
        return apiClient.delete(`/fleet/expenses/${id}`)
    }
};