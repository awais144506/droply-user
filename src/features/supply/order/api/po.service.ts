import { apiClient } from "@/lib/api-client";
import { PurchaseOrder } from "../types/po";
import { CreatePOFormData } from "../schema/create-po-schema";

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
    }
};