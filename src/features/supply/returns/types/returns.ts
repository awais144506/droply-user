export type ReturnStatus = "PENDING_RESOLUTION" | "CREDIT_APPLIED" | "REPLACED" | "MIXED_RESOLUTION";

export interface PurchaseReturnItem {
    id: string;
    returnId: string;
    branchProductId: string;
    supplierItemName: string;
    unitCost: number;
    quantityReturned: number;
    quantityCredited: number;
    quantityReplaced: number;
    quantityRejected: number;
    // Included relation
    branchProduct?: {
        name: string;
        sku: string;
    };
}

export interface PurchaseReturn {
    id: string;
    debitNoteNumber: string;
    returnDate: string;
    resolvedAt?: string;
    status: ReturnStatus;
    totalValue: number;
    creditRecovered: number;
    notes?: string;
    branchId: string;
    supplierId: string;
    poId?: string;
    
    // Included Relations
    supplier?: {
        firmName: string;
        supplierName: string;
    };
    purchaseOrder?: {
        poNumber: string;
    };
    items: PurchaseReturnItem[];
    
    createdAt: string;
    updatedAt: string;
}