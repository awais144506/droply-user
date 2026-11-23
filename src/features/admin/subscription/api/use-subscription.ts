import { useQuery } from "@tanstack/react-query";
import { subApi } from "./subscription.service";
import { subscriptionKeys } from "./subscription-keys";

export function useSubscription(branchId: string) {
  return useQuery({
    queryKey: subscriptionKeys.details(branchId),
    queryFn: () => subApi.getSubscriptionDetails(),
    enabled: Boolean(branchId),
  });
}