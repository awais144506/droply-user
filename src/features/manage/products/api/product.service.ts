import { apiClient } from "@/lib/api-client";
import { ProductList, ProductItem } from "../types/product";
import { ActivityLog } from "@/types/ActivityLog";
import { CreateItemFormData } from "../schema/create-item.schema";

export const productApi = {
    getAllProducts: async (branchId: string): Promise<ProductList[]> => {
        return await apiClient.get(`/product/branch/${branchId}`)
    },
    getProduct: async (id: string): Promise<ProductItem> => {
        return await apiClient.get(`/product/${id}`)
    },
    getProductLogs: async (branchId: string): Promise<ActivityLog[]> => {
        return await apiClient.get(`/product/logs/${branchId}`)
    },

    //Mutation
    createNewProduct: async (newProduct: CreateItemFormData): Promise<ProductItem> => {
        return await apiClient.post('/product', newProduct);
    },
    updateProduct: async (id: string, updateProduct: CreateItemFormData): Promise<ProductItem> => {
        return await apiClient.patch(`/product/${id}`, updateProduct);
    },
    deletProduct: async (id: string) => {
        return await apiClient.delete(`/product/${id}`);
    },
}