import { useQuery } from "@tanstack/react-query";
import { productionService } from "./production.service";
import { productionKeys } from "./production-keys";

export const useProduction = (branchId: string) => {
  return useQuery({
    queryKey: productionKeys.lists(branchId),
    queryFn: () => productionService.getAll(branchId),
    select: (batchesData) => {

      const totalYield = batchesData.batches.reduce((sum, batch) => sum + (batch.actualYield || 0), 0);
      const completedBatches = batchesData.batches.filter(b => b.status === "COMPLETED").length;
      const inProgressBatches = batchesData.batches.filter(b => b.status === "IN_PROGRESS").length;

      return {
        batchesData,
        stats: {
          totalYield,
          completedBatches,
          inProgressBatches
        }
      }
    },
    enabled: !!branchId,
  });
};

export const useBatch = (id: string) => {
  return useQuery({
    queryKey: productionKeys.batch(id),
    queryFn: () => productionService.getBatch(id),
    enabled: !!id,
  });
};