import { useQuery } from "@tanstack/react-query";

export type InvoiceStatus = "UNPAID" | "PENDING_VERIFICATION" | "CLEARED";

export interface BillingRecord {
  id: string;
  billingMonth: string;
  invoiceRef: string;
  billingPeriod: string;
  feePKR: number;
  dueDate: string;
  status: InvoiceStatus;
  verificationRef: string | null;
  verificationDate: string | null;
}

export interface CurrentPlan {
  tier: "SILVER" | "GOLD" | "PLATINUM";
  cycle: "MONTHLY" | "YEARLY";
  price: number;
  expiresAt: string;
  status: "TRIAL" | "ACTIVE" | "PAST_DUE";
}

export function useSubscription(branchId: string) {
  return useQuery({
    queryKey: ["subscription", branchId],
    queryFn: async (): Promise<{ plan: CurrentPlan, ledger: BillingRecord[] }> => {
      return {
        plan: {
          tier: "GOLD",
          cycle: "MONTHLY",
          price: 8500,
          expiresAt: "2026-09-05",
          status: "TRIAL",
        },
        ledger: [
          {
            id: "1", billingMonth: "September 2026", invoiceRef: "DPLY-SUB-2026-09",
            billingPeriod: "Sep 01, 2026 - Sep 30, 2026", feePKR: 8500, dueDate: "2026-09-05",
            status: "UNPAID", verificationRef: null, verificationDate: null
          },
          {
            id: "2", billingMonth: "August 2026", invoiceRef: "DPLY-SUB-2026-08",
            billingPeriod: "Aug 01, 2026 - Aug 31, 2026", feePKR: 8500, dueDate: "2026-08-05",
            status: "CLEARED", verificationRef: "RAAST-9921448201", verificationDate: "Aug 03, 2026, 04:30 PM"
          },
          {
            id: "3", billingMonth: "July 2026", invoiceRef: "DPLY-SUB-2026-07",
            billingPeriod: "Jul 01, 2026 - Jul 31, 2026", feePKR: 8500, dueDate: "2026-07-05",
            status: "CLEARED", verificationRef: "HBL-TRX-1029481", verificationDate: "Jul 04, 2026, 02:15 PM"
          }
        ]
      };
    },
    enabled: Boolean(branchId),
  });
}