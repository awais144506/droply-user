import { apiClient } from "@/lib/api-client";
import { PurchaseReturn } from "../types/returns";
import { CreateReturnFormValues } from "../schema/returns-schema";

export const returnApi = {
    getAll: async (branchId: string): Promise<PurchaseReturn[]> => {
        return await apiClient.get(`/supply/returns/branch/${branchId}`);
    },

    getById: async (id: string): Promise<PurchaseReturn> => {
        return await apiClient.get(`/supply/returns/${id}`);
    },

    create: async (payload: CreateReturnFormValues): Promise<PurchaseReturn> => {
        return await apiClient.post('/supply/returns', payload);
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/supply/returns/${id}`);
    }
};