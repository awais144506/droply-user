import { ActivityLog } from "@/types/ActivityLog"; // Adjust path if needed

export interface ConsumedItem {
  id: string;
  rawMaterialId: string;
  quantityUsed: number;
  rawMaterial: {
    unitOfMeasure: string;
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
  expectedYield: number;
  actualYield: number | null;
  status: 'IN_PROGRESS' | 'COMPLETED';
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
  expectedYield: number;
  supervisorName: string;
  productionDate?: string;
}