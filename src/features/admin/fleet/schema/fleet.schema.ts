import * as yup from "yup";

export const vehicleSchema = yup.object({
  registration: yup.string()
    .trim()
    .required("Registration number is required")
    .min(4, "Registration must be at least 4 characters")
    .uppercase("Registration must be uppercase"),
  modelInfo: yup.string().trim().required("Make and model info is required"),
  capacityInfo: yup.string().trim().optional(),
  type: yup.string()
    .oneOf(["MOTORCYCLE", "RIKSHAW", "TRUCK", "VAN", "OTHER"], "Invalid vehicle type")
    .default("MOTORCYCLE")
    .required("Vehicle type is required"),
  fuelType: yup.string()
    .oneOf(["PETROL", "DIESEL", "ELECTRIC"], "Invalid fuel type")
    .default("PETROL")
    .required("Fuel type is required"),
  status: yup.string()
    .oneOf(["ACTIVE", "MAINTENANCE", "RETIRED"], "Invalid status")
    .default("ACTIVE")
    .required("Status is required"),
  currentOdometer: yup.number()
    .typeError("Odometer must be a number")
    .min(0, "Odometer cannot be negative")
    .required("Current odometer reading is required"),
  assignedStaffId: yup.string().optional(),
});

export type VehicleFormValues = yup.InferType<typeof vehicleSchema>;

export const fuelExpenseSchema = yup.object({
  vehicleId: yup.string().required("Please select a vehicle"),
  date: yup.date()
    .typeError("Please enter a valid date")
    .default(() => new Date())
    .required("Date is required"),
  liters: yup.number()
    .typeError("Liters must be a number")
    .positive("Liters must be greater than zero")
    .required("Liters are required"),
  costPerLiter: yup.number()
    .typeError("Cost per liter must be a number")
    .positive("Cost must be greater than zero")
    .required("Cost per liter is required"),
  totalCost: yup.number()
    .typeError("Total cost must be a number")
    .positive("Total cost must be greater than zero")
    .required("Total cost is required"),
  odometerReading: yup.number()
    .typeError("Odometer reading must be a number")
    .min(0, "Odometer cannot be negative")
    .required("Odometer reading is required"),
});

export type FuelExpenseFormValues = yup.InferType<typeof fuelExpenseSchema>;