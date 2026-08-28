export interface ZoneEntity {
  id: string;
  branchId: string;
  name: string;
  description?: string;
  defaultRider?: {
    id: string;
    name: string;
    phone: string;
  } | null;
  metrics: {
    customerCount: number;
    outstandingAmount: number;
    returnablesHeld: number; // Empty 19L bottles with customers
  };
  isActive: boolean;
  createdAt: string;
}

export interface ZoneSummaryStats {
  totalZones: number;
  customersMapped: number;
  totalOutstanding: number;
  totalReturnablesHeld: number;
}

export interface CreateZoneInput {
  name: string;
  description?: string;
  defaultRiderId?: string;
}