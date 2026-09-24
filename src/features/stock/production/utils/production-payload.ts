import { ProductionFormValues } from "../schema/production-schema";
// Adjust this import to wherever you keep your frontend types/DTOs
import { CreateProductionPayload } from "../types/production";

/**
 * Transforms raw form data into the exact CreateProductionDto 
 * required by the NestJS backend.
 */
export const buildCreateProductionPayload = (
  formData: ProductionFormValues,
  branchId: string
): CreateProductionPayload => {
  return {
    branchId,
    productId: formData.productId,
    expectedYield: formData.expectedYield,
    supervisorName: formData.supervisorName,
    productionDate: formData.productionDate || new Date().toISOString(),
  };
};

/**
 * Placeholder for your future update logic
 */
export const buildUpdateProductionPayload = (
  formData: Partial<ProductionFormValues>,
  batchId: string
) => {
  return {
    id: batchId,
    supervisorName: formData.supervisorName,
    productionDate: formData.productionDate || new Date().toISOString(),
  };
};