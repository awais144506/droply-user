import { apiClient } from "@/lib/api-client";
import { BankDetail, SubscriptionResponse } from "../types/subscription";
export const subApi = {
    getAllBanks: async (): Promise<BankDetail[]> => {
        return apiClient.get('/bank')
    },
    getSubscriptionDetails: async (branchId: string): Promise<SubscriptionResponse> => {
        return apiClient.get(`/subscription/branch/${branchId}`)
    }
}