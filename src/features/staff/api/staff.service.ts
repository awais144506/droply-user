// api/staff.service.ts
import { apiClient } from "@/lib/api-client";
import { StaffList, Staff } from "../types/staff";
import { ActivityLog } from "@/types/ActivityLog";
import { formatStaffPayload } from "../utils/formatStaffPayload";

export type CreateStaffPayload = ReturnType<typeof formatStaffPayload>;

export const staffApi = {
    getAllStaff: async (branchId: string): Promise<StaffList[]> => {
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
    disableStaff: async (id: string): Promise<Staff> => {
         return await apiClient.delete(`/staff/${id}`)
    }
}