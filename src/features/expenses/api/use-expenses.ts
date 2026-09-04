import { useQuery } from "@tanstack/react-query";

export type ExpenseCategory = "UTILITIES" | "MAINTENANCE" | "OFFICE_SUPPLIES" | "REFRESHMENTS" | "LOGISTICS" | "OTHER";
export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "MOBILE_WALLET";

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  loggedBy: string;
}

export function useExpenses(branchId: string) {
  return useQuery({
    queryKey: ["petty-expenses", branchId],
    queryFn: async (): Promise<Expense[]> => {
      return [
        {
          id: "1", date: "2026-09-02", category: "REFRESHMENTS",
          description: "Tea and snacks for supplier meeting", amount: 1200,
          paymentMethod: "CASH", loggedBy: "Manager Tariq"
        },
        {
          id: "2", date: "2026-09-01", category: "UTILITIES",
          description: "August Electricity Bill (MEPCO)", amount: 45000,
          paymentMethod: "BANK_TRANSFER", loggedBy: "Admin"
        },
        {
          id: "3", date: "2026-08-28", category: "MAINTENANCE",
          description: "Plumber for fixing plant RO leak", amount: 3500,
          paymentMethod: "CASH", loggedBy: "Chaudhry Bilal"
        },
        {
          id: "4", date: "2026-08-25", category: "OFFICE_SUPPLIES",
          description: "Printer ink and A4 paper rim", amount: 2800,
          paymentMethod: "CASH", loggedBy: "Manager Tariq"
        },
        {
          id: "5", date: "2026-08-22", category: "LOGISTICS",
          description: "Toll tax and emergency puncture", amount: 850,
          paymentMethod: "CASH", loggedBy: "Rider Ali"
        }
      ];
    },
    enabled: Boolean(branchId),
  });
}