// utils/formatStaffPayload.ts
import { CreateStaffFormData } from "../schema/create-staff-schema"

export type StaffRole = "MANAGER" | "RIDER";

export function formatStaffPayload(data: CreateStaffFormData, branchId: string, role: StaffRole) {
    return {
        branchId,
        designation: role,
        name: data.name,
        email: data.email || undefined,
        phone: data.phone,
        cnic: data.cnic,
        currentAddress: data.address || undefined,
        basicSalary: data.salary,
        joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString() : undefined,
        fatherName: data.fatherName || undefined,
        fatherCnic: data.fatherCnic || undefined,
        bloodGroup: data.bloodGroup || undefined,
        guarantorName: data.guarantorName || undefined,
        guarantorCnic: data.guarantorCnic || undefined,
        guarantorPhone: data.guarantorPhone || undefined,
        zoneIds: role === "RIDER" ? data.zoneIds : undefined,
        vehicleIds: role === "RIDER" ? data.vehicleIds : undefined,
        licenseNumber: role === "RIDER" ? (data.licenseNumber || undefined) : undefined,
    }
}