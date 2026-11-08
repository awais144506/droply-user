/* eslint-disable @typescript-eslint/no-explicit-any */
import { quoteService } from "./quote.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quoteKeys } from "./quote-keys";
import { BillingDocumentFormValues } from "../schema/quotation-schema";
import { BillingDocument } from "../types/quotation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCreateQuotation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: BillingDocumentFormValues) => quoteService.createNewQuotation(payload),
        onSuccess: () => {
            toast.success("New quotation created successfully");
            router.back();
            queryClient.invalidateQueries({ queryKey: quoteKeys.all });
        },
        onError: (err: any) => {
            toast.error(err?.message || "Failed to create quotation");
        },
    });
};

export const useUpdateQuotation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: BillingDocumentFormValues }) =>
            quoteService.updateQuotation(id, payload),
        onSuccess: async (data: BillingDocument, variables) => {
            toast.success(`Quotation ${data.documentNumber} updated successfully!`);
            queryClient.setQueryData(quoteKeys.quotation(variables.id), data);
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: quoteKeys.all,
                    refetchType: "all",
                }),
                queryClient.invalidateQueries({
                    queryKey: quoteKeys.quotation(variables.id),
                    refetchType: "all",
                }),
            ]);
            router.back();
            router.refresh();
        },
        onError: (err: any) => {
            toast.error(err?.message || "Failed to update quotation");
        },
    });
};

export const useDeleteQuotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => quoteService.deleteQuotation(id),
        onSuccess: () => {
            toast.success("Quotation deleted successfully");
            queryClient.invalidateQueries({ queryKey: quoteKeys.all });
        },
        onError: (err: any) => {
            toast.error(err?.message || "Failed to delete quotation");
        },
    });
};

export const useUpdateInvoiceType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, type }: { id: string; type: 'INVOICE' | 'QUOTATION' }) =>
            quoteService.updateInvoiceType(id, type),
        onSuccess: (data: BillingDocument) => {
            const isInvoice = data.type === 'INVOICE';
            toast.success(
                isInvoice
                    ? `Quotation #${data.documentNumber} converted to Official Tax Invoice!`
                    : `Invoice #${data.documentNumber} reverted to Quotation for editing.`
            );
            queryClient.invalidateQueries({ queryKey: quoteKeys.all });
        },
        onError: (err: any) => {
            toast.error(err?.message || "Failed to update document state");
        },
    });
};