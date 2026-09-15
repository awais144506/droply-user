import { apiClient } from "@/lib/api-client";
import { ZoneDetails } from "../types";
import { ActivityLog } from "@/types/ActivityLog";
import { ZoneFormValues } from "../schema/create-zone-schema";
import { EditZoneFormValues } from "../schema/edit-zone-schema";

export const zoneApi = {
    //Fetching Data
    getAllZone: async (branchId: string): Promise<ZoneDetails[]> => {
        return await apiClient.get(`/zone/branches/${branchId}`)
    },
    getZone: async (zoneId: string): Promise<ZoneDetails> => {
        return await apiClient.get(`/zone/${zoneId}`)
    },
    getZonelogs: async (branchId: string): Promise<ActivityLog[]> => {
        return await apiClient.get(`/zone/logs/${branchId}`);
    },
    //Mutation
    createNewZone: async (newZone: ZoneFormValues): Promise<ZoneDetails> => {
        return await apiClient.post('zone', newZone);
    },
    updateZone: async (id: string, updateZone: EditZoneFormValues): Promise<ZoneDetails> => {
        return await apiClient.patch(`/zone/${id}`, updateZone);
    },
    deletZone: async (id: string): Promise<ZoneDetails> => {
        return await apiClient.delete(`/zone/${id}`);
    }
}