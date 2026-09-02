import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface ZoneDetails {
  id: string;
  name: string;
  ledgerAmount: number | string;
  itemsReturnable: number;
  createdAt: string;
  riders: { id: string; name: string; phone: string }[];
  customers: {
    id: string;
    name: string;
    phone: string;
    address: string;
    status: "ACTIVE" | "INACTIVE" | "BLOCKED";
    customerCredit: number | string;
    customerAdvance: number | string;
    openingReturnables: number;
  }[];
}

export function useZoneDetails(branchId: string, zoneId: string) {
  return useQuery({
    queryKey: ["zone-details", branchId, zoneId],
    queryFn: async (): Promise<ZoneDetails> => {
      const response: any = await apiClient.get(`/branches/${branchId}/zones/${zoneId}`);
      return response;
    },
    enabled: Boolean(branchId && zoneId),
  });
}