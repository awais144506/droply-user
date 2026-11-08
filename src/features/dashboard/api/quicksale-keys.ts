import { QuickSaleQueryParams } from "../types/quicksale";

export const quickSaleKeys = {
  all: ["quick-sales"] as const,

  lists: () => [...quickSaleKeys.all, "list"] as const,
  listByBranch: (branchId: string, filters?: QuickSaleQueryParams) =>
    [...quickSaleKeys.lists(), branchId, filters ?? {}] as const,

  details: () => [...quickSaleKeys.all, "detail"] as const,
  detail: (id: string) => [...quickSaleKeys.details(), id] as const,
};