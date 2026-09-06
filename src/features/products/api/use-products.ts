import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface ProductItem {
    id: string;
    name: string;
    sku: string;
    category: "FINISHED_GOOD" | "RAW_MATERIAL" | "PACKAGING" | "EQUIPMENT";
    trackingType: "OUTRIGHT" | "RETURNABLE";
    unitCost: number;
    salePrice: number;
    stockOnHand: number;
    lowStockThreshold: number;
    hasRecipe: boolean;
    isActive: boolean;
    recipeIngredients?: {
        id: string;
        quantity: number;
        childItem: {
            name: string;
            sku: string;
        };
    }[];
}

export const productKeys = {
    all: ["branch-products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    branchList: (branchId?: string) => [...productKeys.lists(), branchId] as const,
    details: () => [...productKeys.all, "detail"] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
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
        mutationFn: async (payload: any) => {
            // Payload should contain { branchId, ...formData }
            return apiClient.post(`/product`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

// 4. Update Product
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            return apiClient.patch(`/product/${id}`, data);
        },
        onSuccess: (_, variables) => {
            // Refresh both the list and the specific item's cache
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
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
        },
    });
}