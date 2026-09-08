import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { CustomerDetails } from "../types/customer";
import { CustomerFormValues } from "../schema/create-customer.schema";
import { ActivityLog } from "@/types/ActivityLog";

// 1. Query Keys Factory
export const customerKeys = {
  all: ["branch-customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  branchList: (branchId?: string) => [...customerKeys.lists(), branchId] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  logs: () => [...customerKeys.all, "logs"] as const,
  customerLogs: (branchId?: string) => [...customerKeys.logs(), branchId] as const,
};

// Helper: Format local PK numbers to E.164 (+92)
const formatPakistaniPhone = (phone?: string) => {
  if (!phone) return phone;
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('03') && cleaned.length === 11) {
    return '+92' + cleaned.slice(1);
  }
  return cleaned;
};

const displayPakistaniPhone = (phone?: string) => {
  if (!phone) return phone;
  if (phone.startsWith('+923') && phone.length === 13) {
    return '0' + phone.slice(3);
  }
  return phone;
};

// 2. Fetch All Customers for a Branch
export function useCustomers(branchId?: string | null) {
  return useQuery({
    queryKey: customerKeys.branchList(branchId || ""),
    queryFn: async (): Promise<CustomerDetails[]> => {
      const data: CustomerDetails[] = await apiClient.get(`/customer/branch/${branchId}`);
      return data.map(customer => ({
        ...customer,
        phone: displayPakistaniPhone(customer.phone) || customer.phone,
      }));
    },
    enabled: !!branchId,
  });
}

// 3. Fetch Single Customer Details
export function useCustomer(id?: string) {
  return useQuery({
    queryKey: customerKeys.detail(id || ""),
    queryFn: async (): Promise<CustomerDetails> => {
      const data: CustomerDetails = await apiClient.get(`/customer/${id}`);
      return {
        ...data,
        phone: displayPakistaniPhone(data.phone) || data.phone,
      };
    },
    enabled: !!id,
  });
}
// 4. Create Customer
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CustomerFormValues) => {
      // Intercept and format the phone number
      const formattedPayload = {
        ...payload,
        phone: formatPakistaniPhone(payload.phone),
      };
      return apiClient.post(`/customer`, formattedPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

// 5. Update Customer
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CustomerFormValues> }) => {
      const formattedData = { ...data };

      // Format phone if it's being updated
      if (formattedData.phone) {
        formattedData.phone = formatPakistaniPhone(formattedData.phone);
      }

      return apiClient.patch(`/customer/${id}`, formattedData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
    },
  });
}

// 6. Delete Customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/customer/${id}`);
    },
    onSuccess: () => {
      // Wipes the cache so UI refreshes automatically
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

// 7. Activity Logs for Customers
export function useCustomerLogs(branchId?: string) {
  return useQuery({
    queryKey: customerKeys.customerLogs(branchId),
    queryFn: async (): Promise<ActivityLog[]> => {
      if (!branchId) return [];
      return apiClient.get(`/customer/logs/${branchId}`); // Ensure you have a controller route for this!
    },
    enabled: !!branchId,
  });
}