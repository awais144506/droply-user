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
        mutationFn: (payload: ZoneFormValues) => zoneApi.createNewZone(payload),
        onSuccess: () => {
            toast.success("New Zone Created successfully");
            queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
            queryClient.invalidateQueries({ queryKey: zoneKeys.logs() });
        },
        onError: (err) => {
            toast.error("Creation Failed", {
                description: err.message
            });
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
            toast.success("Zone updated successfully");
            queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
            queryClient.invalidateQueries({ queryKey: zoneKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: zoneKeys.logs() });
        },
        onError: (err) => {
            toast.error(err.message)
        }
    });
}

// 6. Delete Zone
export function useDeleteZone() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => zoneApi.deletZone(id),
        onSuccess: () => {
            toast.success("Zone deleted successfully");
            queryClient.invalidateQueries({ queryKey: zoneKeys.all });
        },
        onError: (err) => {
            toast.error(err.message)
        }
    });
}