import * as yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";

export const supplierSchema = yup.object().shape({
    firmName: yup
        .string()
        .min(2, "Firm name must be at least 2 characters")
        .required("Firm name is required"),

    supplierName: yup
        .string()
        .min(3, "Contact person name must be at least 3 characters")
        .required("Contact person name is required"),

    email: yup
        .string()
        .email("Invalid email format")
        .optional()
        .nullable()
        .transform((curr, orig) => (orig === "" ? null : curr)),

    phone: yup
        .string()
        .required("Phone number is required")
        .test("is-valid-phone", "Must be a valid phone number", (value) => {
            return value ? isValidPhoneNumber(value) : false;
        }),

    address: yup
        .string()
        .min(5, "Please provide a more detailed address")
        .required("Address is required"),

    city: yup
        .string()
        .required("City is required"),
});

export type SupplierFormData = yup.InferType<typeof supplierSchema>;