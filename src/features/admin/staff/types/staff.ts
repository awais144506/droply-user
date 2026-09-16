export type CustomerStatus = "ACTIVE" | "DISABLE"
export type StaffRole = "MANAGER" | "RIDER"

export interface StaffList {
    id: string;
    staffCode: string;
    name: string;
    status: string; // Or your specific Enum like CustomerStatus/StaffStatus
    phone: string;
    email: string | null;
    designation: string; // Or your StaffRole Enum
    joiningDate: string | null;
}

// 2. Represents the stats object
export interface StaffStats {
    totalStaff: number;
    activeStaffCount: number;
    activeManagers: number;
    activeRiders: number;
    disableStaff: number;
}

// 3. Represents the ENTIRE payload coming from the backend!
export interface StaffApiResponse {
    staff: StaffList[];
    stats: StaffStats;
    maxUserLimit: number;
}

export interface Staff {
    id: string
}