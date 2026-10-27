import { ActivityLog } from "@/types/ActivityLog";
export type SupplierPaymentMethod = "CASH" | "BANK_TRANSFER" | "CHEQUE";
export type PaymentStatus = "PARTIAL" | "CLEARED";

export interface SupplierPayment {
    id: string;
    voucherNumber: string;
    paymentDate: string;
    amountPaid: number;
    balanceDue: number;
    remainingAmount: number;
    paymentMethod: SupplierPaymentMethod;
    referenceNote?: string;
    status: PaymentStatus;
    branchId: string;
    supplierId: string;
    poId: string;
    supplier?: {
        strn: string;
        ntn: string;
        address: string;
        city: string;
        name: string;
        firmName: string;
        phone: string;
        email: string | null;
    };
    purchaseOrder?: {
        poNumber: string;
        totalAmount: number;
        balanceDue: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface SupplierPaymentResponse {
    payments: SupplierPayment[];
    logs: ActivityLog[];
}
