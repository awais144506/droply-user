import { useMutation, useQueryClient } from "@tanstack/react-query";
import { poApi } from "./po.service";
import { poKeys } from "./po-keys";
import { toast } from "sonner";
import { CreatePOFormData } from "../schema/create-po-schema";
import { supplierKeys } from "../../suppliers/api/supplier-keys";

export function useCreatePO(branchId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreatePOFormData) => poApi.create(payload),
        onSuccess: () => {
            toast.success("Purchase Order generated successfully");
            queryClient.invalidateQueries({ queryKey: poKeys.list(branchId) });
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists(branchId) });
        },
        onError: (error) => {
            toast.error("Failed to generate PO", {
                description: error.message || "An unexpected error occurred",
            });
        },
    });
}


export function useUpdatePO(branchId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreatePOFormData }) => poApi.update(id, payload),
        onSuccess: (_, variables) => {
            toast.success("Purchase Order updated successfully");
            queryClient.invalidateQueries({ queryKey: poKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: poKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists(branchId) });
        },
        onError: (error) => {
            toast.error("Failed to update PO", {
                description: error.message || "An unexpected error occurred",
            });
        },
    });
}

export function useDeletePO(branchId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => poApi.delete(id),
        onSuccess: () => {
            toast.success("Purchase Order deleted successfully");
            queryClient.invalidateQueries({ queryKey: poKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists(branchId) });
        },
        onError: (error) => {
            toast.error("Failed to delete PO", {
                description: error.message || "An unexpected error occurred",
            });
        },
    })
}