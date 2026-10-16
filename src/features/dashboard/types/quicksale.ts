export interface QuickSaleProduct {
    id: string;
    name: string;
    code?: string;
    price: number;
    stock: number;
    trackingType?: string;
    lowStock?: number;
    security?: number | null;
    unit: string;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    unit?: string;
}

export type QuickSaleStatus = "COMPLETED" | "VOIDED";
export type QuickPaymentMethod = "CASH" | "ONLINE";

export type UnitOfMeasure =
  | "PIECE"
  | "BOTTLE"
  | "LITER"
  | "GALLON"
  | "KG"
  | "PACK"
  | "CARTON"
  | string;

// 1. Frontend POS Catalog & Cart Types
export interface QuickSaleProduct {
  id: string;
  name: string;
  code?: string;
  price: number;
  stock: number;
  trackingType?: string;
  lowStock?: number;
  security?: number | null;
  unit: string;
}

export interface CartItem {
  id: string; // Product ID or "custom-..." ID
  name: string;
  price: number;
  qty: number;
  unit?: string;
}

// 2. Backend Database & API Response Types
export interface QuickSaleItemRecord {
  id: string;
  quickSaleId: string;
  productId: string | null;
  itemName: string;
  unit: UnitOfMeasure;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface QuickSaleRecord {
  id: string;
  branchId: string;
  staffId: string;
  receiptNumber: string;
  customerName: string;
  customerPhone?: string | null;
  paymentMethod: QuickPaymentMethod;
  status: QuickSaleStatus;
  subTotal: number;
  discount: number;
  totalAmount: number;
  cashReceived?: number | null;
  changeDue?: number | null;
  createdAt: string;
  updatedAt: string;
  processedBy?: string;
  items: QuickSaleItemRecord[];
}

// 3. Paginated List Response from GET /quick/branch/:branchId
export interface QuickSaleListResponse {
  data: QuickSaleRecord[];
  meta: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: {
    completedOrdersCount: number;
    totalRevenue: number;
    totalDiscount: number;
  };
}

// 4. Query Filter Params
export interface QuickSaleQueryParams {
  date?: string; // e.g., "2026-10-16"
  search?: string;
  status?: QuickSaleStatus;
  page?: number;
  limit?: number;
}

// 5. Create / Update Mutation Payloads
export interface CreateQuickSaleItemPayload {
  productId?: string | null;
  itemName: string;
  unit?: UnitOfMeasure;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CreateQuickSalePayload {
  branchId: string;
  staffId: string;
  customerName?: string;
  customerPhone?: string | null;
  paymentMethod?: QuickPaymentMethod;
  subTotal: number;
  discount?: number;
  totalAmount: number;
  cashReceived?: number;
  changeDue?: number;
  items: CreateQuickSaleItemPayload[];
}

export type UpdateQuickSalePayload = Partial<CreateQuickSalePayload>;