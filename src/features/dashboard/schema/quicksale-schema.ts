import * as yup from "yup";

export const quickSaleItemSchema = yup.object({
  productId: yup.string().nullable().optional(),
  itemName: yup.string().trim().required("Item name is required"),
  unit: yup.string().default("PIECE"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .positive("Quantity must be greater than 0")
    .required("Quantity is required"),
  unitPrice: yup
    .number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .required("Unit price is required"),
  subtotal: yup
    .number()
    .typeError("Subtotal must be a number")
    .min(0)
    .required("Subtotal is required"),
});

export const quickSaleSchema = yup.object({
  staffId: yup.string().required("Staff ID is required"),
  customerName: yup
    .string()
    .trim()
    .default("Walk-in Customer")
    .required("Customer name is required"),
  customerPhone: yup.string().trim().nullable().optional(),
  paymentMethod: yup
    .mixed<"CASH" | "ONLINE">()
    .oneOf(["CASH", "ONLINE"], "Invalid payment method")
    .default("CASH")
    .required(),
  subTotal: yup.number().min(0).required(),
  discount: yup
    .number()
    .min(0, "Discount cannot be negative")
    .default(0)
    .test(
      "max-discount",
      "Discount cannot exceed Subtotal",
      function (value) {
        const { subTotal } = this.parent;
        return (value || 0) <= (subTotal || 0);
      }
    ),
  totalAmount: yup.number().min(0).required(),
  cashReceived: yup
    .number()
    .nullable()
    .optional()
    .test(
      "min-cash-received",
      "Cash received cannot be less than Total Amount",
      function (value) {
        const { totalAmount } = this.parent;
        if (value === undefined || value === null) return true;
        return value >= (totalAmount || 0);
      }
    ),
  changeDue: yup.number().min(0).default(0).optional(),
  items: yup
    .array()
    .of(quickSaleItemSchema)
    .min(1, "Add at least one item to generate a sale")
    .required("Items are required"),
});

export type QuickSaleFormValues = yup.InferType<typeof quickSaleSchema>;