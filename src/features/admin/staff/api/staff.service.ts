// api/staff.service.ts
import { apiClient } from "@/lib/api-client";
import { StaffApiResponse, Staff } from "../types/staff";
import { CreateStaffFormData } from "../schema/create-staff-schema";
import { updateStaffEmailValue } from "../utils/updateEmailDialog";
import { UpdateStaffFormData } from "@/features/admin/staff/schema/update-staff-schema";


const API = '/staff/user'

export const staffApi = {
    getAllStaff: async (): Promise<StaffApiResponse> => {
        return await apiClient.get(`${API}`)
    },
    getStaff: async (id: string): Promise<Staff> => {
        return await apiClient.get(`${API}/${id}`)
    },
    createNewStaff: async (newStaff: CreateStaffFormData): Promise<Staff> => {
        return await apiClient.post(`${API}`, newStaff);
    },
    updateStaff: async (id: string, updateData: UpdateStaffFormData): Promise<Staff> => {
        return await apiClient.patch(`${API}/${id}`, updateData);
    },
    disableStaff: async (id: string): Promise<Staff> => {
        return await apiClient.delete(`${API}/${id}`)
    },
    enableStaff: async (id: string): Promise<Staff> => {
        return await apiClient.patch(`${API}/${id}/enable`);
    },
    updateStaffEmail: async (id: string, updateEmail: updateStaffEmailValue) => {
        return await apiClient.patch(`${API}/${id}/email`, updateEmail)
    }
}