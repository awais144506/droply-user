/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api-client";
import { ProductionResponse, CreateProductionPayload, ProductionBatch } from "../types/production";

const API = '/production/user'
export const productionService = {
    getAll: async (): Promise<ProductionResponse> => {
        return await apiClient.get(`${API}`);
    },

    create: async (payload: CreateProductionPayload): Promise<ProductionBatch> => {
        return await apiClient.post(`${API}`, payload);
    },
    getBatch: async (id: string): Promise<ProductionBatch> => {
        return await apiClient.get(`${API}/${id}`);
    },
    update: async (id: string, payload: { supervisorName?: string; productionDate?: string }): Promise<ProductionBatch> => {
        return await apiClient.patch(`${API}/${id}`, payload);
    },
    remove: async (id: string) => {
        return await apiClient.delete(`${API}/${id}`);
    },
    finalize: async (id: string, payload: { actualYield: number; wastage: any[] }): Promise<ProductionBatch> => {
        return await apiClient.patch(`${API}/${id}/finalize`, payload);
    },
};