/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api-client";
import { ReturnsApiResponse, PurchaseReturn } from "../types/returns";
import { CreateReturnFormValues } from "../schema/returns-schema";

const API = '/supply/return/user'
export const returnApi = {
    getAll: async (branchId: string): Promise<ReturnsApiResponse> => {
        return await apiClient.get(`${API}`);
    },

    getById: async (id: string): Promise<PurchaseReturn> => {
        return await apiClient.get(`${API}/${id}`);
    },

    create: async (payload: CreateReturnFormValues): Promise<PurchaseReturn> => {
        return await apiClient.post(`${API}`, payload);
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${API}/${id}`);
    },
    resolve: async (id: string, payload: any): Promise<PurchaseReturn> => {
        return await apiClient.patch(`${API}/${id}/resolve`, payload);
    }
};