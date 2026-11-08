import { isValidPhoneNumber } from "react-phone-number-input";
import * as yup from "yup";

// Helper to prevent React Hook Form from throwing NaN errors when a user clears a number input
const emptyStringToZero = (value: unknown, originalValue: unknown) =>
    String(originalValue).trim() === "" || Number.isNaN(value) ? 0 : value;

const emptyStringToUndefined = (value: unknown, originalValue: unknown) =>
    String(originalValue).trim() === "" || Number.isNaN(value) ? undefined : value;

// 1. Line Item Schema (BillingDocumentItem)
export const billingDocumentItemSchema = yup.object({
    productId: yup
        .string()
        .nullable()
        .optional()
        .default(null),

    itemName: yup
        .string()
        .trim()
        .required("Item name is required")
        .min(2, "Item name must be at least 2 characters"),

    quantity: yup
        .number()
        .transform(emptyStringToUndefined)
        .typeError("Quantity must be a number")
        .required("Qty is required")
        .moreThan(0, "Qty must be greater than 0"),

    unitPrice: yup
        .number()
        .transform(emptyStringToZero)
        .typeError("Unit price must be a number")
        .required("Unit price is required")
        .min(0, "Unit price cannot be negative"),

    unitOfMeasure: yup
        .string()
        .trim()
        .required("Unit is required")
        .default("Piece"), // Piece, cm, mm, carton, KG, etc.

    amount: yup
        .number()
        .transform(emptyStringToZero)
        .min(0)
        .default(0),
});

// 2. Main Document Schema (BillingDocument)
export const billingDocumentSchema = yup.object({

    type: yup
        .string()
        .oneOf(["QUOTATION", "INVOICE"] as const, "Invalid document type")
        .default("QUOTATION")
        .required(),

    issueDate: yup
        .string()
        .required("Issue date is required"),

    customerId: yup
        .string()
        .nullable()
        .optional()
        .default(null),

    // "Bill To" Snapshot Fields (Matches Invoice_58_29-12-2025.pdf)
    partyName: yup
        .string()
        .trim()
        .required("Client / Company name is required")
        .min(2, "Company/Client name is too short"),

    partyNtn: yup
        .string()
        .trim()
        .nullable()
        .optional()
        .default(""),

    partyStrn: yup
        .string()
        .trim()
        .nullable()
        .optional()
        .default(""),

    partyAddress: yup
        .string()
        .trim()
        .nullable()
        .optional()
        .default(""),

    partyPhone: yup
        .string()
        .required("Phone number is required")
        .test("is-valid-phone", "Must be a valid phone number", (value) => {
            return value ? isValidPhoneNumber(value) : false;
        }),

    partyEmail: yup
        .string()
        .trim()
        .email("Please enter a valid email address")
        .nullable()
        .optional()
        .default(""),

    // Financial & Tax Math
    subTotal: yup
        .number()
        .transform(emptyStringToZero)
        .min(0)
        .default(0),

    gstPercent: yup
        .number()
        .transform(emptyStringToZero)
        .min(0, "GST % cannot be negative")
        .max(100, "GST % cannot exceed 100%")
        .default(18), // Default 18% GST as per your PDF (can be set to 0 by user)

    gstAmount: yup
        .number()
        .transform(emptyStringToZero)
        .min(0)
        .default(0),

    discount: yup
        .number()
        .transform(emptyStringToZero)
        .min(0, "Discount cannot be negative")
        .default(0)
        .test(
            "discount-lte-subtotal",
            "Discount cannot exceed Subtotal + GST",
            function (discountVal) {
                const sub = this.parent.subTotal || 0;
                const gst = this.parent.gstAmount || 0;
                return (discountVal || 0) <= sub + gst;
            }
        ),

    totalAmount: yup
        .number()
        .transform(emptyStringToZero)
        .min(0)
        .default(0),

    advanceAmount: yup
        .number()
        .transform(emptyStringToZero)
        .min(0, "Advance amount cannot be negative")
        .default(0)
        .test(
            "advance-lte-total",
            "Advance / Received amount cannot exceed Total Amount",
            function (advanceVal) {
                const total = this.parent.totalAmount || 0;
                return (advanceVal || 0) <= total;
            }
        ),

    balanceDue: yup
        .number()
        .transform(emptyStringToZero)
        .min(0)
        .default(0),

    termsAndConditions: yup
        .string()
        .trim()
        .nullable()
        .optional()
        .default("Thank you for doing business with us."),

    notes: yup
        .string()
        .trim()
        .nullable()
        .optional()
        .default(""),

    // Line Items Array (Must have at least 1 item)
    items: yup
        .array()
        .of(billingDocumentItemSchema)
        .min(1, "Please add at least one line item")
        .required("Line items are required"),
});

export type BillingDocumentFormValues = yup.InferType<typeof billingDocumentSchema>;
export type BillingDocumentItemValues = yup.InferType<typeof billingDocumentItemSchema>;

// 3. Ready-to-use Default Values for React Hook Form `useForm({ defaultValues })`
export const defaultBillingDocumentValues: BillingDocumentFormValues = {
    type: "QUOTATION",
    issueDate: "",
    customerId: null,
    partyName: "",
    partyNtn: "",
    partyStrn: "",
    partyAddress: "",
    partyPhone: "",
    partyEmail: "",
    subTotal: 0,
    gstPercent: 18,
    gstAmount: 0,
    discount: 0,
    totalAmount: 0,
    advanceAmount: 0,
    balanceDue: 0,
    termsAndConditions: "Thank you for doing business with us.",
    notes: "",
    items: [
        {
            productId: null,
            itemName: "",
            quantity: 1,
            unitPrice: 0,
            unitOfMeasure: "Piece",
            amount: 0,
        },
    ],
};