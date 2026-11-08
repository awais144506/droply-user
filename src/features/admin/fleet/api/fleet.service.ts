/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api-client";
import { Vehicle, VehicleExpense } from "../types/fleet";
import { VehicleFormValues, VehicleExpenseFormValues } from "../schema/fleet.schema";
import { VehicleListResponse } from "../types/fleet";


const API = '/vehicle/user'

export const fleetApi = {
    // --- VEHICLE ROUTES ---

    getVehicles: async (): Promise<VehicleListResponse> => {
        return apiClient.get(`${API}`);
    },

    getVehicle: async (id: string): Promise<Vehicle> => {
        return apiClient.get(`${API}/${id}`);
    },

    createVehicle: async (newVehicle: VehicleFormValues): Promise<Vehicle> => {
        return apiClient.post<any, Vehicle>(`${API}`, newVehicle);
    },

    updateVehicle: async (id: string, updateData: Partial<VehicleFormValues>): Promise<Vehicle> => {
        return apiClient.patch<any, Vehicle>(`${API}/${id}`, updateData);
    },

    deleteVehicle: async (id: string): Promise<void> => {
        return apiClient.delete(`${API}/${id}`);
    },

    getVehicleExpenses: async (id?: string): Promise<VehicleExpense[]> => {
        return apiClient.get<any, VehicleExpense[]>(`${API}/expense/${id}`);
    },

    createVehicleExpense: async (newExpense: VehicleExpenseFormValues): Promise<VehicleExpense> => {
        return apiClient.post<any, VehicleExpense>(`${API}/expense`, newExpense);
    },

    deleteExpenseRecord: async (id: string) => {
        return apiClient.delete(`${API}/expense/${id}`)
    }
};