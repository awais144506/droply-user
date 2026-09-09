export type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

// Represents the full customer object returned from the backend (GET)
export interface CustomerDetails {
    id: string;
    branchId: string;
    zoneId: string | null;
    customerCode: string;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    status: CustomerStatus;
    customerCredit: number;
    customerAdvance: number;
    lastVisitDate: string | null;
    createdAt: string;
    securityDeposit:number;
    updatedAt: string;
    zone?: {
        id: string;
        name: string;
    } | null;
    returnables: [
        openingReturnables: number,
        currentReturnables: number,
    ]
}
