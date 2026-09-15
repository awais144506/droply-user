import * as yup from "yup";

export const orderItemSchema = yup.object({
  id: yup.string().required(),
  productId: yup.string().required("Product is required"),
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
});

export const orderSchema = yup.object({
  saleType: yup.string().oneOf(["WALK_IN", "DELIVERY"]).required(),
  customerId: yup.string().required("Customer is required"),

  // Conditionally require riderId if saleType is DELIVERY
  riderId: yup.string().when("saleType", {
    is: "DELIVERY",
    then: (schema) => schema.required("Rider is required for scheduled deliveries"),
    otherwise: (schema) => schema.optional(),
  }),

  scheduledDate: yup.string().optional(),
  items: yup.array().of(orderItemSchema).min(1, "Add at least one item").required(),
  remarks: yup.string().optional(),
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