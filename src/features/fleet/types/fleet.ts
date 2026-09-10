export type VehicleType = "MOTORCYCLE" | "VAN" | "RIKSHAW" | "TRUCK" | "OTHER"
export type FuelType = "PETROL" | "DIESEL" | "ELECTRIC"
export type VehicleStatus = "ACTIVE" | "MAINTENANCE" | "RETIRED"

export interface Vehicle {
    id: string;
    branchId: string;
    registration: string;
    modelInfo: string;
    make: string;
    capacityInfo?: string;
    type: VehicleType;
    fuelType: FuelType;
    status: VehicleStatus;
    currentOdometer: number;
    driverPhone?: string;
    assignedStaffId?: string;
    assignedTo?: { id: string; name: string; email: string };
}

export interface FuelExpense {
    id: string;
    vehicleId: string;
    date: string;
    liters: number;
    costPerLiter: number;
    totalCost: number;
    odometerReading: number;
    vehicle?: { registration: string; modelInfo: string };
}