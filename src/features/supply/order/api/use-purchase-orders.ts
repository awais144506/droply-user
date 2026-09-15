import { useQuery } from "@tanstack/react-query";

export type POStatus = "ORDERED" | "RECEIVED";

export interface POItem {
  quantity: number;
  description: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  orderDate: string;
  supplierName: string;
  supplierPhone: string;
  items: POItem[];
  totalAmount: number;
  status: POStatus;
}

export function usePurchaseOrders(branchId: string) {
  return useQuery({
    queryKey: ["purchase-orders", branchId],
    queryFn: async (): Promise<PurchaseOrder[]> => {
      // Mock data grounded in generic distribution supplies
      return [
        {
          id: "1", poNumber: "PO-2026-0801", orderDate: "2026-08-26",
          supplierName: "Al-Sharq Plastics & Polymers", supplierPhone: "+92 323 0010950",
          items: [{ quantity: 200, description: "Raw Polycarbonate Material (kg)" }],
          totalAmount: 174000, status: "ORDERED"
        },
        {
          id: "2", poNumber: "PO-2026-0802", orderDate: "2026-08-27",
          supplierName: "SES Group Packaging", supplierPhone: "+92 301 1117883",
          items: [
            { quantity: 5000, description: "55mm Smart Non-Spill Caps" },
            { quantity: 5000, description: "Heat Shrink Neck Seals" }
          ],
          totalAmount: 91000, status: "ORDERED"
        },
        {
          id: "3", poNumber: "PO-2026-0798", orderDate: "2026-08-15",
          supplierName: "Indus Filtration & Chemicals", supplierPhone: "+92 300 4545678",
          items: [{ quantity: 4, description: "Anti-Scalant Chemical (20L Can)" }],
          totalAmount: 20200, status: "RECEIVED"
        },
        {
          id: "4", poNumber: "PO-2026-0795", orderDate: "2026-08-10",
          supplierName: "Pak Pump Importers", supplierPhone: "+92 333 8989123",
          items: [{ quantity: 2, description: "Industrial Transfer Pumps" }],
          totalAmount: 145000, status: "RECEIVED"
        }
      ];
    },
    enabled: Boolean(branchId),
  });
}