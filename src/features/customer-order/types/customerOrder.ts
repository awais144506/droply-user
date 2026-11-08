export type RequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ASSIGNED'
  | 'ON_ROUTE'
  | 'ARRIVED'
  | 'RESCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface HistoryOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CustomerOrderRequest {
  id: string;
  branchId?: string;
  orderId: string;
  status: RequestStatus;
  scheduleDate: string;
  notes?: string | null;
  total: number;
  createdAt: string;
  items: HistoryOrderItem[];
}

export interface RequestedItems {
  id: string;
  name: string;
  unitOfMeasure: string;
  priceTiers: {
    salePrice: number;
  }[];
}

export interface CustomerData {
  id: string;
  name: string;
  address: string;
  branchId: string;
  customerCredit: number;
  customerAdvance: number;
  securityDeposit: number;
  returnablesLength: number;
  zone: {
    name: string;
  } | null;
  branch: {
    name: string;
  } | null;
}

export interface CustomerDataResponse {
  customer: CustomerData;
  products: RequestedItems[];
  history: CustomerOrderRequest[];
}