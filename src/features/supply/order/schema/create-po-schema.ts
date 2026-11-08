import * as yup from "yup";

export const createPOSchema = yup.object({
  supplierId: yup.string().required("Please select a supplier"),
  notes: yup.string().optional(),
  advancePaid: yup.number()
    .transform((value) => (Number.isNaN(value) ? 0 : value))
    .min(0, "Cannot be negative")
    .default(0),
  items: yup.array().of(
    yup.object({
      productId: yup.string().required("Select an internal item"),
      supplierItemName: yup.string().required("Enter vendor's item name"),
      quantity: yup.number().transform((value) => (Number.isNaN(value) ? 0 : value)).positive("Must be > 0").required(),
      unitCost: yup.number().transform((value) => (Number.isNaN(value) ? 0 : value)).min(0, "Cannot be negative").required(),
    })
  ).min(1, "You must add at least one item to the PO"),
}).required();

export type CreatePOFormData = yup.InferType<typeof createPOSchema>;