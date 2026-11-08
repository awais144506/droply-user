import { apiClient } from "@/lib/api-client"
import { BranchSettingData } from "../types/settings"

const API= '/settings/user'
export const branchSettingApi = {
    getBranchSettings: async (): Promise<BranchSettingData> => {
        return apiClient.get(`${API}`);
    },
    updateBranchSettings: async (updateSettings: BranchSettingData): Promise<BranchSettingData> => {
        return apiClient.patch(`${API}`, updateSettings);
    }
}