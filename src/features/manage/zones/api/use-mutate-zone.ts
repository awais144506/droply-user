import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zoneKeys } from "./zone-keys";
import { ZoneFormValues } from "../schema/create-zone-schema";
import { EditZoneFormValues } from "../schema/edit-zone-schema";
import { zoneApi } from "./zone.service";
import { toast } from "sonner";

// 3. Create Zone Mutation
export function useCreateZone() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ZoneFormValues) => zoneApi.createNewZone(payload),
        onSuccess: (_, variables) => {
            toast.success("Zone Created",
                { description: `${variables.name} zone has been created successfully` }
            );
            queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
            queryClient.invalidateQueries({ queryKey: zoneKeys.logs() });
        },
        onError: (err) => {
            toast.error("Creation Failed", {
                description: err?.message || "Something went wrong.",
            });
        },
    });
}

// 4. Update Zone Mutation
export function useUpdateZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: EditZoneFormValues }) => {
            return zoneApi.updateZone(id, data);
        },
        onSuccess: (_, variables) => {
            toast.success("Zone Updated",
                { description: `${variables.data.name} zone has been updated successfully` }
            );
            queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
            queryClient.invalidateQueries({ queryKey: zoneKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: zoneKeys.logs() });
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to update zone.");
        },
    });
}

// 5. Delete Zone Mutation
export function useDeleteZone() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => zoneApi.deletZone(id),
        onSuccess: () => {
            toast.success("Zone Deleted",
                { description: `Selected zone has been deleted successfully` }
            );
            queryClient.invalidateQueries({ queryKey: zoneKeys.all });
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to delete zone.");
        },
    });
}