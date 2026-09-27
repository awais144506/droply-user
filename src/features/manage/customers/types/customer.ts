import { ActivityLog } from "@/types/ActivityLog";
export type OrderStatus = "PENDING" | "ON_ROUTE" | "COMPLETED" | "VOIDED"
export type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface CustomerDetails {
    id: string;
    branchId: string;
    zoneId: string | null;
    customerCode: string;
    name: string;
    phone?: string;
    email?: string | null;
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
    orders: CustomerOrderHistory[],
}

export interface CustomerOrderHistory {
    orderCode: string;
    id: string
    status: OrderStatus;
    totalAmount: number;
    type: "WALK_IN" | "DELIVERY";
    createdAt: string;
}

export interface CustomerResponse {
  customer: CustomerDetails[];
  logs: ActivityLog[];
}