import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { returnApi } from "./returns.service";
import { returnKeys } from "./return-keys";
import { productKeys } from "@/features/manage/products/api/product-keys";

export function useCreateReturn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: returnApi.create,
        onSuccess: (data) => {
            toast.success("Return logged successfully", {
                description: `Debit Note ${data.debitNoteNumber} has been generated.`
            });

            queryClient.invalidateQueries({ queryKey: returnKeys.lists() });
            // queryClient.invalidateQueries({ queryKey: productKeys.lists() }); // Physical stock dropped
        },
        onError: (error) => {
            toast.error("Failed to log return", {
                description: error?.message || "An unexpected error occurred",
            });
        },
    });
}

export function useDeleteReturn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: returnApi.delete,
        onSuccess: () => {
            toast.success("Return undone successfully", {
                description: "Stock has been restored to your inventory."
            });

            queryClient.invalidateQueries({ queryKey: returnKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
        onError: (error) => {
            toast.error("Failed to undo return", {
                description: error?.message || "Ensure the return is still pending.",
            });
        },
    });
}