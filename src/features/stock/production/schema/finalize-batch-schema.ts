import * as yup from "yup";

export const finalizeBatchSchema = yup.object({
  actualYield: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Actual yield cannot be negative")
    .required("Actual yield is required"),
  wastage: yup.array().of(
    yup.object({
      rawMaterialId: yup.string().required("Material is required"),
      quantity: yup
        .number()
        .typeError("Must be a number")
        .min(0.01, "Quantity must be greater than 0")
        .required("Quantity is required"),
      reason: yup.string().required("Reason is required"),
    })
  ).default([]),
});

export type FinalizeBatchFormValues = yup.InferType<typeof finalizeBatchSchema>;