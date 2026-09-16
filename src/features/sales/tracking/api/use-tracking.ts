import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export type DeliveryStatus = "DELIVERED" | "HEADING_NOW" | "PENDING_DROP";
export type RiderStatus = "ONLINE" | "OFFLINE";

export interface Stop {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  bottlesDelivered: number;
  bottlesReturned: number;
  targetCash: number;
  collectedCash: number;
  addedToLedger: boolean;
  status: DeliveryStatus;
  executionTime: string | null;
}

export interface Rider {
  id: string;
  name: string;
  zone: string;
  status: RiderStatus;
  lastActive: string; // NEW: Timestamp for last ping
  battery: number;
  stopsCompleted: number;
  totalStops: number;
  cashInBag: number;
  estimatedKM: number;
  coveredKM: number;
  currentLat: number;
  currentLng: number;
  routeHistory: [number, number][]; // NEW: Array of GPS coordinates for historical path mapping
  stops: Stop[];
}

export interface TrackingData {
  date: string;
  plantStats: { collectedFromPlant: number; totalDropped: number; totalLeft: number; };
  riders: Rider[];
}

export function useTracking(branchId: string, date: string) {
  return useQuery({
    queryKey: ["fleet-tracking", branchId, date],
    queryFn: async (): Promise<TrackingData> => {
      const isHistory = date !== new Date().toISOString().split("T")[0];

      return {
        date,
        plantStats: { collectedFromPlant: 240, totalDropped: isHistory ? 240 : 165, totalLeft: isHistory ? 0 : 75 },
        riders: [
          {
            id: "r1", name: "Majid Ali", zone: "Farid Town (Block Y & Z)",
            status: isHistory ? "OFFLINE" : "ONLINE",
            lastActive: isHistory ? "Shift Ended 05:30 PM" : "Just now",
            battery: 88, stopsCompleted: 3, totalStops: 7, cashInBag: 2400, estimatedKM: 12.5, coveredKM: 10.2,
            currentLat: 30.6777, currentLng: 73.1068,
            routeHistory: isHistory ? [
              [30.6700, 73.1000], [30.6720, 73.1020], [30.6750, 73.1050],
              [30.6780, 73.1070], [30.6795, 73.1090], [30.6765, 73.1055]
            ] : [],
            stops: [
              { id: "s1", orderId: "ORD-9101", customerName: "Dr. Shahida", phone: "+92 333 1122334", address: "House 18, Block A", lat: 30.6780, lng: 73.1070, bottlesDelivered: 2, bottlesReturned: 2, targetCash: 400, collectedCash: 400, addedToLedger: true, status: "DELIVERED", executionTime: "09:45 AM" },
              { id: "s4", orderId: "ORD-9104", customerName: "Al-Rehman Mart", phone: "+92 300 9988112", address: "Shop 3, Block Z", lat: 30.6790, lng: 73.1080, bottlesDelivered: 10, bottlesReturned: 8, targetCash: 2000, collectedCash: 0, addedToLedger: false, status: isHistory ? "DELIVERED" : "HEADING_NOW", executionTime: isHistory ? "11:45 AM" : null },
              { id: "s5", orderId: "ORD-9105", customerName: "Muhammad Bilal", phone: "+92 304 9988776", address: "House 112, Block Z", lat: 30.6795, lng: 73.1090, bottlesDelivered: 2, bottlesReturned: 2, targetCash: 400, collectedCash: 0, addedToLedger: false, status: isHistory ? "DELIVERED" : "PENDING_DROP", executionTime: null },
            ]
          }
        ]
      };
    },
    enabled: Boolean(branchId),
  });
}

export interface RiderPresence {
  riderId: string;
  status: "ONLINE" | "OFFLINE";
  lastActive: string;
}
export const useRiderPresence = (branchId: string) => {
  return useQuery({
    queryKey: ["rider-presence", branchId],
    queryFn: async () => {
      const {data} = await apiClient.get<RiderPresence[]>(`/tracking/presence`, {
        params: { branchId },
      });
      return data;
    },
    enabled: !!branchId,
  });
};