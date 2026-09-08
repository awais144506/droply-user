export interface ZoneDetails {
  id: string;
  name: string;
  ledgerAmount: number | string;
  itemsReturnable: number;
  createdAt: string;
  calculatedLedger?: number;
  calculatedReturnables?: number;
  latitude: number;
  longitude: number;
  riders: { id: string; name: string; phone: string }[];
  customers: {
    id: string;
    name: string;
    phone: string;
    address: string;
    status: "ACTIVE" | "INACTIVE" | "BLOCKED";
    customerCredit: number | string;
    customerAdvance: number | string;
    openingReturnables: number;
    currentReturnables: string
  }[];
}