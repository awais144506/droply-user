import * as yup from "yup"

export const editZoneSchema = yup.object().shape({
    name: yup
        .string()
        .min(5, "Zone name is too short")
        .required("Zone name is required"),
    latitude: yup
        .number()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value))
        .typeError("Latitude must be a valid number")
        .nullable()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
        .optional(),
    longitude: yup
        .number()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value))
        .typeError("Longitude must be a valid number")
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
        .nullable()
        .optional(),
});

export type EditZoneFormValues = yup.InferType<typeof editZoneSchema>;