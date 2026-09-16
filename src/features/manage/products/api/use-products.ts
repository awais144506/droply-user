/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ProductItem } from "../types/product";
import { productKeys } from "./product-keys";
import { productApi } from "./product.service";

// 1. Fetch All Products for a Branch
export function useProducts(branchId: string) {
    return useQuery({
        queryKey: productKeys.branchList(branchId || ""),
        queryFn: () => productApi.getAllProducts(branchId),
        select: (products) => {
            const totalItems = products.length;
            const lowStockCount = products.filter(p => p.currentStock <= p.lowStockThreshold).length;
            const returnablesCount = products.filter(p => p.trackingType === "RETURNABLE").length;
            const recipeItemsCount = products.filter(p => p.hasRecipe).length;
            const productOptions = products?.filter(p => p.trackingType === "RETURNABLE").map(p => ({ value: p.id, label: p.name })) || [];
            const quickSaleOptions = products?.map(p =>
            ({
                id: p.id, name: p.name,
                price: p.salePrice,
                currentStock: p.currentStock,
                trackingType: p.trackingType,
                lowStockThreshold: p.lowStockThreshold,
                securityDeposit: p.securityDeposit
            })) || [];

            const bomOptions = products?.map(p => ({
                id: p.id,
                name: p.name,
                currentStock: p.currentStock,
                lowStockThreshold: p.lowStockThreshold,
                value: p.id,
                label: p.name,
                salePrice: p.salePrice,
                unitCost: p.unitCost,
            })) || [];

            return {
                products,
                stats: {
                    totalItems,
                    lowStockCount,
                    returnablesCount,
                    recipeItemsCount
                },
                productOptions,
                quickSaleOptions,
                bomOptions,
            }

        },
        staleTime: 5 * 60 * 1000,
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



// 6. Activity Logs
export function useProductLogs(branchId: string) {
    return useQuery({
        queryKey: productKeys.branchLogs(branchId),
        queryFn: () => productApi.getProductLogs(branchId),
        enabled: !!branchId,
    });
}