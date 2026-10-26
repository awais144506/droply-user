import { ActivityLog } from "@/types/ActivityLog";
export type VehicleType = "MOTORCYCLE" | "VAN" | "RIKSHAW" | "TRUCK" | "OTHER";
export type FuelType = "PETROL" | "DIESEL" | "ELECTRIC";
export type VehicleStatus = "ACTIVE" | "MAINTENANCE" | "RETIRED";
export type ExpenseCategory = "FUEL" | "MAINTENANCE";

export interface VehicleExpense {
    id: string;
    vehicleId: string;
    category: ExpenseCategory;
    totalCost: number;
    date: string;
    odometerReading: number;
    notes?: string | null;
    liters?: number | null;
    costPerLiter?: number | null;
    serviceProvider?: string | null;
    invoiceNumber?: string | null;
    vehicle?: { id?: string; registration: string; modelInfo: string; type?: VehicleType };
    createdAt: string | Date;
    updatedAt?: string | Date;
}

export interface Vehicle {
    id: string;
    branchId: string;
    registration: string;
    modelInfo: string;
    make?: string | null; // Optional fallback if used in UI forms
    capacityInfo?: string | null;
    type: VehicleType;
    fuelType: FuelType;
    status: VehicleStatus;
    currentOdometer: number;
    assignedStaffId?: string | null;
    assignedTo?: { id: string; name: string; phone: string; status?: string } | null;
    expenses?: VehicleExpense[]; // 🔥 Updated from fuelExpenses to expenses
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export interface FleetStats {
    totalVehicles: number;
    activeCount: number;
    maintenanceCount: number;
    retiredCount: number;
    assignedCount: number;
    unassignedCount: number;
}

export interface VehicleListResponse {
    vehicles: Vehicle[];
    logs: ActivityLog[];
    stats: FleetStats;
}