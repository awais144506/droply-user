import { apiClient } from "@/lib/api-client";
import { SupplierList } from "../types/supplier";
import { SupplierFormData } from "../schema/create-supplier-schema";

const API = '/supplier/user'
export const supplierApi = {
    getAll: async (): Promise<SupplierList[]> => {
        return await apiClient.get(`${API}`);
    },

    getById: async (id: string): Promise<SupplierList> => {
        return await apiClient.get(`${API}/${id}`);
    },

    create: async (payload: SupplierFormData): Promise<SupplierList> => {
        return await apiClient.post(`${API}`, payload);
    },

    update: async (id: string, payload: SupplierFormData): Promise<SupplierList> => {
        return await apiClient.patch(`${API}/${id}`, payload);
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${API}/${id}`);
    }
};