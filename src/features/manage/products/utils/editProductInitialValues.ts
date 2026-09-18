import { ProductItem } from "../types/product";
export const mappedProductData = (product: ProductItem | undefined) => {
    if (!product) return undefined;
    const mappedInitialData = {
        name: product.name,
        category: product.category,
        trackingType: product.trackingType,
        unitCost: product.unitCost,
        salePrice: product.salePrice,
        openingStock: product.stockOnHand,
        lowStockThreshold: product.lowStockThreshold,
        hasRecipe: product.hasRecipe,
        securityDeposit: product.securityDeposit,
        recipeItems: product.recipeIngredients?.map(recipe => ({
            rawMaterialId: recipe.childItemId,
            quantityRequired: recipe.quantity
        })) || []
    };
    return mappedInitialData;
}