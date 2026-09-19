import { apiClient } from "@/lib/api-client";
import { SupplierList } from "../types/supplier";
import { SupplierFormData } from "../schema/create-supplier-schema";

export const supplierApi = {
    getAll: async (branchId: string): Promise<SupplierList[]> => {
        return await apiClient.get(`/suppliers/branch/${branchId}`);
    },

    getById: async (id: string): Promise<SupplierList> => {
        return await apiClient.get(`/suppliers/${id}`);
    },

    create: async (payload: SupplierFormData): Promise<SupplierList> => {
        return await apiClient.post("/suppliers", payload);
    },

    update: async (id: string, payload: SupplierFormData): Promise<SupplierList> => {
        return await apiClient.patch(`/suppliers/${id}`, payload);
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/suppliers/${id}`);
    }
};