import { ActivityLog } from "@/types/ActivityLog";
export type PaymentMethodType = "CASH" | "BANK" | "LEDGER";

export interface RecoveryProductSummary {
  id: string;
  name: string;
  unitOfMeasure: string;
  hasRecipe?: boolean;
  trackingType?: "OUTRIGHT" | "RETURNABLE";
}

export interface RecoveryCustomerSummary {
  id: string;
  name: string;
  phone: string;
  customerCode: string;
  customerCredit: number;
}

// ============================================================================
// 1. CUSTOMER RECOVERY TYPES
// ============================================================================

export interface CustomerRecoveryItemRecord {
  id: string;
  recoveryId: string;
  productId: string;
  previousBalance: number;
  quantityReturned: number;
  goodToStoreQty: number;
  wastageQty: number;
  remainingBalance: number;
  depositRefunded: number;
  product: RecoveryProductSummary;
}

export interface CustomerRecoveryRecord {
  id: string;
  branchId: string;
  recoveryCode: string;
  customerId: string;
  createdById?: string | null;
  processedBy?: string | null;
  paymentMethod: PaymentMethodType;
  previousCredit: number;
  amountReceived: number;
  remainingCredit: number;
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: RecoveryCustomerSummary;
  recoveredItems: CustomerRecoveryItemRecord[];
}

export interface RecoveryItemPayload {
  productId: string;
  quantityReturned: number;
  goodToStoreQty: number;
  wastageQty: number;
  depositRefunded?: number;
}

export interface CreateRecoveryPayload {
  customerId: string;
  paymentMethod: PaymentMethodType;
  amountReceived: number;
  remarks?: string;
  items?: RecoveryItemPayload[];
}

export interface UpdateRecoveryPayload {
  paymentMethod: PaymentMethodType;
  amountReceived: number;
  remarks?: string;
  items?: RecoveryItemPayload[];
}

// ============================================================================
// 2. SALE RETURN TYPES
// ============================================================================

export interface SaleReturnRecipeMaterialRecord {
  id: string;
  saleReturnItemId: string;
  rawMaterialId: string;
  expectedQuantity: number;
  returnedToStoreQty: number;
  wastageQty: number;
  rawMaterial: RecoveryProductSummary;
}

export interface SaleReturnItemRecord {
  id: string;
  saleReturnId: string;
  orderLineItemId?: string | null;
  productId: string;
  soldQuantity: number;
  returnQuantity: number;
  unitPrice: number;
  refundAmount: number;
  goodToStoreQty: number;
  wastageQty: number;
  hasRecipe: boolean;
  product: RecoveryProductSummary;
  recipeMaterials: SaleReturnRecipeMaterialRecord[];
}

export interface SaleReturnRecord {
  id: string;
  branchId: string;
  returnCode: string;
  customerId: string;
  orderId: string;
  createdById?: string | null;
  processedBy?: string | null;
  paymentMethod: PaymentMethodType;
  totalRefundAmount: number;
  cashRefunded: number;
  khataCredited: number;
  depositRefunded: number;
  reason?: string | null;
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: RecoveryCustomerSummary;
  order: {
    id: string;
    orderCode: string;
    createdAt: string;
  };
  items: SaleReturnItemRecord[];
}

export interface SaleReturnRecipeMaterialPayload {
  rawMaterialId: string;
  expectedQuantity: number;
  returnedToStoreQty: number;
  wastageQty: number;
}

export interface SaleReturnItemPayload {
  orderLineItemId?: string;
  productId: string;
  returnQuantity: number;
  goodToStoreQty: number;
  wastageQty: number;
  hasRecipe: boolean;
  recipeMaterials?: SaleReturnRecipeMaterialPayload[];
}

export interface CreateSaleReturnPayload {
  customerId: string;
  orderId: string;
  paymentMethod: PaymentMethodType;
  depositRefunded?: number;
  reason?: string;
  remarks?: string;
  items: SaleReturnItemPayload[];
}

export interface UpdateSaleReturnPayload {
  paymentMethod: PaymentMethodType;
  depositRefunded?: number;
  reason?: string;
  remarks?: string;
  items: SaleReturnItemPayload[];
}

// ============================================================================
// 3. UNIFIED GET & COMPLETED ORDERS RESPONSE
// ============================================================================

export interface GetRecoveryAllResponse {
  recoveries: CustomerRecoveryRecord[];
  saleReturns: SaleReturnRecord[];
  logs: ActivityLog[];
}

export interface CompletedOrderRecipeIngredient {
  id: string;
  parentItemId: string;
  childItemId: string;
  quantity: number;
  childItem: {
    id: string;
    name: string;
    unitOfMeasure: string;
    trackingType: "OUTRIGHT" | "RETURNABLE";
  };
}

export interface CompletedOrderLineItem {
  id: string;
  orderId: string;
  productId: string;
  paidQuantity: number;
  freeQuantity: number;
  unitCost: number;
  unitPrice: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    hasRecipe: boolean;
    trackingType: "OUTRIGHT" | "RETURNABLE";
    unitOfMeasure: string;
    securityDeposit: number;
    recipeIngredients: CompletedOrderRecipeIngredient[];
  };
}

export interface CustomerCompletedOrder {
  id: string;
  orderCode: string;
  customerId: string;
  totalAmount: number;
  amountPaid: number;
  createdAt: string;
  completedAt?: string | null;
  lineItems: CompletedOrderLineItem[];
  saleReturns: {
    id: string;
    returnCode: string;
    items: {
      productId: string;
      returnQuantity: number;
    }[];
  }[];
}