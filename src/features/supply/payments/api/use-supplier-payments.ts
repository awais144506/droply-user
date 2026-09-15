import { useQuery } from "@tanstack/react-query";

export type PaymentMethod = "BANK_TRANSFER" | "CASH" | "CHEQUE";
export type PaymentStatus = "FULLY_CLEARED" | "PARTIAL_PAYMENT";

export interface SupplierPayment {
  id: string;
  voucherNumber: string;
  paymentDate: string;
  supplierName: string;
  supplierCategory: string;
  method: PaymentMethod;
  accountDetails: string;
  poRef: string;
  totalAmount: number;
  amountPaid: number;
  remainingBalance: number; 
  status: PaymentStatus;
}

export function useSupplierPayments(branchId: string) {
  return useQuery({
    queryKey: ["supplier-payments", branchId],
    queryFn: async (): Promise<{ payments: SupplierPayment[], totalRemainingPayable: number }> => {
      return {
        totalRemainingPayable: 180782,
        payments: [
          {
            id: "1", voucherNumber: "PV-2026-0412", paymentDate: "2026-08-28",
            supplierName: "SES Group Packaging", supplierCategory: "Caps & Seals",
            method: "BANK_TRANSFER", accountDetails: "Meezan Bank (Plant Main A/C)",
            poRef: "PO-2026-0802", totalAmount: 91000, amountPaid: 50000, remainingBalance: 41000, status: "PARTIAL_PAYMENT"
          },
          {
            id: "2", voucherNumber: "PV-2026-0411", paymentDate: "2026-08-25",
            supplierName: "Al-Sharq Plastics & Polymers", supplierCategory: "Bottles & Preforms",
            method: "BANK_TRANSFER", accountDetails: "HBL Commercial Branch, Sahiwal",
            poRef: "PO-2026-0801", totalAmount: 100000, amountPaid: 100000, remainingBalance: 0, status: "FULLY_CLEARED"
          },
          {
            id: "3", voucherNumber: "PV-2026-0410", paymentDate: "2026-08-19",
            supplierName: "Indus Filtration & Chemicals", supplierCategory: "RO Chemicals & Minerals",
            method: "CASH", accountDetails: "Cash in Hand",
            poRef: "PO-2026-0798", totalAmount: 20200, amountPaid: 20200, remainingBalance: 0, status: "FULLY_CLEARED"
          },
          {
            id: "4", voucherNumber: "PV-2026-0409", paymentDate: "2026-08-12",
            supplierName: "Pak Pump Importers", supplierCategory: "Pumps & Spares",
            method: "CHEQUE", accountDetails: "General Account Credit",
            poRef: "PO-2026-0795", totalAmount: 145000, amountPaid: 35000, remainingBalance: 110000, status: "PARTIAL_PAYMENT"
          }
        ]
      };
    },
    enabled: Boolean(branchId),
  });
}