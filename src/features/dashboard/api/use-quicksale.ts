import { useQuery } from "@tanstack/react-query";

export interface StockItem {
  id: string;
  name: string;
  price: number;
  currentStock: number;
}

export interface ActivityLog {
  id: string;
  type: "SALE" | "ALERT" | "INFO" | "SUCCESS";
  message: string;
  time: string;
}

export interface DashboardData {
  stats: {
    todayRevenue: number;
    pendingDrops: number;
    activeRiders: number;
    lowStockAlerts: number;
  };
  quickSaleItems: StockItem[];
  recentLogs: ActivityLog[];
}

export function useDashboard(branchId: string) {
  return useQuery({
    queryKey: ["dashboard", branchId],
    queryFn: async (): Promise<DashboardData> => {
      return {
        stats: {
          todayRevenue: 24500,
          pendingDrops: 46,
          activeRiders: 3,
          lowStockAlerts: 1,
        },
        quickSaleItems: [
          { id: "itm_1", name: "19L Bottle Refill", price: 200, currentStock: 145 },
          { id: "itm_2", name: "1.5L PET Carton (12x)", price: 850, currentStock: 42 },
          { id: "itm_3", name: "Manual Dispenser Pump", price: 650, currentStock: 8 },
        ],
        recentLogs: [
          { id: "l1", type: "ALERT", message: "Low Stock: Manual Dispenser Pump (8 left)", time: "10 mins ago" },
          { id: "l2", type: "SALE", message: "Walk-in Sale: 2x 19L Refill (Rs 400)", time: "25 mins ago" },
          { id: "l3", type: "INFO", message: "Manager Tariq acknowledged PO #9012", time: "1 hour ago" },
          { id: "l4", type: "SUCCESS", message: "Rider Majid Ali completed Farid Town route", time: "2 hours ago" },
          { id: "l5", type: "SALE", message: "Walk-in Sale: 1x 1.5L PET Carton (Rs 850)", time: "3 hours ago" },
        ]
      };
    },
    enabled: Boolean(branchId),
  });
}