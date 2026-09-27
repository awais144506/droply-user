import { apiClient } from "@/lib/api-client";
import { ZoneDetails, ZoneResponsePayload } from "../types";
import { ZoneFormValues } from "../schema/create-zone-schema";
import { EditZoneFormValues } from "../schema/edit-zone-schema";

export const zoneApi = {
    // Fetching Data
    getAllZone: async (branchId: string): Promise<ZoneResponsePayload> => {
        return await apiClient.get(`/zone/branches/${branchId}`);
    },
    getZone: async (zoneId: string): Promise<ZoneDetails> => {
        return await apiClient.get(`/zone/${zoneId}`);
    },
    // Mutation
    createNewZone: async (newZone: ZoneFormValues): Promise<ZoneDetails> => {
        return await apiClient.post('zone', newZone);
    },
    updateZone: async (id: string, updateZone: EditZoneFormValues): Promise<ZoneDetails> => {
        return await apiClient.patch(`/zone/${id}`, updateZone);
    },
    deletZone: async (id: string): Promise<ZoneDetails> => {
        return await apiClient.delete(`/zone/${id}`);
    }
};