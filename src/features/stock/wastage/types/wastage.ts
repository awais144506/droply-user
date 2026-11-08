type Source = 'PRODUCTION' | 'TRANSIT' | 'WAREHOUSE' | 'GENERAL';


export interface WastageRecord {
    id: string;
    branchId: string;
    rawMaterialId: string;
    quantityWasted: number;
    reason?: string;
    source: Source;
    productionBatchId?: string | null;
    createdAt: string;
    rawMaterial: {
        name: string;
        unitOfMeasure: string;
        priceTiers: {
            unitCost: number;
        }[];
    };
}

export interface WastageResponse {
    wastageLogs: WastageRecord[];
}