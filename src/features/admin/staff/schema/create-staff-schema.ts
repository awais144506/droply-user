import * as yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";

const stripFormat = (value: string | undefined) => (value ? value.replace(/[\s-]/g, "") : value);

export const createStaffSchema = yup.object().shape({
  name: yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .test("is-valid-phone", "Must be a valid phone number", (value) => {
      return value ? isValidPhoneNumber(value) : false;
    }),

  cnic: yup
    .string()
    .transform(stripFormat)
    .matches(/^[0-9]{13}$/, "CNIC must be exactly 13 digits without dashes")
    .required("CNIC is required"),

  address: yup.string().optional().nullable(),
  joiningDate: yup.string().optional().nullable(),
  salary: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Salary cannot be negative")
    .optional(),

  // Zones remain multi-select (array)
  zoneIds: yup.array().of(yup.string().required()).when("$role", {
    is: "RIDER",
    then: (schema) => schema.min(1, "Please assign at least one zone").required(),
    otherwise: (schema) => schema.optional().default([]),
  }),

  // 🔥 CHANGED: Vehicle is now a single string
  vehicleId: yup.string().when("$role", {
    is: "RIDER",
    then: (schema) => schema.required("Please assign exactly one vehicle"),
    otherwise: (schema) => schema.optional().nullable(),
  }),

  licenseNumber: yup.string().when("$role", {
    is: "RIDER",
    then: (schema) => schema.optional(),
  }),

  fatherName: yup.string().optional().nullable(),
  fatherCnic: yup
    .string()
    .transform(stripFormat)
    .matches(/^[0-9]{13}$/, { message: "Must be exactly 13 digits", excludeEmptyString: true })
    .optional().nullable(),

  bloodGroup: yup.string().optional().nullable(),
  guarantorName: yup.string().optional().nullable(),
  guarantorCnic: yup
    .string()
    .transform(stripFormat)
    .matches(/^[0-9]{13}$/, { message: "Must be exactly 13 digits", excludeEmptyString: true })
    .optional().nullable(),
  guarantorPhone: yup.string().optional().nullable(),
});

export type CreateStaffFormData = yup.InferType<typeof createStaffSchema>;