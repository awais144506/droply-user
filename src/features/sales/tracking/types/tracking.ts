export type ShiftStatus = 'OFFLINE' | 'ONLINE' | 'COMPLETED';

export type TrackingOrderStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'RESCHEDULED'
  | 'ON_ROUTE'
  | 'ARRIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface TrackingOrderCustomer {
  name: string;
  latitude: number | null;
  longitude: number | null;
}

export interface TrackingActiveOrder {
  id: string;
  orderCode: string;
  status: TrackingOrderStatus;
  customer: TrackingOrderCustomer;
}

export interface RiderPresenceInfo {
  status: ShiftStatus;
  lastActive: string;
}

export interface RiderDailyStats {
  totalDeliveries: number;
  completedCount: number;
  cancelledCount: number;
  totalAmountCollected: number;
}

export interface FleetRiderOverview {
  id: string;
  name: string;
  phone: string;
  staffCode: string;
  presence: RiderPresenceInfo;
  activeOrders: TrackingActiveOrder[];
  stats: RiderDailyStats;
}

export interface LocationPingRecord {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface RiderStopLogRecord {
  id: string;
  latitude: number;
  longitude: number;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  isOngoing: boolean;
}

export interface RiderHistoryResponse {
  riderId: string;
  date: string;
  locationPings: LocationPingRecord[];
  stopLogs: RiderStopLogRecord[];
}

export interface LiveRiderSocketLocation {
  riderId: string;
  latitude: number;
  longitude: number;
  isStopped: boolean;
  stopStartTime?: number | null;
  lastUpdated: number;
}