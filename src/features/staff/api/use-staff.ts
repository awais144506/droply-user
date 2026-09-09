/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client"; // Adjust path to your axios instance

// 1. Centralized Query Keys
export const staffKeys = {
  all: ["staff"] as const,
  branchList: (branchId: string) => [...staffKeys.all, "branch", branchId] as const,
  detail: (id: string) => [...staffKeys.all, "detail", id] as const,
  logs: (branchId: string) => [...staffKeys.all, "logs", branchId] as const,
};

// ============================================================================
// DATA FETCHING HOOKS (QUERIES)
// ============================================================================

// 2. Fetch All Staff for a Branch
export function useStaffList(branchId?: string | null) {
  return useQuery({
    queryKey: staffKeys.branchList(branchId || ""),
    queryFn: async () => {
      const response = await apiClient.get(`/staff/branch/${branchId}`);
      return response ?? []; 
    },
    enabled: !!branchId,
  });
}

// 3. Fetch Single Staff (for Edit/Details Page)
export function useStaffDetail(id?: string) {
  return useQuery({
    queryKey: staffKeys.detail(id || ""),
    queryFn: async () => {
      const response = await apiClient.get(`/staff/${id}`);
      return response;
    },
    enabled: !!id,
  });
}

// 4. Fetch Staff Activity Logs
export function useStaffLogs(branchId?: string | null) {
  return useQuery({
    queryKey: staffKeys.logs(branchId || ""),
    queryFn: async () => {
      const response = await apiClient.get(`/staff/logs/${branchId}`);
      return response ?? [];
    },
    enabled: !!branchId,
  });
}


// ============================================================================
// MUTATION HOOKS
// ============================================================================

// 5. Create Staff Member (which you already have)
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await apiClient.post("/staff", payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the cache to instantly show the new staff member
      queryClient.invalidateQueries({
        queryKey: staffKeys.branchList(variables.branchId),
      });
      // Also invalidate logs so the "CREATED" log appears instantly
      queryClient.invalidateQueries({
        queryKey: staffKeys.logs(variables.branchId),
      });
    },
  });
}