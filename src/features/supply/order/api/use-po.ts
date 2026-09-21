import { useQuery } from "@tanstack/react-query";
import { poKeys } from "./po-keys";
import { poApi } from "./po.service";

export function usePurchaseOrders(branchId: string, search?: string, status?: string) {
    return useQuery({
        queryKey: poKeys.list(branchId), // Client-side filtering keeps this simple
        queryFn: () => poApi.getAll(branchId),
        select: (allOrders) => {
            // 1. Calculate stats on ALL orders (so the top cards remain accurate)
            const activeOrders = allOrders.filter(o => o.status === "ORDERED").length;
            const checkedByManager = allOrders.filter(o => o.status === "PENDING_RESTOCK").length;
            const completedOrders = allOrders.filter(o => o.status === "RECEIVED").length;
            const pendingValue = allOrders.filter(o => o.status === "ORDERED").reduce((acc, o) => acc + o.totalAmount, 0);
            let filteredOrders = allOrders;

            if (status) {
                filteredOrders = filteredOrders.filter(o => o.status === status);
            }

            if (search) {
                const lowerSearch = search.toLowerCase();
                filteredOrders = filteredOrders.filter(o =>
                    o.poNumber.toLowerCase().includes(lowerSearch) ||
                    o.supplier?.firmName.toLowerCase().includes(lowerSearch)
                );
            }

            return {
                orders: filteredOrders,
                stats: {
                    activeOrders,
                    checkedByManager,
                    completedOrders,
                    pendingValue,
                }
            }
        },
        enabled: !!branchId,
    });
}

export function usePurchaseOrder(id: string) {
    return useQuery({
        queryKey: poKeys.detail(id),
        queryFn: () => poApi.getById(id),
        enabled: !!id,
    });
}