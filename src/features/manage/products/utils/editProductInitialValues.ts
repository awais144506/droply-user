import { ProductItem } from "../types/product";

export const mappedProductData = (product: ProductItem | undefined) => {
    if (!product) return undefined;

    // Map existing price tiers or fallback to a standard default tier
    const mappedPriceTiers =
        product.priceTiers && product.priceTiers.length > 0
            ? product.priceTiers.map((tier) => ({
                  id: tier.id,
                  title: tier.title || "Standard",
                  unitCost: Number(tier.unitCost ?? 0),
                  salePrice: Number(tier.salePrice ?? 0),
                  isDefault: Boolean(tier.isDefault),
                  isActive: tier.isActive ?? true,
              }))
            : [
                  {
                      title: "Standard",
                      unitCost: Number(product.unitCost ?? 0),
                      salePrice: Number(product.salePrice ?? 0),
                      isDefault: true,
                      isActive: true,
                  },
              ];

    // Map recipe ingredients to match form array keys
    const mappedRecipeIngredients =
        product.recipeIngredients?.map((recipe) => ({
            childItemId: recipe.childItemId,
            quantity: Number(recipe.quantity ?? 1),
        })) || [];

    return {
        productCode: product.productCode || "",
        name: product.name || "",
        category: product.category,
        trackingType: product.trackingType,
        unitOfMeasure: product.unitOfMeasure,
        openingStock: Number(product.currentStock ?? product.openingStock ?? 0),
        lowStockThreshold: Number(product.lowStockThreshold ?? 10),
        hasRecipe: Boolean(product.hasRecipe),
        securityDeposit: Number(product.securityDeposit ?? 0),
        priceTiers: mappedPriceTiers,
        recipeIngredients: mappedRecipeIngredients,
    };
};