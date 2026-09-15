export type OrderType = "WALK_IN" | "DELIVERY";
export type PaymentMethod = "CASH" | "BANK" | "KHATA";

export interface OrderItemPayload {
    productId: string;
    paidQty: number;
    emptiesIn: number;
    hasOffer: boolean;
    offerQty: number;
    chargedDeposit: number;
    isDepositCharged: boolean;
}

export interface CreateOrderPayload {
    branchId: string;
    saleType: OrderType;
    customerId: string;
    riderId?: string;
    scheduledDate?: string;
    items: OrderItemPayload[];
    discount: number;
    paymentMethod: PaymentMethod;
    amountPaid: number;
    remarks?: string;
}

export interface OrderResponse {
    id: string;
    branchId: string;
    customerId: string;
    riderId: string | null;
    type: OrderType;
    status: string;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    amountPaid: number;
    discount: number;
    createdAt: string;
}