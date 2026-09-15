import { useQuery } from "@tanstack/react-query";
import { orderService } from "./order.service";
import { orderKeys } from "./order-keys";

export const useOrders = (branchId: string) => {
    return useQuery({
        queryKey: orderKeys.todays(branchId),
        queryFn: () => orderService.getTodaysOrders(branchId),
        enabled: !!branchId,
        staleTime: 1000 * 60 * 2,
    });
};