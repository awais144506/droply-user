import { CreateItemFormData } from "../schema/create-item.schema";

export function formatProductPayload(data: CreateItemFormData, branchId?: string) {
    // 1. Automatically calculate the exact profit margin
    const calculatedMargin = data.salePrice > 0
        ? (((data.salePrice - data.unitCost) / data.salePrice) * 100)
        : 0;

    return {
        ...(branchId ? { branchId } : {}),
        category: data.category,
        trackingType: data.trackingType,
        name: data.name,
        sku: data.sku,
        unitCost: data.unitCost,
        salePrice: data.salePrice,
        profitMargin: parseFloat(calculatedMargin.toFixed(2)),
        openingStock: data.openingStock,
        lowStockThreshold: data.lowStockThreshold,
        securityDeposit: data.trackingType === "RETURNABLE" ? (data.securityDeposit || 0) : 0,
        hasRecipe: data.hasRecipe,
        recipeIngredients: data.hasRecipe && data.recipeItems
            ? data.recipeItems.map((item) => ({
                childItemId: item.rawMaterialId,
                quantity: item.quantityRequired
            }))
            : []
    };
}