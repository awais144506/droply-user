import { ActivityLog } from "@/types/ActivityLog";

export type CategoryType = 
    | "FINISHED_GOOD" 
    | "RAW_MATERIAL" 
    | "TRADE" 
    | "PACKAGING" 
    | "EQUIPMENT" 
    | "SERVICE";

export type TrackingType = "OUTRIGHT" | "RETURNABLE";

export type UnitOfMeasureType = 
    | "PIECE" 
    | "KG" 
    | "GRAM" 
    | "LITER" 
    | "MILLILITER" 
    | "PACK" 
    | "CARTON";

export interface ProductPriceTier {
    id: string;
    productId: string;
    title: string | null;
    unitCost: number;
    salePrice: number;
    profitMargin: number;
    isDefault: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RecipeIngredientItem {
    id: string;
    parentItemId: string;
    childItemId: string;
    quantity: number;
    childItem: {
        id?: string;
        name: string;
        productCode?: string;
        unitOfMeasure?: UnitOfMeasureType;
        currentStock?: number;
    };
}

export interface ProductItem {
    id: string;
    branchId: string;
    productCode: string;
    name: string;
    category: CategoryType;
    trackingType: TrackingType;
    unitOfMeasure: UnitOfMeasureType;
    securityDeposit: number;
    openingStock: number;
    currentStock: number;
    lowStockThreshold: number;
    hasRecipe: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    unitCost?: number;
    salePrice?: number;
    profitMargin?: number;
    priceTiers: ProductPriceTier[];
    recipeIngredients?: RecipeIngredientItem[];
    usedInRecipes?: {
        id: string;
        parentItem: {
            id: string;
            name: string;
            productCode: string;
        };
    }[];
}

export interface ProductList {
    isUsedInRecipes: boolean | undefined;
    id: string;
    productCode: string;
    name: string;
    category: CategoryType;
    trackingType: TrackingType;
    unitOfMeasure: UnitOfMeasureType;
    securityDeposit: number;
    openingStock: number;
    currentStock: number;
    lowStockThreshold: number;
    hasRecipe: boolean;
    isActive: boolean;
    unitCost: number;
    salePrice: number;
    profitMargin: number;
    priceTiers: ProductPriceTier[];
    recipeIngredients?: {
        childItemId: string;
        quantity: number;
        childItem: {
            name: string;
            currentStock: number;
            unitOfMeasure: UnitOfMeasureType;
        };
    }[];
}

export interface ProductListResponse {
    products: ProductList[];
    logs: ActivityLog[];
}