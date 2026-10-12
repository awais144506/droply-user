import { apiClient } from "@/lib/api-client";
import { ProductListResponse, ProductItem } from "../types/product";
import { CreateItemFormData } from "../schema/create-item.schema";

export const productApi = {
    getAllProducts: async (branchId: string): Promise<ProductListResponse> => {
        return await apiClient.get(`/product/branch/${branchId}`)
    },
    getProduct: async (id: string): Promise<ProductItem> => {
        return await apiClient.get(`/product/${id}`)
    },
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