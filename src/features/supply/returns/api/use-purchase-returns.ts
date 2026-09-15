import { useQuery } from "@tanstack/react-query";

export type ReturnResolution = "PENDING" | "CREDIT_APPLIED" | "REPLACED";

export interface ReturnItem {
  quantity: number;
  description: string;
}

export interface PurchaseReturn {
  id: string;
  returnNumber: string;
  returnDate: string;
  supplierName: string;
  poRef: string;
  items: ReturnItem[];
  totalValue: number;
  status: ReturnResolution;
}

export function usePurchaseReturns(branchId: string) {
  return useQuery({
    queryKey: ["purchase-returns", branchId],
    queryFn: async (): Promise<PurchaseReturn[]> => {
      return [
        {
          id: "1", returnNumber: "RET-2026-001", returnDate: "2026-09-02",
          supplierName: "SES Group Packaging", poRef: "PO-2026-0802",
          items: [{ quantity: 50, description: "Defective Shrink Seals (Melted)" }],
          totalValue: 910, status: "PENDING"
        },
        {
          id: "2", returnNumber: "RET-2026-002", returnDate: "2026-08-20",
          supplierName: "Al-Sharq Plastics & Polymers", poRef: "PO-2026-0801",
          items: [{ quantity: 5, description: "Cracked 19L Bottles" }],
          totalValue: 4350, status: "CREDIT_APPLIED"
        },
        {
          id: "3", returnNumber: "RET-2026-003", returnDate: "2026-08-10",
          supplierName: "Pak Pump Importers", poRef: "PO-2026-0795",
          items: [{ quantity: 1, description: "Faulty Transfer Pump Motor" }],
          totalValue: 72500, status: "REPLACED"
        }
      ];
    },
    enabled: Boolean(branchId),
  });
}