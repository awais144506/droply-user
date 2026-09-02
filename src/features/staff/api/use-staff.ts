import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { UserRole } from "@/config/navigation.config";

export interface BranchUserItem {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  phone: string;
  role: "OWNER" | "MANAGER" | "RIDER";
  isActive: boolean;
  zones?: { id: string; name: string }[];
  createdAt: string;
}

export function useStaff(branchId: string) {
  return useQuery({
    queryKey: ["staff", branchId],
    queryFn: async (): Promise<BranchUserItem[]> => {
      const { data } = await apiClient.get(`/branches/${branchId}/staff`);
      return Array.isArray(data) ? data : data?.data || [];
    },
    enabled: Boolean(branchId),
  });
}

export function useCreateStaff(branchId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<BranchUserItem>) => {
      const { data } = await apiClient.post(`/branches/${branchId}/staff`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff", branchId] }),
  });
}

export function useUpdateStaff(branchId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<BranchUserItem> }) => {
      const { data } = await apiClient.patch(`/branches/${branchId}/staff/${id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff", branchId] }),
  });
}