import { ActivityLog } from "@/types/ActivityLog";

export type StaffStatus = "ACTIVE" | "SUSPENDED";
export type StaffRole = "OWNER" | "MANAGER" | "RIDER";

export interface StaffZone {
    id: string;
    name: string;
}

export interface StaffVehicle {
    id: string;
    modelInfo: string;
    registration: string;
    status: string;
    type: string;
}

export interface StaffHrProfile {
    id: string;
    staffId: string;
    fatherName?: string | null;
    fatherCnic?: string | null;
    bloodGroup?: string | null;
    licenseNumber?: string | null;
    guarantorName?: string | null;
    guarantorCnic?: string | null;
    guarantorPhone?: string | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

// 1. Represents items in the table list (`findAllByBranch`)
export interface StaffList {
    id: string;
    staffCode: string;
    name: string;
    phone: string;
    email: string | null;
    cnic: string;
    role: StaffRole;
    status: StaffStatus;
    basicSalary: number;
    joiningDate: string | null;
    imageUrl?: string | null;
    zones?: StaffZone[];
    assignedVehicles?: StaffVehicle[];
}

// 2. Represents the branch staff stats object
export interface StaffStats {
    totalStaff: number;
    activeStaffCount: number;
    activeManagers: number;
    activeRiders: number;
    disableStaff: number;
}

// 3. Represents the ENTIRE payload coming from `findAllByBranch`
export interface StaffApiResponse {
    staff: StaffList[];
    logs: ActivityLog[];
    stats: StaffStats;
}

// 4. Represents the detailed single staff profile (`findOne`)
export interface Staff {
    id: string;
    branchId: string;
    staffCode: string;
    name: string;
    role: StaffRole;
    status: StaffStatus;
    phone: string;
    email: string;
    cnic: string;
    address?: string | null;
    imageUrl?: string | null;
    basicSalary: number;
    joiningDate?: string | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    hrProfile?: StaffHrProfile | null;
    zones?: StaffZone[];
    assignedVehicles?: StaffVehicle[];
}