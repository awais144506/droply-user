import { useQuery } from "@tanstack/react-query";
import { expensesKeys } from "./expenses-keys";
import { expenseApi } from "./expenses.service";

export function useExpenses(branchId: string, search?: string, category?: string) {
  return useQuery({
    queryKey: expensesKeys.list(branchId),
    queryFn: () => expenseApi.getAll(branchId),
    select: (allExpenses) => {
      const totalAmount = allExpenses.reduce((acc, expense) => acc + expense.amount, 0);
      let filteredExpenses = allExpenses;
      if (category && category !== "All Categories") {
        filteredExpenses = filteredExpenses.filter(e => e.type === category);
      }
      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredExpenses = filteredExpenses.filter(e =>
          e.description.toLowerCase().includes(lowerSearch) ||
          e.givenBy.toLowerCase().includes(lowerSearch)
        );
      }
      return {
        expenses: filteredExpenses,
        stats: {
          totalAmount,
        }
      };
    },
    enabled: !!branchId,
  });
}