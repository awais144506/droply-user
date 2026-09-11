import { apiClient } from "@/lib/api-client"
import { BranchSettingData } from "../types/settings"

export const branchSettingApi = {
    getBranchSettings: async (branchId: string): Promise<BranchSettingData> => {
        return apiClient.get(`/settings/${branchId}`);
    },
    updateBranchSettings: async (branchId: string, updateSettings: BranchSettingData): Promise<BranchSettingData> => {
        return apiClient.patch(`settings/${branchId}`, updateSettings);
    }
}