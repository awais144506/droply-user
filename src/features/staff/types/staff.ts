export type CustomerStatus = "ACTIVE" | "DISABLE"
export type StaffRole = "MANAGER" | "RIDER"

export interface StaffList {
    id: string;
    staffCode: string;
    name: string;
    status: CustomerStatus
    phone: string;
    email: string;
    designation: StaffRole;
    joiningDate: string;
}

export interface Staff {
    id: string
}