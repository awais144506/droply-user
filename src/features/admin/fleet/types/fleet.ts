export type VehicleType = "MOTORCYCLE" | "VAN" | "RIKSHAW" | "TRUCK" | "OTHER";
export type FuelType = "PETROL" | "DIESEL" | "ELECTRIC";
export type VehicleStatus = "ACTIVE" | "MAINTENANCE" | "RETIRED";
export type ExpenseCategory = "FUEL" | "MAINTENANCE";

export interface VehicleExpense {
    id: string;
    vehicleId: string;
    category: ExpenseCategory;
    totalCost: number;
    odometerReading: number;
    notes?: string | null;

    // --- Fuel Specific (Optional) ---
    liters?: number | null;
    costPerLiter?: number | null;

    // --- Maintenance Specific (Optional) ---
    serviceProvider?: string | null;
    invoiceNumber?: string | null;

    vehicle?: { registration: string; modelInfo: string };
    createdAt: string | Date;
    updatedAt?: string | Date;
}

export interface Vehicle {
    id: string;
    branchId: string;
    registration: string;
    modelInfo: string;
    make: string;
    capacityInfo?: string | null;
    type: VehicleType;
    fuelType: FuelType;
    status: VehicleStatus;
    currentOdometer: number;
    assignedStaffId?: string | null;
    assignedTo?: { id: string; name: string; phone: string } | null;

    // Kept as 'fuelExpenses' because your Prisma schema still uses this relation name
    fuelExpenses: VehicleExpense[];

    createdAt?: string | Date;
    updatedAt?: string | Date;
}