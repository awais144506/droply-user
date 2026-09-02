import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api-client";

export interface ProductItem {
    id: string;
    name: string;
    sku: string;
    category: "FINISHED_GOOD" | "RAW_MATERIAL" | "RETURNABLE_CONTAINER" | "EQUIPMENT";
    trackingType: "OUTRIGHT" | "RETURNABLE";
    unitCost: number;
    salePrice: number;
    stockOnHand: number;
    lowStockThreshold: number;
    hasRecipe: boolean;
}

export function useProducts(branchId: string) {
    return useQuery({
        queryKey: ["products", branchId],
        queryFn: async (): Promise<ProductItem[]> => {
            // Mock data matching your screenshot perfectly
            return [
                { id: "1", name: "19-Liter Water Refill (Sealed)", sku: "WTR-19L-FL", category: "FINISHED_GOOD", trackingType: "OUTRIGHT", unitCost: 65, salePrice: 200, stockOnHand: 148, lowStockThreshold: 20, hasRecipe: false },
                { id: "2", name: "19L Polycarbonate Empty Bottle", sku: "BTL-19L-EMPTY", category: "RETURNABLE_CONTAINER", trackingType: "RETURNABLE", unitCost: 850, salePrice: 1200, stockOnHand: 520, lowStockThreshold: 50, hasRecipe: false },
                { id: "3", name: "12L & 19L Smart Bottle Cap", sku: "CAP-55MM-BLU", category: "RAW_MATERIAL", trackingType: "OUTRIGHT", unitCost: 14.5, salePrice: 30, stockOnHand: 1850, lowStockThreshold: 500, hasRecipe: true },
                { id: "4", name: "12L Bottle with Grip Handle", sku: "BTL-12L-HNDL", category: "RETURNABLE_CONTAINER", trackingType: "RETURNABLE", unitCost: 380, salePrice: 650, stockOnHand: 18, lowStockThreshold: 30 , hasRecipe: false},
                { id: "5", name: "1500ml Bottled Water (Pack of 6)", sku: "PET-1500ML-PK", category: "FINISHED_GOOD", trackingType: "OUTRIGHT", unitCost: 290, salePrice: 420, stockOnHand: 3040, lowStockThreshold: 100, hasRecipe: false },
                { id: "6", name: "Manual Hand Water Dispenser", sku: "PUMP-MANUAL-DSP", category: "EQUIPMENT", trackingType: "OUTRIGHT", unitCost: 320, salePrice: 550, stockOnHand: 15, lowStockThreshold: 25, hasRecipe: true },
            ];
        },
        enabled: Boolean(branchId),
    });
}