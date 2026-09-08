import * as yup from "yup";

export const createCustomerSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Customer name is required"),

  phone: yup
    .string()
    // Strip spaces and dashes so validation is reliable
    .transform((value) => (value ? value.replace(/[\s-]/g, "") : value))
    .matches(
      /^((\+923[0-9]{8})|(03[0-9]{9}))$/,
      "Must be a valid Pakistani mobile number (e.g., 03001234567)"
    )
    .required("Phone number is required"),

  email: yup
    .string()
    .email("Please enter a valid email address")
    .optional()
    .nullable(), // Allows the field to be empty

  address: yup
    .string()
    .optional()
    .nullable(),

  zoneId: yup
    .string()
    .optional()
    .nullable(),

  latitude: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .optional(),

  longitude: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .optional(),

  // Financials & Assets (Transform empty string to 0 or undefined)
  customerCredit: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Credit cannot be negative")
    .optional(),

  customerAdvance: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Advance cannot be negative")
    .optional(),

  openingReturnables: yup
    .number()
    .integer("Must be a whole number")
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Cannot be negative")
    .optional(),
});

// Export the inferred type for use in React Hook Form
export type CustomerFormValues = yup.InferType<typeof createCustomerSchema>;