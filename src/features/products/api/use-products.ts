/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ProductItem } from "../types/product-item";
import { CreateItemFormData } from "../schema/create-item.schema";
import { ActivityLog } from "@/types/ActivityLog";

export const productKeys = {
    all: ["branch-products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    branchList: (branchId?: string) => [...productKeys.lists(), branchId] as const,
    details: () => [...productKeys.all, "detail"] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
    logs: () => [...productKeys.all, "logs"] as const,
    branchLogs: (branchId?: string) => [...productKeys.logs(), branchId] as const,
};

// 1. Fetch All Products for a Branch
export function useProducts(branchId?: string | null) {
    return useQuery({
        queryKey: productKeys.branchList(branchId || ""),
        queryFn: async (): Promise<ProductItem[]> => {
            const response: any = await apiClient.get(`/product/branch/${branchId}`);
            const data = response?.data || response;

            return data.map((item: any) => ({
                ...item,
                stockOnHand: item.currentStock,
            }));
        },
        enabled: !!branchId,
    });
}

// 2. Fetch Single Product (for Edit Page)
export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: async (): Promise<ProductItem> => {
            const response: any = await apiClient.get(`/product/${id}`);
            const data = response?.data || response;

            return {
                ...data,
                stockOnHand: data.currentStock,
            };
        },
        enabled: !!id,
    });
}

// 3. Create Product
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateItemFormData) => {
            return apiClient.post(`/product`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.logs() });
        },
    });
}

// 4. Update Product
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: CreateItemFormData }) => {
            return apiClient.patch(`/product/${id}`, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: productKeys.logs() });
        },
    });
}

// 5. Delete Product
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return apiClient.delete(`/product/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
            queryClient.invalidateQueries({ queryKey: productKeys.logs() });
        },
    });
}

// 6. Activity Logs
export function useProductLogs(branchId?: string) {
    return useQuery({
        queryKey: productKeys.branchLogs(branchId),
        queryFn: async () => {
            if (!branchId) return [];
            const response = await apiClient.get<ActivityLog[]>(`/product/logs/${branchId}`);
            return response;
        },
        enabled: !!branchId,
    });
}