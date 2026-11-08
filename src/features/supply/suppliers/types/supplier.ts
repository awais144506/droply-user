
export interface SupplierList {
    id: string;
    branchId: string;
    firmName: string;
    name: string;
    email: string | null;
    ntn: string | null;
    strn: string | null;
    phone: string;
    address: string;
    city: string;
    payableBalance: number;
    totalPurchases: number;
    lastPurchaseDate: string;
    createdAt: string;
    updatedAt: string;
}