import * as yup from "yup"
import { isValidPhoneNumber } from "react-phone-number-input";

export const branchSettingsSchema = yup.object().shape({
    name: yup.string().required("Display Name is required"),
    phone: yup
        .string()
        .required("Phone number is required")
        .test("is-valid-phone", "Must be a valid phone number", (value) => {
            return value ? isValidPhoneNumber(value) : false;
        }),
    email: yup.string().email("Must be a valid email address").optional(),
    address: yup.string().optional(),
    ntn: yup.string().optional(),
    strn: yup.string().optional(),
});

export type BranchSettingsFormValues = yup.InferType<typeof branchSettingsSchema>