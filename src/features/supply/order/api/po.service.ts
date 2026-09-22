import { apiClient } from "@/lib/api-client";
import { PurchaseOrder } from "../types/po";
import { CreatePOFormData } from "../schema/create-po-schema";
import { ActivityLog } from "@/types/ActivityLog";
export const poApi = {
    create: async (payload: CreatePOFormData): Promise<PurchaseOrder> => {
        return await apiClient.post("/po", payload);
    },

    getAll: async (branchId: string): Promise<PurchaseOrder[]> => {
        return await apiClient.get(`/po?branchId=${branchId}`);
    },
    getById: async (id: string): Promise<PurchaseOrder> => {
        return await apiClient.get(`/po/${id}`);
    },
    update: async (id: string, payload: CreatePOFormData): Promise<PurchaseOrder> => {
        return await apiClient.patch(`/po/${id}`, payload);
    },
    delete: async (id: string) => {
        return await apiClient.delete(`/po/${id}`)
    },
    updateStatus: async (id: string) => {
        return await apiClient.patch(`/po/${id}/receive`);
    },
    undoStatus: async (id: string) => {
        return await apiClient.patch(`/po/${id}/undo`)
    },
    getPoLogs: async (branchId: string): Promise<ActivityLog[]> => {
        return await apiClient.get(`/po/${branchId}/logs`);
    }
};