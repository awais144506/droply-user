
export interface SupplierList {
    id: string;
    branchId: string;
    firmName: string;
    supplierName: string;
    email: string | null;
    phone: string;
    address: string;
    city: string;
    payableBalance: number;
    totalPurchases: number;
    lastPurchaseDate: string;
    createdAt: string;
    updatedAt: string;
}