import { apiClient } from "@/lib/api-client";
import { ProductListResponse, ProductItem } from "../types/product";
import { CreateItemFormData } from "../schema/create-item.schema";

const API = '/product/user';

export const productApi = {
    getAllProducts: async (): Promise<ProductListResponse> => {
        return await apiClient.get(`${API}`);
    },
    
    getProduct: async (id: string): Promise<ProductItem> => {
        return await apiClient.get(`${API}/${id}`);
    },
    
    createNewProduct: async (newProduct: CreateItemFormData): Promise<ProductItem> => {
        return await apiClient.post(`${API}`, newProduct);
    },
    
    updateProduct: async (id: string, updateProduct: Partial<CreateItemFormData>): Promise<ProductItem> => {
        return await apiClient.patch(`${API}/${id}`, updateProduct);
    },
    
    toggleProductStatus: async (id: string): Promise<ProductItem> => {
        return await apiClient.patch(`${API}/${id}/status`, {});
    },
    
    deleteProduct: async (id: string) => {
        return await apiClient.delete(`${API}/${id}`);
    },
};