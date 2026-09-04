import { useQuery } from "@tanstack/react-query";

export type RecoveryType = "DEFECTIVE_RETURN" | "ASSET_RECOVERY";
export type RecoveryStatus = "PENDING_PICKUP" | "COMPLETED" | "CANCELLED";

export interface RecoveryItem {
  quantity: number;
  description: string;
}

export interface RecoveryRecord {
  id: string;
  date: string;
  customerName: string;
  routeZone: string;
  type: RecoveryType;
  items: RecoveryItem[];
  financialImpact: number; // Deposit refunded or ledger credited
  status: RecoveryStatus;
  assignedRider: string | null;
}

export function useRecoveries(branchId: string) {
  return useQuery({
    queryKey: ["sales-recoveries", branchId],
    queryFn: async (): Promise<RecoveryRecord[]> => {
      return [
        {
          id: "1", date: "2026-09-03", customerName: "Dr. Shahida Parveen", routeZone: "Farid Town",
          type: "DEFECTIVE_RETURN", items: [{ quantity: 1, description: "Leaking 19L Bottle (Full)" }],
          financialImpact: 0, status: "PENDING_PICKUP", assignedRider: "Majid Ali"
        },
        {
          id: "2", date: "2026-09-02", customerName: "Al-Rehman Mart", routeZone: "Block Z Market",
          type: "ASSET_RECOVERY", items: [{ quantity: 5, description: "Empty 19L Bottles" }, { quantity: 1, description: "Manual Dispenser" }],
          financialImpact: 5500, // Returning security deposits
          status: "COMPLETED", assignedRider: "Majid Ali"
        },
        {
          id: "3", date: "2026-09-01", customerName: "Zainab Foods", routeZone: "Block Y",
          type: "DEFECTIVE_RETURN", items: [{ quantity: 2, description: "Broken Seals" }],
          financialImpact: 400, // Ledger credit given
          status: "COMPLETED", assignedRider: "Majid Ali"
        },
        {
          id: "4", date: "2026-09-04", customerName: "Hassan Hardware", routeZone: "Tariq Bin Ziad",
          type: "ASSET_RECOVERY", items: [{ quantity: 2, description: "Empty 19L Bottles (Account Closed)" }],
          financialImpact: 2000, 
          status: "PENDING_PICKUP", assignedRider: null
        }
      ];
    },
    enabled: Boolean(branchId),
  });
}