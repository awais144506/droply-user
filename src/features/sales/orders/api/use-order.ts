import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { orderService } from "./order.service";
import { orderKeys } from "./order-keys";

export interface OrderFilterParams {
  search?: string;
  category?: string;
  status?: string;
  date?: string;
  page?: number;
}

export const useOrders = (branchId: string, filters?: OrderFilterParams) => {
  return useQuery({
    queryKey: [...orderKeys.lists(), branchId, filters],
    queryFn: () => orderService.getTodaysOrders(filters),
    enabled: !!branchId,
    placeholderData: keepPreviousData,
  });
};