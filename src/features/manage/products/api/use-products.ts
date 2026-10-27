/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductItem, ProductList } from "../types/product";
import { productKeys } from "./product-keys";
import { productApi } from "./product.service";

export function useProducts(branchId?: string) {
    return useQuery({
        queryKey: productKeys.branchList(branchId),
        queryFn: () => productApi.getAllProducts(),
        enabled: Boolean(branchId),
        staleTime: 5 * 60 * 1000,
        select: (data) => {
            const products = data?.products || [];
            const logs = data?.logs || [];

            let lowStockCount = 0;
            let returnablesCount = 0;
            let recipeItemsCount = 0;
            let activeItemsCount = 0;
            let inactiveItemsCount = 0;

            const lowStockProducts: ProductList[] = [];
            const productOptions: { value: string; label: string }[] = [];
            const quickSaleOptions: any[] = [];
            const bomOptions: any[] = [];
            const productionOptions: any[] = [];

            // Single-pass loop to compute all stats and dropdown options in O(N)
            for (const p of products) {
                const currentStock = p.currentStock ?? 0;
                const lowStockThreshold = p.lowStockThreshold ?? 10;
                const salePrice = Number(p.salePrice ?? 0);
                const unitCost = Number(p.unitCost ?? 0);
                const unitOfMeasure = p.unitOfMeasure || "PIECE";

                // 1. Active / Inactive Stats Tracking
                if (p.isActive) {
                    activeItemsCount++;
                } else {
                    inactiveItemsCount++;
                }

                // 2. Low Stock Check (Only track active low-stock items or all according to biz rule)
                if (currentStock <= lowStockThreshold) {
                    lowStockCount++;
                    lowStockProducts.push(p);
                }

                // 🔥 If product is inactive, skip adding it to transactional/POS/quotation options
                if (!p.isActive) {
                    continue; 
                }

                // 3. Returnables Check (Active only)
                if (p.trackingType === "RETURNABLE") {
                    returnablesCount++;
                    productOptions.push({ value: p.id, label: p.name });
                }

                // 4. Recipe Check
                if (p.hasRecipe) {
                    recipeItemsCount++;
                }

                // 5. Quick Sale / POS Options (Active only)
                quickSaleOptions.push({
                    id: p.id,
                    name: p.name,
                    code: p.productCode,
                    price: salePrice,
                    stock: currentStock,
                    trackingType: p.trackingType,
                    lowStock: lowStockThreshold,
                    security: p.securityDeposit ?? 0,
                    unit: unitOfMeasure,
                    priceTiers: p.priceTiers || [],
                });

                // 6. Unified BOM & Quotation Options (Active only)
                bomOptions.push({
                    id: p.id,
                    value: p.id,
                    name: p.name,
                    label: p.name,
                    productCode: p.productCode,
                    currentStock,
                    lowStockThreshold,
                    salePrice,
                    unitCost,
                    category: p.category,
                    unit: unitOfMeasure,
                    unitOfMeasure,
                });

                // 7. Production WIP Options (Active with recipes)
                if (p.hasRecipe) {
                    productionOptions.push({
                        value: p.id,
                        label: p.name,
                        hasRecipe: p.hasRecipe,
                        currentStock,
                        category: p.category,
                        recipe:
                            p.recipeIngredients?.map((ri) => ({
                                rawMaterialId: ri.childItemId,
                                name: ri.childItem?.name || "Unknown Material",
                                quantityNeeded: ri.quantity,
                                unitOfMeasure: ri.childItem?.unitOfMeasure || "PIECE",
                                currentStock: ri.childItem?.currentStock ?? 0,
                            })) || [],
                    });
                }
            }

            return {
                products,
                logs,
                stats: {
                    totalItems: products.length,
                    activeItemsCount,
                    inactiveItemsCount,
                    lowStockCount,
                    returnablesCount,
                    recipeItemsCount,
                },
                productOptions,
                quickSaleOptions,
                bomOptions,
                productOptionsQuotation: bomOptions, // Shares unified structure without re-mapping
                productionOptions,
                lowStockProducts,
            };
        },
    });
}

export function useProduct(id?: string) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: productKeys.detail(id || ""),
        queryFn: async (): Promise<ProductItem & { stockOnHand: number }> => {
            const data = await productApi.getProduct(id!);
            return {
                ...data,
                stockOnHand: data.currentStock ?? 0,
            };
        },
        initialData: () => {
            if (!id) return undefined;

            // Search across all cached product lists to find the item instantly
            const queries = queryClient.getQueriesData<any>({ queryKey: productKeys.lists() });

            for (const [, cachedData] of queries) {
                if (cachedData?.products && Array.isArray(cachedData.products)) {
                    const found = cachedData.products.find((p: any) => p.id === id);
                    if (found) {
                        return {
                            ...found,
                            stockOnHand: found.currentStock ?? 0,
                        };
                    }
                }
            }
            return undefined;
        },
        enabled: Boolean(id),
        staleTime: 5 * 60 * 1000,
    });
}