import { useQuery } from "@tanstack/react-query";
import { productionService } from "./production.service";
import { productionKeys } from "./production-keys";

export const useProduction = (branchId: string) => {
  return useQuery({
    queryKey: productionKeys.lists(branchId),
    queryFn: () => productionService.getAll(branchId),
    enabled: !!branchId,
  });
};