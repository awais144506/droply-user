import { useQuery } from "@tanstack/react-query";

export interface Supplier {
  id: string;
  firmName: string;
  contactPerson: string;
  phone: string;
  city: string;
  mainProductName: string; 
  payableBalance: number;
  totalPurchases: number;
  lastPurchaseDate: string | null;
}

export function useSuppliers(branchId: string) {
  return useQuery({
    queryKey: ["suppliers", branchId],
    queryFn: async (): Promise<Supplier[]> => {
      // Mock data grounded in realistic regional context
      return [
        { id: "1", firmName: "Al-Sharq Plastics & Polymers", contactPerson: "Haji Abdul Rehman", phone: "+92 323 0010950", city: "Lahore", mainProductName: "Raw Preforms", payableBalance: 36000, totalPurchases: 485000, lastPurchaseDate: "2026-08-24" },
        { id: "2", firmName: "SES Group Packaging", contactPerson: "Muhammad Tariq", phone: "+92 301 1117883", city: "Gujranwala", mainProductName: "Shrink Seals", payableBalance: 126282, totalPurchases: 890000, lastPurchaseDate: "2026-08-18" },
        { id: "3", firmName: "Indus Filtration & Chemicals", contactPerson: "Engr. Salman Qureshi", phone: "+92 300 4545678", city: "Multan", mainProductName: "Purification Chemicals", payableBalance: 0, totalPurchases: 260000, lastPurchaseDate: "2026-08-10" },
        { id: "4", firmName: "Pak Pump Importers", contactPerson: "Zubair Ahmad", phone: "+92 333 8989123", city: "Lahore", mainProductName: "Manual Dispensers", payableBalance: 18500, totalPurchases: 145000, lastPurchaseDate: "2026-07-28" },
        { id: "5", firmName: "Sahiwal General Traders", contactPerson: "Ali Hassan", phone: "+92 300 1234567", city: "Sahiwal", mainProductName: "Cleaning Supplies", payableBalance: 0, totalPurchases: 55000, lastPurchaseDate: "2026-09-01" },
      ];
    },
    enabled: Boolean(branchId),
  });
}