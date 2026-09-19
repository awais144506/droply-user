// utils/formatStaffPayload.ts
import { CreateStaffFormData } from "../schema/create-staff-schema"
import { UpdateStaffFormData } from "../schema/update-staff-schema";
import { formatPakistaniPhone } from "@/lib/utils/functions/setFormat";

export type StaffRole = "MANAGER" | "RIDER";

export function formatStaffPayload(data: CreateStaffFormData, branchId: string, role: StaffRole) {
    return {
        branchId,
        designation: role,
        name: data.name,
        email: data.email || undefined,
        phone: formatPakistaniPhone(data.phone),
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

export function updateStaffPayload(data: UpdateStaffFormData) {
    return {
        designation: data.designation,
        name: data.name,
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
        zoneIds: data.designation === "RIDER" ? data.zoneIds : undefined,
        vehicleIds: data.designation === "RIDER" ? data.vehicleIds : undefined,
        licenseNumber: data.designation === "RIDER" ? (data.licenseNumber || undefined) : undefined,
    }
}