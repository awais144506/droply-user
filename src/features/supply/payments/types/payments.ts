export type SupplierPaymentMethod = "CASH" | "BANK_TRANSFER" | "CHEQUE";
export type PaymentStatus = "PARTIAL" | "CLEARED";

export interface SupplierPayment {
    id: string;
    voucherNumber: string;
    paymentDate: string;
    amountPaid: number;
    balanceDue: number;
    remainingAmount:number;
    paymentMethod: SupplierPaymentMethod;
    referenceNote?: string;
    status: PaymentStatus;
    branchId: string;
    supplierId: string;
    poId: string;

    // Included Relations from Backend
    supplier?: {
        firmName: string;
        supplierName: string;
        phone: string;
    };
    purchaseOrder?: {
        poNumber: string;
        totalAmount: number;
        balanceDue: number;
    };

    createdAt: string;
    updatedAt: string;
}
