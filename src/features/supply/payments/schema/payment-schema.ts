import * as yup from "yup";

export const createPaymentSchema = yup.object().shape({
    branchId: yup.string().required("Branch context is missing"),
    
    supplierId: yup.string().required("Please select a supplier"),
    
    poId: yup.string().required("Please select a purchase order to pay against"),
    
    amountPaid: yup.number()
        .typeError("Amount must be a valid number")
        .positive("Payment amount must be strictly greater than 0")
        .required("Payment amount is required"),
        
    paymentMethod: yup.string()
        .oneOf(["CASH", "BANK_TRANSFER", "CHEQUE"], "Invalid payment method selected")
        .required("Please select a payment method"),
        
    paymentDate: yup.date()
        .typeError("Please enter a valid date")
        .required("Payment date is required"),
        
    referenceNote: yup.string()
        .max(255, "Note cannot exceed 255 characters")
        .optional()
        .nullable(),
});

// Extract the type for React Hook Form
export type CreatePaymentFormValues = yup.InferType<typeof createPaymentSchema>;