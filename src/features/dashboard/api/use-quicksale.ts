import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { quickSaleKeys } from "./quicksale-keys";
import { quickSaleService } from "./quicksale.service";
import {
  QuickSaleListResponse,
  QuickSaleQueryParams,
} from "../types/quicksale";

// 1. Fetch Paginated & Filtered Quick Sales for a Branch
export const useQuickSales = (
  branchId?: string | null,
  params?: QuickSaleQueryParams
) => {
  return useQuery({
    queryKey: quickSaleKeys.listByBranch(branchId || "", params),
    queryFn: () => quickSaleService.getAllByBranch(branchId!, params),
    enabled: Boolean(branchId),
    placeholderData: keepPreviousData, // Prevents table flicker while typing search or changing page
  });
};

// 2. Fetch Single Quick Sale Receipt (with instant React Query cache fallback)
export const useQuickSale = (id?: string | null) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: quickSaleKeys.detail(id || ""),
    queryFn: () => quickSaleService.getById(id!),
    enabled: Boolean(id),
    initialData: () => {
      if (!id) return undefined;

      // Search all cached branch lists for this receipt ID first
      const cachedLists = queryClient.getQueriesData<QuickSaleListResponse>({
        queryKey: quickSaleKeys.lists(),
      });

      for (const [, listResponse] of cachedLists) {
        const found = listResponse?.data?.find((sale) => sale.id === id);
        if (found) return found;
      }

      return undefined;
    },
  });
};