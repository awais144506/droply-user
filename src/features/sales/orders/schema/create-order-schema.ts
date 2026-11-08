import * as yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";

export const orderItemSchema = yup.object({
  id: yup.string().required(),
  productId: yup.string().required("Product is required"),
  priceTierId: yup.string().nullable().optional(),
  returnableProductId: yup.string().nullable().optional(),
  paidQty: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  emptiesIn: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, "Cannot be negative")
    .required(),
  emptiesOut: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, "Cannot be negative")
    .required()
    .default(0),
  hasOffer: yup.boolean().default(false),
  offerQty: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0)
    .default(0),
  discountPrice: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0)
    .default(0),
  chargedDeposit: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0)
    .default(0),
  isDepositCharged: yup.boolean().default(false),
  unitPrice: yup.number().min(0).default(0),
  freeProductId: yup.string().optional(),
});

export const orderSchema = yup.object({
  category: yup.string().oneOf(["WALK_IN", "DELIVERY"]).required(),
  orderType: yup.string().oneOf(["WALK_IN", "DELIVERY"]).required(),
  customerId: yup.string().required("Customer is required"),

  // 3rd Party / Local Driver manual fields
  driverName: yup.string().optional(),
  driverPhone: yup
    .string()
    .optional()
    .test("is-valid-phone", "Must be a valid phone number", (value) => {
      if (!value) return true;
      return isValidPhoneNumber(value);
    }),
  driverCnic: yup.string().optional(),
  vehiclePlate: yup.string().optional(),

  // Conditionally require riderId if orderType is DELIVERY AND driverName is empty
  riderId: yup.string().when(["orderType", "driverName"], ([orderType, driverName], schema) => {
    if (orderType === "DELIVERY" && (!driverName || driverName.trim() === "")) {
      return schema.required("Assign a branch rider or enter 3rd party driver details");
    }
    return schema.optional();
  }),

  scheduledDate: yup.string().optional(),
  items: yup.array().of(orderItemSchema).min(1, "Add at least one item").required(),
  discount: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0)
    .default(0),
  paymentMethod: yup.string().oneOf(["CASH", "BANK", "KHATA"]).default("CASH"),
  amountPaid: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0)
    .default(0),
  deliveryCharges: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0)
    .default(0),
});

// Infer TypeScript types directly from the Yup schema
export type OrderFormValues = yup.InferType<typeof orderSchema>;