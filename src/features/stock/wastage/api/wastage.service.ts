import { apiClient } from "@/lib/api-client";
import { WastageResponse, WastageRecord } from "../types/wastage";
import { CreateWastageFormValues } from "../schema/create-wastage-schema";

export const wastageService = {
  getAll: async (branchId: string): Promise<WastageResponse> => {
    return await apiClient.get(`/wastage?branchId=${branchId}`);
  },
  
  create: async (payload: CreateWastageFormValues & { branchId: string }): Promise<WastageRecord> => {
    return await apiClient.post("/wastage", payload);
  },

  delete: async (id: string): Promise<void> => {
    return await apiClient.delete(`/wastage/${id}`);
  },
};