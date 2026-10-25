import * as yup from "yup";

export const priceTierSchema = yup.object().shape({
  id: yup.string().optional(),
  title: yup.string().optional(),
  unitCost: yup
    .number()
    .min(0, "Cannot be negative")
    .transform((v, o) => (o === "" ? 0 : v))
    .required("Unit cost is required"),
  salePrice: yup
    .number()
    .min(0, "Cannot be negative")
    .transform((v, o) => (o === "" ? 0 : v))
    .required("Sale price is required"),
  isDefault: yup.boolean().default(false),
  isActive: yup.boolean().default(true),
});

export const recipeIngredientSchema = yup.object().shape({
  childItemId: yup.string().required("Select an ingredient"),
  quantity: yup
    .number()
    .min(0.0001, "Invalid quantity")
    .transform((v, o) => (o === "" ? 0 : v))
    .required("Quantity required"),
});

export const createItemSchema = yup.object().shape({
  productCode: yup.string().optional(),
  name: yup.string().min(3, "Item name too short").required("Item name is required"),

  category: yup
    .string()
    .oneOf(["FINISHED_GOOD", "RAW_MATERIAL", "TRADE", "EQUIPMENT", "PACKAGING", "SERVICE"])
    .required("Category is required"),

  trackingType: yup
    .string()
    .oneOf(["OUTRIGHT", "RETURNABLE"])
    .required("Tracking type is required"),

  unitOfMeasure: yup
    .string()
    .oneOf(["PIECE", "KG", "GRAM", "LITER", "MILLILITER", "PACK", "CARTON"])
    .required("Unit of measure is required"),

  // Price Tiers array (at least 1 tier required)
  priceTiers: yup
    .array()
    .of(priceTierSchema)
    .min(1, "At least one price tier is required")
    .required(),

  openingStock: yup.number().min(0).transform((v, o) => (o === "" ? 0 : v)).default(0),
  lowStockThreshold: yup.number().min(0).transform((v, o) => (o === "" ? 0 : v)).default(10),

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

  recipeIngredients: yup.array().of(recipeIngredientSchema).when('hasRecipe', {
    is: true,
    then: (schema) => schema.min(1, "Recipe must contain at least one ingredient"),
    otherwise: (schema) => schema.default([])
  })
});

export type CreateItemFormData = yup.InferType<typeof createItemSchema>;