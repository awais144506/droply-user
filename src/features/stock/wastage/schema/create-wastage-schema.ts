import * as yup from "yup";

export const createWastageSchema = yup.object({
  rawMaterialId: yup.string().required("Please select an item"),
  quantityWasted: yup
    .number()
    .typeError("Must be a number")
    .min(0.01, "Quantity must be greater than 0")
    .required("Quantity is required"),
  reason: yup.string().required("Please provide a reason for the wastage"),
  source: yup
    .string()
    .oneOf(['TRANSIT', 'WAREHOUSE', 'GENERAL'], "Invalid wastage source")
    .default('WAREHOUSE')
    .required("Source is required"),
});

export type CreateWastageFormValues = yup.InferType<typeof createWastageSchema>;