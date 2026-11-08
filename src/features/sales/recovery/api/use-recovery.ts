import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { recoveryKeys } from "./recovery-keys";
import { recoveryApi } from "./recovery.service";
import { GetRecoveryAllResponse } from "../types/recovery.types";

export function useRecoveries(
  branchId: string,
  filters?: {
    search?: string;
    date?: string;
    customerId?: string;
  }
) {
  const selectRecoveryData = useCallback((payload: GetRecoveryAllResponse) => {
    const recoveries = payload?.recoveries || [];
    const saleReturns = payload?.saleReturns || [];
    const logs = payload?.logs || [];

    // Compute quick KPI stats for the dashboard header cards
    let totalCashRecovered = 0;
    let totalContainersRecovered = 0;
    let totalWastedContainers = 0;

    for (const rec of recoveries) {
      totalCashRecovered += Number(rec.amountReceived || 0);
      for (const item of rec.recoveredItems || []) {
        totalContainersRecovered += Number(item.quantityReturned || 0);
        totalWastedContainers += Number(item.wastageQty || 0);
      }
    }

    let totalSaleReturnValue = 0;
    let totalKhataCredited = 0;
    let totalCashRefunded = 0;

    for (const ret of saleReturns) {
      totalSaleReturnValue += Number(ret.totalRefundAmount || 0);
      totalKhataCredited += Number(ret.khataCredited || 0);
      totalCashRefunded += Number(ret.cashRefunded || 0);
    }

    return {
      recoveries,
      saleReturns,
      logs,
      stats: {
        recoveryCount: recoveries.length,
        totalCashRecovered,
        totalContainersRecovered,
        totalWastedContainers,
        saleReturnCount: saleReturns.length,
        totalSaleReturnValue,
        totalKhataCredited,
        totalCashRefunded,
      },
    };
  }, []);

  return useQuery({
    queryKey: recoveryKeys.branchList(branchId || "", filters),
    queryFn: () => recoveryApi.getAll(filters),
    select: selectRecoveryData,
    staleTime: 2 * 60 * 1000,
    enabled: Boolean(branchId),
  });
}

export function useCustomerCompletedOrders(customerId?: string) {
  return useQuery({
    queryKey: recoveryKeys.completedOrders(customerId || ""),
    queryFn: () => recoveryApi.getCustomerCompletedOrders(customerId!),
    enabled: Boolean(customerId),
    staleTime: 60 * 1000,
    select: (orders) => {
      // Automatically enrich each order line item with how many units are still eligible for return
      return (orders || []).map((order) => {
        const enrichedLineItems = (order.lineItems || []).map((li) => {
          const alreadyReturned = (order.saleReturns || []).reduce((sum, sr) => {
            const match = (sr.items || []).find(
              (i) => i.productId === li.productId
            );
            return sum + Number(match?.returnQuantity || 0);
          }, 0);

          const availableToReturn = Math.max(
            0,
            Number(li.paidQuantity || 0) - alreadyReturned
          );

          return {
            ...li,
            alreadyReturned,
            availableToReturn,
          };
        });

        return {
          ...order,
          lineItems: enrichedLineItems,
          hasReturnableItemsLeft: enrichedLineItems.some(
            (li) => li.availableToReturn > 0
          ),
        };
      });
    },
  });
}