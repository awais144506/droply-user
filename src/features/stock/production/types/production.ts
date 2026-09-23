import { ActivityLog } from "@/types/ActivityLog";

export interface ConsumedItem {
  id: string;
  rawMaterialId: string;
  quantityUsed: number;
  rawMaterial: {
    name: string;
    productCode: string;
    category: string;
  };
}

export interface ProductionBatch {
  id: string;
  batchCode: string;
  branchId: string;
  productId: string;
  yieldQuantity: number;
  supervisorName: string;
  productionDate: string;
  product: {
    name: string;
    productCode: string;
  };
  consumedItems: ConsumedItem[];
}

export interface ProductionResponse {
  batches: ProductionBatch[];
  logs: ActivityLog[];
}

export interface CreateProductionPayload {
  branchId: string;
  productId: string;
  yieldQuantity: number;
  supervisorName: string;
  productionDate?: string;
  consumedItems: {
    rawMaterialId: string;
    quantityUsed: number;
  }[];
}