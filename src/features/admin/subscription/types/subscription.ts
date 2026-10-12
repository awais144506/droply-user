export type SubscriptionCycle = "TRIAL" | "MONTHLY" | "YEARLY"
export type SubscriptionTier = "SILVER" | "GOLD" | "PLATINUM"
export type SubscriptionPaymentType = "BANK" | "JAZZ_CASH" | "EASY_PAISA" | "OTHER"
export type SubscriptionPaymentStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface BankDetail {
  id: string;
  bankName: string;
  title: string;
  number: string;
  iban: string;
  qrCodeUrl: string;
  isActive: boolean;
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  monthlyPrice: number;
  yearlyDiscountPercent: number;
  staffLimit: number;
}

export interface Subscription {
  id: string;
  cycle: SubscriptionCycle;
  tier: SubscriptionTier;
  renewDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPayment {
  id: string;
  amountPaid: number;
  tier: SubscriptionTier;
  cycle: SubscriptionCycle;
  type: SubscriptionPayment;
  status: SubscriptionPaymentStatus;
  transactionId: string;
  imageUrl: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionResponse {
  plans: SubscriptionPlan;
  currentPlan: Subscription;
  paymentHistory: SubscriptionPayment[];
}