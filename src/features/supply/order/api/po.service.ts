import { apiClient } from "@/lib/api-client";
import { PurchaseOrder,POResponse } from "../types/po";
import { CreatePOFormData } from "../schema/create-po-schema";

const API = '/po/user'
export const poApi = {
    create: async (payload: CreatePOFormData): Promise<PurchaseOrder> => {
        return await apiClient.post(`${API}`, payload);
    },

    getAll: async (): Promise<POResponse> => {
        return await apiClient.get(`${API}`);
    },
    getById: async (id: string): Promise<PurchaseOrder> => {
        return await apiClient.get(`${API}/${id}`);
    },
    update: async (id: string, payload: CreatePOFormData): Promise<PurchaseOrder> => {
        return await apiClient.patch(`${API}/${id}`, payload);
    },
    delete: async (id: string) => {
        return await apiClient.delete(`${API}/${id}`)
    },
    updateStatus: async (id: string) => {
        return await apiClient.patch(`${API}/${id}/receive`);
    },
    undoStatus: async (id: string) => {
        return await apiClient.patch(`${API}/${id}/undo`)
    },
};