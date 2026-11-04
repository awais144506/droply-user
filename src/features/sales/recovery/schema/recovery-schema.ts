import * as yup from "yup";

// ============================================================================
// 1. CUSTOMER RECOVERY SCHEMA
// ============================================================================

export const recoveryItemSchema = yup
  .object({
    id: yup.string().optional(),
    productId: yup.string().required("Returnable product is required"),
    productName: yup.string().optional(),
    maxHeld: yup.number().optional().default(0),
    quantityReturned: yup
      .number()
      .transform((val) => (isNaN(val) ? 0 : val))
      .min(1, "Must return at least 1 container")
      .required("Quantity is required"),
    goodToStoreQty: yup
      .number()
      .transform((val) => (isNaN(val) ? 0 : val))
      .min(0, "Cannot be negative")
      .required("Good quantity is required"),
    wastageQty: yup
      .number()
      .transform((val) => (isNaN(val) ? 0 : val))
      .min(0, "Cannot be negative")
      .required("Wastage quantity is required"),
    depositRefunded: yup
      .number()
      .transform((val) => (isNaN(val) ? 0 : val))
      .min(0, "Cannot be negative")
      .default(0),
  })
  .test(
    "split-equals-returned",
    "Good to Store + Wastage must equal Quantity Returned",
    function (value) {
      if (!value) return true;
      const totalSplit = Number(value.goodToStoreQty || 0) + Number(value.wastageQty || 0);
      if (totalSplit !== Number(value.quantityReturned || 0)) {
        return this.createError({
          path: `${this.path}.goodToStoreQty`,
          message: `Good (${value.goodToStoreQty}) + Wastage (${value.wastageQty}) must equal ${value.quantityReturned}`,
        });
      }
      return true;
    }
  );

export const customerRecoverySchema = yup
  .object({
    customerId: yup.string().required("Customer is required"),
    paymentMethod: yup
      .string()
      .oneOf(["CASH", "BANK", "KHATA"])
      .default("CASH")
      .required(),
    amountReceived: yup
      .number()
      .transform((val) => (isNaN(val) ? 0 : val))
      .min(0, "Amount cannot be negative")
      .default(0)
      .required(),
    remarks: yup.string().optional().default(""),
    items: yup.array().of(recoveryItemSchema).default([]),
  })
  .test(
    "has-amount-or-items",
    "Enter a recovery amount or add at least one returnable container",
    function (value) {
      if (!value) return false;
      const hasAmount = Number(value.amountReceived || 0) > 0;
      const hasItems = Array.isArray(value.items) && value.items.length > 0;
      if (!hasAmount && !hasItems) {
        return this.createError({
          path: "amountReceived",
          message: "Provide either a recovery amount or at least one returnable item",
        });
      }
      return true;
    }
  );

export type CustomerRecoveryFormValues = yup.InferType<typeof customerRecoverySchema>;

// ============================================================================
// 2. SALE RETURN SCHEMA
// ============================================================================

export const saleReturnRecipeMaterialSchema = yup
  .object({
    rawMaterialId: yup.string().required("Raw material ID is required"),
    rawMaterialName: yup.string().optional(),
    unitOfMeasure: yup.string().optional(),
    expectedQuantity: yup
      .number()
      .transform((val) => (isNaN(val) ? 0 : val))
      .min(0)
      .required(),
    returnedToStoreQty: yup
      .number()
      .transform((val) => (isNaN(val) ? 0 : val))
      .min(0, "Cannot be negative")
      .required("Safe to store qty is required"),
    wastageQty: yup
      .number()
      .transform((val) => (isNaN(val) ? 0 : val))
      .min(0, "Cannot be negative")
      .required("Wastage qty is required"),
  })
  .test(
    "recipe-split-equals-expected",
    "Safe to Store + Wastage must equal Expected Quantity",
    function (value) {
      if (!value) return true;
      const total = Number(value.returnedToStoreQty || 0) + Number(value.wastageQty || 0);
      if (total !== Number(value.expectedQuantity || 0)) {
        return this.createError({
          path: `${this.path}.returnedToStoreQty`,
          message: `Store (${value.returnedToStoreQty}) + Wastage (${value.wastageQty}) must equal ${value.expectedQuantity}`,
        });
      }
      return true;
    }
  );

export const saleReturnItemSchema = yup
  .object({
    id: yup.string().optional(),
    orderLineItemId: yup.string().optional(),
    productId: yup.string().required("Product is required"),
    productName: yup.string().optional(),
    soldQuantity: yup.number().optional().default(0),
    availableToReturn: yup.number().optional().default(0),
    unitPrice: yup.number().optional().default(0),
    returnQuantity: yup
      .number()
      .transform((val) => (isNaN(val) ? 0 : val))
      .min(1, "Return quantity must be at least 1")
      .required("Return quantity is required"),
    goodToStoreQty: yup
      .number()
      .transform((val) => (isNaN(val) ? 0 : val))
      .min(0, "Cannot be negative")
      .required(),
    wastageQty: yup
      .number()
      .transform((val) => (isNaN(val) ? 0 : val))
      .min(0, "Cannot be negative")
      .required(),
    hasRecipe: yup.boolean().default(false),
    recipeMaterials: yup
      .array()
      .of(saleReturnRecipeMaterialSchema)
      .optional()
      .default([]),
  })
  .test(
    "item-split-equals-return",
    "Good to Store + Wastage must equal Return Quantity",
    function (value) {
      if (!value) return true;
      const total = Number(value.goodToStoreQty || 0) + Number(value.wastageQty || 0);
      if (total !== Number(value.returnQuantity || 0)) {
        return this.createError({
          path: `${this.path}.goodToStoreQty`,
          message: `Store (${value.goodToStoreQty}) + Wastage (${value.wastageQty}) must equal ${value.returnQuantity}`,
        });
      }
      return true;
    }
  );

export const saleReturnSchema = yup.object({
  customerId: yup.string().required("Customer is required"),
  orderId: yup.string().required("Completed order is required"),
  paymentMethod: yup
    .string()
    .oneOf(["CASH", "BANK", "KHATA"])
    .default("CASH")
    .required(),
  depositRefunded: yup
    .number()
    .transform((val) => (isNaN(val) ? 0 : val))
    .min(0)
    .default(0),
  reason: yup.string().optional().default(""),
  remarks: yup.string().optional().default(""),
  items: yup
    .array()
    .of(saleReturnItemSchema)
    .min(1, "Select at least one product to return")
    .required(),
});

export type SaleReturnFormValues = yup.InferType<typeof saleReturnSchema>;