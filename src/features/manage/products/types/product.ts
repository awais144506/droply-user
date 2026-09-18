export type CategoryType = "FINISHED_GOOD" | "RAW_MATERIAL" | "TRADE" | "EQUIPMENT" | "PACKAGING"
export type TrackingType = "OUTRIGHT" | "RETURNABLE";

export interface ProductItem {
    securityDeposit: number | null;
    id: string;
    name: string;
    category: CategoryType;
    trackingType: TrackingType;
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
            productCode: string;
        };
    }[];
}

export interface ProductList {
    productCode: string;
    securityDeposit: number;
    id: string;
    name: string;
    category: CategoryType;
    trackingType: TrackingType;
    unitCost: number;
    currentStock: number;
    profirMargin: number;
    lowStockThreshold: number;
    salePrice: number;
    hasRecipe: boolean;
    isUsedInRecipes?: boolean;
}