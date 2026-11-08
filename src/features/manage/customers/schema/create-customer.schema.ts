import * as yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";

export const DELIVERY_SCHEDULE_TYPES = [
  "ON_DEMAND",
  "EVERYDAY",
  "CUSTOM_DAYS",
] as const;

export const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export type DeliveryScheduleType = (typeof DELIVERY_SCHEDULE_TYPES)[number];
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const createCustomerSchema = yup.object().shape({
  partyType: yup.string().required("Party type is required"),
  category: yup.string().required("Category is required"),
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Customer name is required"),

  phone: yup
    .string()
    .required("Phone number is required")
    .test("is-valid-phone", "Must be a valid phone number", (value) => {
      return value ? isValidPhoneNumber(value) : false;
    }),

  email: yup
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .email("Please enter a valid email address")
    .nullable()
    .optional(),
  address: yup.string().required("Address is required"),
  ntn: yup.string().nullable().optional(),
  strn: yup.string().nullable().optional(),
  zoneId: yup.string().nullable().optional(),

  status: yup
    .string()
    .oneOf(["ACTIVE", "BLOCKED"])
    .default("ACTIVE")
    .optional(),

  // --- Delivery Schedule ---
  deliveryScheduleType: yup
    .string()
    .oneOf(DELIVERY_SCHEDULE_TYPES, "Invalid delivery schedule type")
    .default("ON_DEMAND")
    .required("Delivery schedule is required"),

  deliveryDays: yup
    .array()
    .of(yup.string().oneOf(DAYS_OF_WEEK).required())
    .default([])
    .when("deliveryScheduleType", {
      is: "CUSTOM_DAYS",
      then: (schema) =>
        schema
          .min(1, "Please select at least one delivery day")
          .required("Please select at least one delivery day"),
      otherwise: (schema) => schema.optional(),
    }),

  latitude: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .required("Required for tracking."),
  longitude: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
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

  returnables: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup.string().required("Product is required"),
        quantity: yup
          .number()
          .min(1, "Must be at least 1")
          .required("Quantity is required"),
      }),
    )
    .optional()
    .default([]),
});

export type CreateCustomerFormData = yup.InferType<typeof createCustomerSchema>;