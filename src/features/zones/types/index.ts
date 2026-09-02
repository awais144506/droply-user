export interface ZoneRider {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface ZoneMetrics {
  customerCount: number;
  outstandingAmount: number;
  itemsReturnable: number;
}

export interface ZoneItem {
  id: string;
  name: string;
  branchId: string;
  riders: ZoneRider[];
  customers: [];
  ledgerAmount: number;
  itemsReturnable: number;
  metrics: ZoneMetrics;
  createdAt: string;
}

export interface CreateZonePayload {
  name: string;
  riderIds?: string[];
}

export interface UpdateZonePayload {
  name?: string;
  riderIds?: string[];
}