import * as yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";
// Helper to strip dashes and spaces
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

  zoneIds: yup.array().of(yup.string().required()).when("$role", {
    is: "RIDER",
    then: (schema) => schema.min(1, "Please assign at least one zone").required(),
    otherwise: (schema) => schema.optional().default([]),
  }),

  vehicleIds: yup.array().of(yup.string().required()).when("$role", {
    is: "RIDER",
    then: (schema) => schema.min(1, "Please assign at least one vehicle").required(),
    otherwise: (schema) => schema.optional().default([]),
  }),

  // Optional: You can do the same for licenseNumber if it's mandatory for riders!
  licenseNumber: yup.string().when("$role", {
    is: "RIDER",
    then: (schema) => schema.optional(),
  }),

  // Extra Details
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