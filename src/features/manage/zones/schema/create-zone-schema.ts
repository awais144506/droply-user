import * as yup from "yup";

export const createZoneSchema = yup.object().shape({
  branchId: yup.string().required(),
  name: yup
    .string()
    .min(5, "Zone name is too short")
    .required("Zone name is required"),

  latitude: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .optional(),

  longitude: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .optional(),
});

// Export the inferred type so we can use it in our components
export type ZoneFormValues = yup.InferType<typeof createZoneSchema>;