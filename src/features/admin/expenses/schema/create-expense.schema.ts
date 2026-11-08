import * as yup from "yup";
import { ExpenseType, ExpensePaymentType } from "../types/expenses";

export const createExpenseSchema = yup.object({
    description: yup.string().required("Please enter a description"),
    type: yup.mixed<ExpenseType>().oneOf(Object.values(ExpenseType)).required("Select an expense category"),
    paymentType: yup.mixed<ExpensePaymentType>().oneOf(Object.values(ExpensePaymentType)).required("Select a payment method"),
    amount: yup.number()
        .transform((value) => (Number.isNaN(value) ? 0 : value))
        .positive("Amount must be greater than 0")
        .required("Amount is required"),
}).required();

export type CreateExpenseFormData = yup.InferType<typeof createExpenseSchema>;