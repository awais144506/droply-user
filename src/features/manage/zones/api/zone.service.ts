import { apiClient } from "@/lib/api-client";
import { ZoneDetails, ZoneResponsePayload } from "../types";
import { ZoneFormValues } from "../schema/create-zone-schema";
import { EditZoneFormValues } from "../schema/edit-zone-schema";

const API = '/zone/user'

export const zoneApi = {
    // Fetching Data
    getAllZone: async (): Promise<ZoneResponsePayload> => {
        return await apiClient.get(`${API}/branches`);
    },
    getZone: async (zoneId: string): Promise<ZoneDetails> => {
        return await apiClient.get(`${API}/${zoneId}`);
    },
    // Mutation
    createNewZone: async (newZone: ZoneFormValues): Promise<ZoneDetails> => {
        return await apiClient.post(`${API}`, newZone);
    },
    updateZone: async (id: string, updateZone: EditZoneFormValues): Promise<ZoneDetails> => {
        return await apiClient.patch(`${API}/${id}`, updateZone);
    },
    deletZone: async (id: string): Promise<ZoneDetails> => {
        return await apiClient.delete(`${API}/${id}`);
    }
};