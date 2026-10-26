import { apiClient } from "@/lib/api-client";
import { BankDetail, SubscriptionResponse } from "../types/subscription";
import { CheckoutSubmitPayload } from "../schema/payment.schema";
export interface SubmitPaymentApiPayload extends CheckoutSubmitPayload {
    tier: string;
    cycle: string;
}

const API = '/subscription/user'
export const subApi = {
    getAllBanks: async (): Promise<BankDetail[]> => {
        return apiClient.get('/bank')
    },
    getSubscriptionDetails: async (): Promise<SubscriptionResponse> => {
        return apiClient.get(`${API}`)
    },
    submitSubscriptionPayment: async (payload: SubmitPaymentApiPayload) => {
        return await apiClient.post(`${API}/payment`, payload);
    },
}