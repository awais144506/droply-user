import * as yup from "yup";
import { SubscriptionPaymentType } from "../types/subscription";

// --- CONSTANTS ---
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/jpeg", "image/png","image/webp"];

// --- TYPES ---
export interface CheckoutSubmitPayload {
    amountPaid: number;
    type: SubscriptionPaymentType;
    transactionId?: string;
    receiptImage?: File;
    imageUrl?: string;
    isRenewal: boolean;
}

// --- DYNAMIC SCHEMA GENERATOR ---
export const getCheckoutSchema = (requirePayment: boolean) => {
    if (!requirePayment) {
        return yup.object({
            amountPaid: yup.number().default(0),
            type: yup.string().default("BANK"),
            transactionId: yup.string().optional(),
            receiptImage: yup.mixed<File>().optional(),
            isRenewal: yup.boolean().default(false),
        });
    }

    return yup.object({
        amountPaid: yup
            .number()
            .transform((value) => (isNaN(value) ? undefined : value))
            .required("Amount is required")
            .min(1, "Amount must be greater than 0"),
        type: yup.string().required("Please select a payment channel"),
        transactionId: yup.string().optional(),
        receiptImage: yup
            .mixed<File>()
            .required("Please upload a payment receipt")
            .test("fileSize", "File size must be less than 2MB", (value) => {
                if (!value) return false;
                return value.size <= MAX_FILE_SIZE;
            })
            .test("fileType", "Only JPG, PNG & Webp, are allowed", (value) => {
                if (!value) return false;
                return SUPPORTED_FORMATS.includes(value.type);
            }),
        isRenewal: yup.boolean().default(false),
    });
};