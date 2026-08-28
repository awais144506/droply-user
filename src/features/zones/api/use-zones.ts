import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ZoneItem, CreateZonePayload, UpdateZonePayload, ZoneRider } from "../types";
import { apiClient } from "@/lib/api-client";
const getBaseUrl = (branchId: string) => `/branches/${branchId}/zones`;

export function useZones(branchId: string) {
  return useQuery({
    queryKey: ["zones", branchId],
    queryFn: async (): Promise<ZoneItem[]> => {
      const response: any = await apiClient.get(`/branches/${branchId}/zones`);
      if (Array.isArray(response)) {
        return response;
      }
      if (Array.isArray(response?.data)) {
        return response.data;
      }
      return [];
    },
    enabled: Boolean(branchId && branchId.trim().length > 0),
  });
}

// Fetch available branch riders for assignment
export function useBranchRiders(branchId: string) {
  return useQuery({
    queryKey: ["branch-riders", branchId],
    queryFn: async (): Promise<ZoneRider[]> => {
      const { data } = await apiClient.get(`/api/branches/${branchId}/riders`);
      return data;
    },
    enabled: Boolean(branchId),
  });
}

// Create new zone
export function useCreateZone(branchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateZonePayload) => {
      const { data } = await apiClient.post(getBaseUrl(branchId), payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones", branchId] });
    },
  });
}

// Update existing zone
export function useUpdateZone(branchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateZonePayload }) => {
      const { data } = await apiClient.patch(`${getBaseUrl(branchId)}/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones", branchId] });
    },
  });
}

// Delete zone
export function useDeleteZone(branchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (zoneId: string) => {
      const { data } = await apiClient.delete(`${getBaseUrl(branchId)}/${zoneId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones", branchId] });
    },
  });
}