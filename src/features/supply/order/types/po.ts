export type POStatus = "ORDERED" | "PENDING_RESTOCK" | "RECEIVED";

export interface POItem {
    id: string;
    quantity: number;
    unitCost: number;
    total: number;
    supplierItemName: string;
    branchProduct: {
        id: string;
        name: string;
    };
}

export interface POSupplier {
    firmName: string;
    supplierName: string;
    phone: string;
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    branchId: string;
    supplierId: string;
    status: POStatus;
    totalAmount: number;
    subTotal: number;
    balanceDue: number;
    advancePaid: number;
    orderDate: string;
    notes?: string;
    items: POItem[];
    supplier: POSupplier;
}
