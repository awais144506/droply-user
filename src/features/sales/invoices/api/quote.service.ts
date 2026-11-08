import { apiClient } from "@/lib/api-client";
import { BillingDocumentFormValues } from "../schema/quotation-schema";
import { BillingDocumentApiResponse, BillingDocument } from "../types/quotation";

const API = '/invoice/user'
export const quoteService = {
    createNewQuotation: async (payload: BillingDocumentFormValues): Promise<BillingDocument> => {
        return apiClient.post(`${API}`, payload)
    },
    getAllQuotations: async (branchId: string): Promise<BillingDocumentApiResponse> => {
        return apiClient.get(`${API}/${branchId}`)
    },
    getQuotationById: async (id: string): Promise<BillingDocument> => {
        return apiClient.get(`${API}/${id}/single`)
    },
    updateQuotation: async (id: string, payload: BillingDocumentFormValues): Promise<BillingDocument> => {
        return apiClient.patch(`${API}/${id}/edit`, payload);
    },
    deleteQuotation: async (id: string): Promise<true> => {
        return apiClient.delete(`${API}/${id}/delete`)
    },
    updateInvoiceType: async (id: string, type: 'INVOICE' | 'QUOTATION'): Promise<BillingDocument> => {
        return apiClient.patch(`${API}/${id}/type`, { type });
    },
}