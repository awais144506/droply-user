import { useQuery } from "@tanstack/react-query";
import { returnApi } from "./returns.service";
import { returnKeys } from "./return-keys";

export function useReturns(branchId: string, search?: string, status?: string) {
  return useQuery({
    queryKey: returnKeys.list(branchId), // Keep queryKey simple so it caches one network request
    queryFn: () => returnApi.getAll(branchId),
    select: (data) => {
      let filteredReturns = data.returns;

      // 1. Apply Status Filter
      if (status) {
        filteredReturns = filteredReturns.filter((r) => {
          const isPending = r.status === "PENDING_RESOLUTION";
          if (status === "PENDING") return isPending;
          if (status === "RESOLVED") return !isPending;
          return true;
        });
      }

      // 2. Apply Search Filter
      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredReturns = filteredReturns.filter((r) =>
          r.debitNoteNumber.toLowerCase().includes(lowerSearch) ||
          r.supplier?.firmName.toLowerCase().includes(lowerSearch)
        );
      }

      return {
        returns: filteredReturns,
        stats: {
          pendingResolutionAmount: data.stats.pendingResolution,
          creditsRecoveredAmount: data.stats.creditsRecovered,
          stockReplacementsCount: data.stats.stockReplacements,
        },
        logs: data.logs || [],
      };
    },
    enabled: !!branchId,
  });
}