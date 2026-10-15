import { quoteService } from "./quote.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quoteKeys } from "./quote-keys";
import { BillingDocumentFormValues } from "../schema/quotation-schema";
import { BillingDocument } from "../types/quotation";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

export const useCreateQuotation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: BillingDocumentFormValues) => quoteService.createNewQuotation(payload),
        onSuccess: () => {
            toast.success("New quotation created successfully")
            router.back();
            queryClient.invalidateQueries({ queryKey: quoteKeys.all })
        },
        onError: (err) => {
            toast.error(err.message)
        },
    })
}

export const useUpdateQuotation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: BillingDocumentFormValues }) =>
            quoteService.updateQuotation(id, payload),
        onSuccess: (data: BillingDocument) => {
            toast.success(`Quotation ${data.documentNumber} updated successfully!`);
            router.back();
            queryClient.invalidateQueries({ queryKey: quoteKeys.all });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: quoteKeys.quotation(data.id) });
            }
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to update quotation");
        },
    });
};

export const useDeleteQuotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => quoteService.deleteQuotation(id),
        onSuccess: () => {
            toast.success("Quotation deleted successfully")
            queryClient.invalidateQueries({ queryKey: quoteKeys.all })
        },
        onError: (err) => {
            toast.error(err.message)
        },
    })
}

export const useUpdateInvoiceType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, type }: { id: string; type: 'INVOICE' | 'QUOTATION' }) =>
            quoteService.updateInvoiceType(id, type),
        onSuccess: (data) => {
            const isInvoice = data.type === 'INVOICE';
            toast.success(
                isInvoice
                    ? `Quotation #${data.documentNumber} converted to Official Tax Invoice!`
                    : `Invoice #${data.documentNumber} reverted to Quotation for editing.`
            );
            queryClient.invalidateQueries({ queryKey: quoteKeys.all });
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to update document state");
        },
    });
};