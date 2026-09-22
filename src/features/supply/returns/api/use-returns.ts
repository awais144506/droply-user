import { useQuery } from "@tanstack/react-query";
import { returnApi } from "./returns.service";
import { returnKeys } from "./return-keys";

export function useReturns(branchId: string) {
  return useQuery({
    queryKey: returnKeys.list(branchId),
    queryFn: () => returnApi.getAll(branchId),
    select: (returns) => {
      // Aggregate UI Stats dynamically
      const pendingResolutionAmount = returns
        .filter(r => r.status === "PENDING_RESOLUTION")
        .reduce((sum, r) => sum + r.totalValue, 0);

      const creditsRecoveredAmount = returns.reduce((sum, r) => sum + r.creditRecovered, 0);

      // Count how many individual item batches were successfully replaced
      const stockReplacementsCount = returns.reduce((count, r) => {
        const replacedItemsInReturn = r.items.filter(item => item.quantityReplaced > 0).length;
        return count + replacedItemsInReturn;
      }, 0);

      return {
        returns,
        stats: {
          pendingResolutionAmount,
          creditsRecoveredAmount,
          stockReplacementsCount
        }
      };
    },
    enabled: !!branchId,
  });
}

export function useReturn(id: string) {
  return useQuery({
    queryKey: returnKeys.detail(id),
    queryFn: () => returnApi.getById(id),
    enabled: !!id,
  });
}