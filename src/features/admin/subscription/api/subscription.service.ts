import { apiClient } from "@/lib/api-client";
import { BankDetail, SubscriptionResponse } from "../types/subscription";
import { CheckoutSubmitPayload } from "../schema/payment.schema";
export interface SubmitPaymentApiPayload extends CheckoutSubmitPayload {
    tier: string;
    cycle: string;
}
export const subApi = {
    getAllBanks: async (): Promise<BankDetail[]> => {
        return apiClient.get('/bank')
    },
    getSubscriptionDetails: async (branchId: string): Promise<SubscriptionResponse> => {
        return apiClient.get(`/subscription/branch/${branchId}`)
    },
    submitSubscriptionPayment: async (branchId: string, payload: SubmitPaymentApiPayload) => {
        return await apiClient.post(`/subscription/branch/${branchId}/payment`, payload);
    },
    deleteSubscriptionPayment: async (id: string): Promise<true> => {
        return await apiClient.delete(`/subscription/branch/${id}`)
    }
}