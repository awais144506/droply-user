/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api-client";
import { ProductionResponse, CreateProductionPayload, ProductionBatch } from "../types/production";

export const productionService = {
    getAll: async (branchId: string): Promise<ProductionResponse> => {
        return await apiClient.get(`/production/batch?branchId=${branchId}`);
    },

    create: async (payload: CreateProductionPayload): Promise<ProductionBatch> => {
        return await apiClient.post("/production/batch", payload);
    },
    getBatch: async (id: string): Promise<ProductionBatch> => {
        return await apiClient.get(`/production/batch/${id}`);
    },
    update: async (id: string, payload: { supervisorName?: string; productionDate?: string }): Promise<ProductionBatch> => {
        return await apiClient.patch(`/production/batch/${id}`, payload);
    },
    remove: async (id: string) => {
        return await apiClient.delete(`/production/batch/${id}`);
    },
    finalize: async (id: string, payload: { actualYield: number; wastage: any[] }): Promise<ProductionBatch> => {
        return await apiClient.patch(`/production/batch/${id}/finalize`, payload);
    },
};