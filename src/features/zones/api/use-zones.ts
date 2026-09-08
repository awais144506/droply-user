import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ZoneDetails } from "../types";
import { ActivityLog } from "@/types/ActivityLog";

// 1. Query Keys Factory
export const zoneKeys = {
    all: ["branch-zones"] as const,
    lists: () => [...zoneKeys.all, "list"] as const,
    branchList: (branchId?: string) => [...zoneKeys.lists(), branchId] as const,
    details: () => [...zoneKeys.all, "detail"] as const,
    detail: (id: string) => [...zoneKeys.details(), id] as const,
    logs: () => [...zoneKeys.all, "logs"] as const,
    branchLogs: (branchId?: string) => [...zoneKeys.logs(), branchId] as const,
};

// DTO Interfaces matching your backend
export interface CreateZonePayload {
    branchId: string;
    name: string;
    latitude?: number;
    longitude?: number;
}

export type UpdateZonePayload = Partial<CreateZonePayload>;

// 2. Fetch All Zones for a Branch
export function useZones(branchId?: string | null) {
    return useQuery({
        queryKey: zoneKeys.branchList(branchId || ""),
        queryFn: async () => {
            const zones: ZoneDetails[] = await apiClient.get(`/zone/branch/${branchId}`);

            // 1. Calculate Grand Totals
            const totalZones = zones.length;
            const totalCustomers = zones.reduce((acc, z) => acc + (z.customers?.length || 0), 0);

            const totalLedger = zones.reduce((acc, z) => {
                const zoneTotal = z.customers?.reduce((sum, c) => sum + Number(c.customerCredit || 0), 0) || 0;
                return acc + zoneTotal;
            }, 0);

            const totalReturnables = zones.reduce((acc, z) => {
                const zoneTotal = z.customers?.reduce((sum, c) => sum + Number(c.currentReturnables || 0), 0) || 0;
                return acc + zoneTotal;
            }, 0);

            // 2. Enrich individual zones so ZoneCard doesn't have to calculate them
            const enrichedZones = zones.map((zone) => ({
                ...zone,
                calculatedLedger: zone.customers?.reduce((sum, c) => sum + Number(c.customerCredit || 0), 0) || 0,
                calculatedReturnables: zone.customers?.reduce((sum, c) => sum + Number(c.currentReturnables || 0), 0) || 0,
            }));

            // 3. Return a neatly packaged object
            return {
                zones: enrichedZones,
                stats: {
                    totalZones,
                    totalCustomers,
                    totalLedger,
                    totalReturnables,
                }
            };
        },
        enabled: !!branchId,
    });
}

// 3. Fetch Single Zone (for Edit Page)
export function useZone(id?: string) {
    return useQuery({
        queryKey: zoneKeys.detail(id || ""),
        queryFn: async (): Promise<ZoneDetails> => {
            const data: ZoneDetails = await apiClient.get(`/zone/${id}`);

            // Calculate totals once before returning to the UI
            const calculatedLedger = data.customers?.reduce((sum, c) => sum + Number(c.customerCredit || 0), 0) || 0;
            const calculatedReturnables = data.customers?.reduce((sum, c) => sum + Number(c.currentReturnables || 0), 0) || 0;

            return {
                ...data,
                calculatedLedger,
                calculatedReturnables,
            };
        },
        enabled: !!id,
    });
}
// 4. Create Zone
export function useCreateZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateZonePayload) => {
            return apiClient.post(`/zone`, payload);
        },
        onSuccess: () => {
            // Invalidate lists and logs so the UI refreshes instantly
            queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
            queryClient.invalidateQueries({ queryKey: zoneKeys.logs() });
        },
    });
}

// 5. Update Zone
export function useUpdateZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateZonePayload }) => {
            return apiClient.patch(`/zone/${id}`, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
            queryClient.invalidateQueries({ queryKey: zoneKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: zoneKeys.logs() });
        },
    });
}

// 6. Delete Zone
export function useDeleteZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return apiClient.delete(`/zone/${id}`);
        },
        onSuccess: () => {
            // Wipes the entire zone cache (lists, details, logs)
            queryClient.invalidateQueries({ queryKey: zoneKeys.all });
        },
    });
}

// 7. Activity Logs
export function useZoneLogs(branchId?: string | null) {
    return useQuery({
        queryKey: zoneKeys.branchLogs(branchId || ""),
        queryFn: async (): Promise<ActivityLog[]> => {
            if (!branchId) return [];
            return apiClient.get(`/zone/logs/${branchId}`);
        },
        enabled: !!branchId,
    });
}