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
    isActive: boolean;
    isUsedInRecipes?: boolean; 
    recipeIngredients?: {
        id: string;
        quantity: number;
        childItemId: string;
        childItem: {
            name: string;
            sku: string;
        };
    }[];
}