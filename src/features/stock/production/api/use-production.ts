import { useQuery } from "@tanstack/react-query";
import { productionService } from "./production.service";
import { productionKeys } from "./production-keys";

export const useProduction = (branchId: string, search?: string, status?: string) => {
  return useQuery({
    queryKey: productionKeys.lists(branchId),
    queryFn: () => productionService.getAll(branchId),
    select: (batchesData) => {

      const totalYield = batchesData.batches.reduce((sum, batch) => sum + (batch.actualYield || 0), 0);
      const completedBatches = batchesData.batches.filter(b => b.status === "COMPLETED").length;
      const inProgressBatches = batchesData.batches.filter(b => b.status === "IN_PROGRESS").length;

      let filteredBatches = batchesData.batches;
      if (status === "COMPLETED") {
        filteredBatches = filteredBatches.filter(b => b.status === "COMPLETED");
      }
      else if (status === "IN_PROGRESS") {
        filteredBatches = filteredBatches.filter(b => b.status === "IN_PROGRESS");
      }


      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredBatches = filteredBatches.filter(b =>
          b.batchCode?.toLowerCase().includes(lowerSearch) ||
          b.product.name.toLowerCase().includes(lowerSearch)
        )
      }

      return {
        batchesData: filteredBatches,
        logsData: batchesData.logs,
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