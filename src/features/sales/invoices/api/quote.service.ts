import { apiClient } from "@/lib/api-client";
import { BillingDocumentFormValues } from "../schema/quotation-schema";
import { BillingDocumentApiResponse, BillingDocument } from "../types/quotation";

export const quoteService = {
    createNewQuotation: async (payload: BillingDocumentFormValues): Promise<BillingDocument> => {
        return apiClient.post(`/invoice/branch`, payload)
    },
    getAllQuotations: async (branchId: string): Promise<BillingDocumentApiResponse> => {
        return apiClient.get(`/invoice/branch/${branchId}`)
    },
    getQuotationById: async (id: string): Promise<BillingDocument> => {
        return apiClient.get(`/invoice/branch/${id}/single`)
    },
    updateQuotation: async (id: string, payload: BillingDocumentFormValues): Promise<BillingDocument> => {
        return apiClient.patch(`/invoice/branch/${id}/edit`, payload);
    },
    deleteQuotation: async (id: string): Promise<true> => {
        return apiClient.delete(`/invoice/branch/${id}/delete`)
    },
    updateInvoiceType: async (id: string, type: 'INVOICE' | 'QUOTATION'): Promise<BillingDocument> => {
        return apiClient.patch(`/invoice/branch/${id}/type`, { type });
    },
}