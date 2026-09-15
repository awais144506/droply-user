export interface ZoneDetails {
  id: string;
  name: string;
  ledgerAmount: number | string;
  itemsReturnable: number;
  createdAt: string;
  calculatedLedger?: number;
  calculatedReturnables?: number;
  latitude?: number;
  longitude?: number;
  riders: { id: string; name: string; phone: string }[];
  customers: {
    name:string;
    phone:string;
    customerCredit: number;
    returnablesLength: number;
  }[];
}

