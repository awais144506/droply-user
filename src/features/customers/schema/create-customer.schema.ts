import * as yup from "yup";

export const createCustomerSchema = yup.object().shape({
  partyType: yup.string().required("Party type is required"),
  customerCategory: yup.string().required("Category is required"),
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Customer name is required"),
  phone: yup
    .string()
    .transform((value) => (value ? value.replace(/[\s-]/g, "") : value))
    .matches(
      /^((\+923[0-9]{8})|(03[0-9]{9}))$/,
      "Must be a valid Pakistani mobile number (e.g., 03001234567)"
    )
    .required("Phone number is required"),
  email: yup.string().email("Please enter a valid email address").optional().nullable(),
  address: yup.string().required("Address is required"),
  zoneId: yup.string().required("Delivery zone is required"),
  latitude: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .required("Required for tracking."),
  longitude: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .required("Required for tracking."),
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
  securityDeposit: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Deposit cannot be negative")
    .optional(),
  openingReturnables: yup.array().of(
    yup.object().shape({
      productId: yup.string().required("Product is required"),
      quantity: yup.number().min(1, "Must be at least 1").required("Quantity is required")
    })
  ).optional().default([]),
});

export type CreateCustomerFormData = yup.InferType<typeof createCustomerSchema>;