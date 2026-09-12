export type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

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
    partyType: string;
    category: string;
    lastVisitDate: string | null;
    createdAt: string;
    securityDeposit: number;
    updatedAt: string;
    returnablesLength: number;
    zone?: {
        id: string;
        name: string;
    } | null;
    returnables: [
        openingReturnables: number,
        currentReturnables: number,
    ]
    orders: [

    ]
}

export interface CustomerList {
    id: string;
    customerCode: string;
    name: string;
    phone: string;
    status: CustomerStatus;
    zone?: {
        id: string;
        name: string;
    } | null;
    returnables: [
        currentReturnables: number,
    ]
    customerCredit: string;
    returnablesLength: string;
    lastVisitDate: string;
}