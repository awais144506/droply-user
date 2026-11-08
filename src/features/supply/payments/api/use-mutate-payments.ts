import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentApi } from "./payments.service";
import { paymentKeys } from "./payments-keys";
import { poKeys } from "../../order/api/po-keys"; // Adjust path to invalidate POs
import { supplierKeys } from "../../suppliers/api/supplier-keys"; // Adjust path to invalidate Suppliers

export function useCreatePayment(branchId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paymentApi.create,
        onSuccess: (data) => {
            toast.success("Payment recorded successfully", {
                description: `Voucher ${data.voucherNumber} has been generated.`
            });

            // Invalidate dependent caches to reflect the new balances
            queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: poKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists(branchId) });
        },
        onError: (error) => {
            toast.error("Failed to record payment", {
                description: error?.message || "An unexpected error occurred",
            });
        },
    });
}

export function useUpdatePayment(branchId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paymentApi.update,
        onSuccess: () => {
            toast.success("Payment updated successfully");
            queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: paymentKeys.list(branchId) });
            queryClient.invalidateQueries({ queryKey: poKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists(branchId) });
        },
        onError: (error) => {
            toast.error("Failed to update payment", {
                description: error?.message || "An unexpected error occurred",
            });
        },
    });
}