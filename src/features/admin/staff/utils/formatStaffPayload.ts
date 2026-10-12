import { CreateStaffFormData } from "../schema/create-staff-schema"
import { UpdateStaffFormData } from "../schema/update-staff-schema";

export type StaffRole = "MANAGER" | "RIDER";

export function formatStaffPayload(data: CreateStaffFormData, branchId: string, role: StaffRole) {
    return {
        branchId,
        role: role,
        name: data.name,
        email: data.email || undefined,
        phone: data.phone,
        cnic: data.cnic,
        address: data.address || undefined,
        basicSalary: data.salary,
        joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString() : undefined,
        fatherName: data.fatherName || undefined,
        fatherCnic: data.fatherCnic || undefined,
        bloodGroup: data.bloodGroup || undefined,
        guarantorName: data.guarantorName || undefined,
        guarantorCnic: data.guarantorCnic || undefined,
        guarantorPhone: data.guarantorPhone || undefined,
        zoneIds: role === "RIDER" ? data.zoneIds : undefined,
        vehicleId: role === "RIDER" ? data.vehicleId : undefined,
        licenseNumber: role === "RIDER" ? (data.licenseNumber || undefined) : undefined,
    }
}

export function updateStaffPayload(data: UpdateStaffFormData) {
    return {
        role: data.role,
        name: data.name,
        phone: data.phone,
        cnic: data.cnic,
        address: data.address || undefined,
        basicSalary: data.salary,
        joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString() : undefined,
        fatherName: data.fatherName || undefined,
        fatherCnic: data.fatherCnic || undefined,
        bloodGroup: data.bloodGroup || undefined,
        guarantorName: data.guarantorName || undefined,
        guarantorCnic: data.guarantorCnic || undefined,
        guarantorPhone: data.guarantorPhone || undefined,
        zoneIds: data.role === "RIDER" ? data.zoneIds : undefined,
        vehicleId: data.role === "RIDER" ? data.vehicleId : undefined,
        licenseNumber: data.role === "RIDER" ? (data.licenseNumber || undefined) : undefined,
    }
}