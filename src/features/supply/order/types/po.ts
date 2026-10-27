import { ActivityLog } from "@/types/ActivityLog";
export type POStatus = "ORDERED" | "PENDING_RESTOCK" | "RECEIVED";

export interface POItem {
    id: string;
    quantity: number;
    unitCost: number;
    total: number;
    supplierItemName: string;
    branchProduct: {
        currentStock: number;
        id: string;
        name: string;
    };
}

export interface POSupplier {
    strn: string;
    ntn: string;
    address: string;
    city: string;
    name: string;
    firmName: string;
    phone: string;
    email: string | null;
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

export interface POResponse {
    po: PurchaseOrder[]
    logs: ActivityLog[]
}