import * as yup from "yup"

const stripFormat = (value: string | undefined) => (value ? value.replace(/[\s-]/g, "") : value);

export const branchSettingsSchema = yup.object().shape({
    displayName: yup.string().required("Display Name is required"),
    displayPhone: yup
        .string()
        .transform(stripFormat)
        .matches(/^((\+923[0-9]{8})|(03[0-9]{9}))$/, "Invalid Pakistani mobile number")
        .required("Phone number is required"),
    displayEmail: yup.string().email("Must be a valid email address").optional(),
    displayAddress: yup.string().optional(),
});

export type BranchSettingsFormValues = yup.InferType<typeof branchSettingsSchema>