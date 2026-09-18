// api/staff.service.ts
import { apiClient } from "@/lib/api-client";
import { StaffApiResponse, Staff } from "../types/staff";
import { ActivityLog } from "@/types/ActivityLog";
import { formatStaffPayload } from "../utils/formatStaffPayload";
import { updateStaffEmailValue } from "../utils/updateEmailDialog";
import { UpdateStaffFormData } from "@/features/admin/staff/schema/update-staff-schema";
export type CreateStaffPayload = ReturnType<typeof formatStaffPayload>;

export const staffApi = {
    getAllStaff: async (branchId: string): Promise<StaffApiResponse> => {
        return await apiClient.get(`/staff/branch/${branchId}`)
    },
    getStaff: async (id: string): Promise<Staff> => {
        return await apiClient.get(`/staff/${id}`)
    },
    getStaffLogs: async (branchId: string): Promise<ActivityLog[]> => {
        return await apiClient.get(`/staff/logs/${branchId}`)
    },

    createNewStaff: async (newStaff: CreateStaffPayload): Promise<Staff> => {
        return await apiClient.post(`/staff`, newStaff);
    },
    updateStaff: async (id: string, updateData: UpdateStaffFormData): Promise<Staff> => {
        return await apiClient.patch(`/staff/${id}`, updateData);
    },
    disableStaff: async (id: string): Promise<Staff> => {
        return await apiClient.delete(`/staff/${id}`)
    },
    enableStaff: async (id: string): Promise<Staff> => {
        return await apiClient.patch(`/staff/${id}/enable`);
    },
    updateStaffEmail: async (id: string, updateEmail: updateStaffEmailValue) => {
        return await apiClient.patch(`/staff/${id}/email`, updateEmail)
    }
}