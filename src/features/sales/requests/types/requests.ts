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

export interface Customer {
  id: string;
  name: string;
  phone:string;
  address:string;
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
  customer:Customer;
}

export interface RequestedItems {
  id: string;
  name: string;
  unitOfMeasure: string;
  priceTiers: {
    salePrice: number;
  }[];
}

export interface CustomerDataResponse {
  products: RequestedItems[];
  history: CustomerOrderRequest[];
}