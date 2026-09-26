import { apiClient } from "@/lib/api-client";
import { BankDetail } from "../types/subscription";
export const subApi = {
    getAllBanks: async (): Promise<BankDetail[]> => {
        return apiClient.get('/bank-details')
    }
}