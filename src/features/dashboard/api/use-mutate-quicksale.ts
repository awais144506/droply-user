import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { quickSaleKeys } from "./quicksale-keys";
import { quickSaleService } from "./quicksale.service";
import {
    CreateQuickSalePayload,
    UpdateQuickSalePayload,
} from "../types/quicksale";
import { productKeys } from "@/features/manage/products/api/product-keys";
// 1. Create Quick Sale Hook
export const useCreateQuickSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateQuickSalePayload) =>
            quickSaleService.create(payload),
        onSuccess: (newSale) => {
            toast.success(`Sale #${newSale.receiptNumber} completed!`);
            queryClient.invalidateQueries({ queryKey: quickSaleKeys.all });
            queryClient.invalidateQueries({ queryKey: productKeys.branchList(newSale.branchId) });
        },
        onError: (error) => {
            toast.error(error.message)
        },
    });
};

// 2. Update Active Quick Sale Hook
export const useUpdateQuickSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateQuickSalePayload;
        }) => quickSaleService.update(id, payload),
        onSuccess: (updatedSale) => {
            toast.success(`Receipt #${updatedSale.receiptNumber} updated!`);
            queryClient.invalidateQueries({ queryKey: quickSaleKeys.all });
            queryClient.invalidateQueries({
                queryKey: quickSaleKeys.detail(updatedSale.id),
            });
            queryClient.invalidateQueries({ queryKey: productKeys.branchList(updatedSale.branchId) });
        },
        onError: (error) => {
            toast.error(error.message)
        },
    });
};

// 3. Void Quick Sale Hook (Restores Stock & Locks Receipt)
export const useVoidQuickSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => quickSaleService.voidSale(id),
        onSuccess: (voidedSale) => {
            toast.success(
                `Receipt #${voidedSale.receiptNumber} voided and stock restored.`
            );
            queryClient.invalidateQueries({ queryKey: quickSaleKeys.all });
            queryClient.invalidateQueries({
                queryKey: quickSaleKeys.detail(voidedSale.id),
            });
            queryClient.invalidateQueries({ queryKey: productKeys.branchList(voidedSale.branchId) });
        },
        onError: (error) => {
            toast.error(error.message)
        },
    });
};