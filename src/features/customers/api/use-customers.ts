import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  customerCredit: string | number;
  customerAdvance: string | number;
  securityHeld: string | number;
  openingReturnables: number;
  zone?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export function useCustomers(branchId: string) {
  return useQuery({
    queryKey: ["customers", branchId],
    queryFn: async (): Promise<CustomerItem[]> => {
      const { data } = await apiClient.get(`/branches/${branchId}/customers`);
      return Array.isArray(data) ? data : data?.data || [];
    },
    enabled: Boolean(branchId),
  });
}