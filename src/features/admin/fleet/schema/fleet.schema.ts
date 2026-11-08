import * as yup from "yup";

// Helper to safely transform empty/NaN number inputs to null or undefined
const numberOrNull = yup
  .mixed()
  .transform((val, originalVal) => (originalVal === "" || isNaN(originalVal) ? null : val))
  .nullable();

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
  assignedStaffId: yup.string().nullable().optional(),
});

export type VehicleFormValues = yup.InferType<typeof vehicleSchema>;

export const vehicleExpenseSchema = yup.object({
  vehicleId: yup.string().required("Please select a vehicle"),
  category: yup.string()
    .oneOf(["FUEL", "MAINTENANCE"], "Invalid category")
    .required("Expense category is required"),
  date: yup.date()
    .typeError("Please enter a valid date")
    .default(() => new Date())
    .required("Date is required"),
  totalCost: yup.number()
    .typeError("Total cost must be a number")
    .positive("Total cost must be greater than zero")
    .required("Total cost is required"),
  odometerReading: yup.number()
    .typeError("Odometer reading must be a number")
    .min(0, "Odometer cannot be negative")
    .required("Odometer reading is required"),
  notes: yup.string().nullable().optional(),

  // --- Fuel Specific (Conditionally Required) ---
  liters: numberOrNull
    .when("category", {
      is: "FUEL",
      then: () => yup.number().typeError("Liters must be a number").positive("Must be greater than zero").required("Liters are required"),
      otherwise: () => yup.number().nullable().notRequired(),
    }),
  costPerLiter: numberOrNull
    .when("category", {
      is: "FUEL",
      then: () => yup.number().typeError("Cost must be a number").positive("Must be greater than zero").required("Cost per liter is required"),
      otherwise: () => yup.number().nullable().notRequired(),
    }),

  // --- Maintenance Specific ---
  serviceProvider: yup.string().nullable().optional(),
  invoiceNumber: yup.string().nullable().optional(),
});

export type VehicleExpenseFormValues = yup.InferType<typeof vehicleExpenseSchema>;