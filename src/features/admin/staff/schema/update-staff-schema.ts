import * as yup from "yup";

// Helper to strip dashes and spaces
const stripFormat = (value: string | undefined) => (value ? value.replace(/[\s-]/g, "") : value);

export const updateStaffSchema = yup.object().shape({
    designation: yup.string().required("Role/Designation is required"),
    name: yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
    phone: yup
        .string()
        .transform(stripFormat)
        .matches(/^((\+923[0-9]{8})|(03[0-9]{9}))$/, "Invalid Pakistani mobile number")
        .required("Phone number is required"),

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
    zoneIds: yup.array().of(yup.string().required()).when("designation", {
        is: "RIDER",
        then: (schema) => schema.min(1, "Please assign at least one zone").required(),
        otherwise: (schema) => schema.optional().default([]),
    }),
    vehicleIds: yup.array().of(yup.string().required()).when("designation", {
        is: "RIDER",
        then: (schema) => schema.min(1, "Please assign at least one vehicle").required(),
        otherwise: (schema) => schema.optional().default([]),
    }),

    licenseNumber: yup.string().when("designation", {
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

export type UpdateStaffFormData = yup.InferType<typeof updateStaffSchema>;