import { ActivityLog } from "@/types/ActivityLog";
import { OrderStatus, OrderType } from "@/features/sales/orders/types/order";
import {
    DayOfWeek,
    DeliveryScheduleType,
} from "../schema/create-customer.schema";
export type CustomerStatus = "ACTIVE" | "BLOCKED";
export type CustomerPartyType = "CUSTOMER" | "VENDOR" | "COMPANY";
export type CustomerCategory = "DOMETSIC" | "COMMERCIAL" | "CORPORATE"

export interface CustomerDetails {
    id: string;
    branchId: string;
    zoneId: string | null;
    customerCode: string;
    name: string;
    phone: string;
    email?: string | null;
    address: string | null;
    ntn: string | null;
    strn: string | null;
    latitude: number | null;
    longitude: number | null;
    status: CustomerStatus;
    deliveryScheduleType: DeliveryScheduleType;
    deliveryDays: DayOfWeek[];
    customerCredit: number;
    customerAdvance: number;
    securityDeposit: number;
    partyType: CustomerPartyType;
    category: CustomerCategory;
    lastVisitDate: string | null;
    createdAt: string;
    updatedAt: string;
    returnablesLength: number;
    zone?: {
        id: string;
        name: string;
    } | null;
    returnables: {
        id?: string;
        productId: string;
        productName?: string;
        openingBalance: number;
        currentBalance: number;
    }[];
    orders: CustomerOrderHistory[];
}
export interface CustomerOrderHistory {
    lineItems: [] | undefined;
    orderCode: string;
    id: string
    status: OrderStatus;
    totalAmount: number;
    type: OrderType;
    createdAt: string;
}
export interface NewCustomerRequest {
    id: string;
    name: string;
    phone: string;
    address: string;
    status: 'PENDING' | 'CONTACTED';
    requestedBy: string;
    createdAt: string;
}

export interface CustomerResponse {
    customer: CustomerDetails[];
    logs: ActivityLog[];
    newCustomerRequest: NewCustomerRequest[];
}