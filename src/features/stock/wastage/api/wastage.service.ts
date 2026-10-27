import { apiClient } from "@/lib/api-client";
import { WastageResponse, WastageRecord } from "../types/wastage";
import { CreateWastageFormValues } from "../schema/create-wastage-schema";

const API = '/wastage/user'
export const wastageService = {
  getAll: async (): Promise<WastageResponse> => {
    return await apiClient.get(`${API}`);
  },

  create: async (payload: CreateWastageFormValues & { branchId: string }): Promise<WastageRecord> => {
    return await apiClient.post(`${API}`, payload);
  },

  delete: async (id: string): Promise<void> => {
    return await apiClient.delete(`${API}/${id}`);
  },
};