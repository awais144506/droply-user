import * as yup from "yup";

export const createItemSchema = yup.object().shape({
  name: yup.string().min(3, "Item name too short").required("Item name is required"),
  category: yup.string().oneOf(["FINISHED_GOOD", "RAW_MATERIAL", "TRADE", "EQUIPMENT", "PACKAGING"]).required(),
  trackingType: yup.string().oneOf(["OUTRIGHT", "RETURNABLE"]).required(),

  unitCost: yup.number().min(0, "Cannot be negative").transform((v, o) => (o === "" ? 0 : v)).required(),
  salePrice: yup.number().min(0, "Cannot be negative").transform((v, o) => (o === "" ? 0 : v)).required(),

  openingStock: yup.number().min(0).transform((v, o) => (o === "" ? 0 : v)).default(0),
  lowStockThreshold: yup.number().min(0).transform((v, o) => (o === "" ? 0 : v)).default(0),
  securityDeposit: yup
  .number()
  .transform((value, originalValue) => {
    if (originalValue == null || String(originalValue).trim() === "") {
      return 0;
    }
    return value;
  })
  .min(0, "Cannot be negative")
  .default(0)
  .nullable(),
  hasRecipe: yup.boolean().default(false),
  recipeItems: yup.array().of(
    yup.object().shape({
      rawMaterialId: yup.string().required("Select a material"),
      quantityRequired: yup.number().min(0.01, "Invalid quantity").required("Quantity required"),
    })
  ).when('hasRecipe', {
    is: true,
    then: (schema) => schema.min(1, "Recipe must contain at least one raw material"),
    otherwise: (schema) => schema.default([])
  }),
});

export type CreateItemFormData = yup.InferType<typeof createItemSchema>;