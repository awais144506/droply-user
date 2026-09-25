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
        sku?: string; // Made optional because the backend select only returns 'name'
    };
}

export interface PurchaseReturn {
    id: string;
    debitNoteNumber: string;
    returnDate: string;
    resolvedAt: string | null; // Explicitly handle null from JSON
    status: ReturnStatus;
    totalValue: number;
    creditRecovered: number;
    notes: string | null;
    branchId: string;
    supplierId: string;
    poId: string | null;

    // Included Relations
    supplier?: {
        firmName: string;
        supplierName: string;
        phone: string;
    };
    purchaseOrder?: {
        poNumber: string;
    } | null;

    items: PurchaseReturnItem[];

    createdAt: string;
    updatedAt: string;
}