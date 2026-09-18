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

// types/staff.ts (or wherever you keep your types)

export interface StaffZone {
  id: string;      // Assuming your backend sends IDs along with the names
  name: string;
}

export interface StaffVehicle {
  id: string;      // Assuming your backend sends IDs
  modelInfo: string;
  registration: string;
  status: "ACTIVE" | "MAINTENANCE" | "DISABLE"; 
  type: string;
}

export interface Staff {
  id: string;
  branchId: string;
  staffCode: string;
  name: string;
  designation: "RIDER" | "MANAGER";
  status: "ACTIVE" | "DISABLE";
  phone: string;
  email: string;
  currentAddress: string;
  emergencyContact: string | null;
  cnic: string;
  imageUrl: string | null;
  fatherName: string;
  fatherCnic: string;
  bloodGroup: string;
  basicSalary: number;
  joiningDate: string; // ISO Date string
  licenseNumber: string | null;
  guarantorName: string | null;
  guarantorCnic: string | null;
  guarantorPhone: string | null;
  createdAt: string;
  updatedAt: string;
  zones?: StaffZone[];
  assignedVehicles?: StaffVehicle[];
}