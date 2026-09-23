import { apiClient } from "@/lib/api-client";
import { ProductionResponse, CreateProductionPayload, ProductionBatch } from "../types/production";

export const productionService = {
    getAll: async (branchId: string): Promise<ProductionResponse> => {
        return await apiClient.get(`/production/batch?branchId=${branchId}`);
    },

    create: async (payload: CreateProductionPayload): Promise<ProductionBatch> => {
        return await apiClient.post("/production/batch", payload);
    },
};