import * as yup from "yup";


const stripFormat = (value: string | undefined) => (value ? value.replace(/[\s-]/g, "") : value);

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
        .transform(stripFormat)
        .matches(/^((\+923[0-9]{8})|(03[0-9]{9}))$/, "Invalid Pakistani mobile number")
        .required("Phone number is required"),

    address: yup
        .string()
        .min(5, "Please provide a more detailed address")
        .required("Address is required"),

    city: yup
        .string()
        .required("City is required"),
});

export type SupplierFormData = yup.InferType<typeof supplierSchema>;