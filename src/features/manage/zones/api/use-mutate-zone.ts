/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { zoneKeys } from "./zone-keys";
import { ZoneFormValues } from "../schema/create-zone-schema";
import { EditZoneFormValues } from "../schema/edit-zone-schema";
import { zoneApi } from "./zone.service";
import { toast } from "sonner";

// 4. Create Zone
export function useCreateZone() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ZoneFormValues) => zoneApi.createNewZone(payload),
        onMutate: async (newZone) => {
            await queryClient.cancelQueries({ queryKey: zoneKeys.lists() });
            const previousZonesData = queryClient.getQueriesData({ queryKey: zoneKeys.lists() });
            queryClient.setQueriesData({ queryKey: zoneKeys.lists() }, (old: any) => {
                const optimisticZone = {
                    ...newZone,
                    id: `temp-${Date.now}`,
                };
                return old ? [optimisticZone, ...old] : [optimisticZone];
            });
            return { previousZonesData };
        },
        onError: (err, newZone, context) => {
            toast.error(err.message);
            if (context?.previousZonesData) {
                queryClient.setQueryData(zoneKeys.lists(), context.previousZonesData);
            }
        },
        onSuccess: () => {
            toast.success("New Zone Created")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
            queryClient.invalidateQueries({ queryKey: zoneKeys.logs() });
        }
    });
}

// 5. Update Zone
export function useUpdateZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: EditZoneFormValues }) => {
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
        mutationFn: async (id: string) => zoneApi.deletZone(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: zoneKeys.all });
        },
    });
}