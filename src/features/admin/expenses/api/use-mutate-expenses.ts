import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseApi } from "./expenses.service";
import { expensesKeys } from "./expenses-keys";
import { CreateExpenseFormData } from "../schema/create-expense.schema";
import { toast } from "sonner";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseFormData) => expenseApi.create(data),
    onSuccess: () => {
      toast.success("Expense log created successfully.")
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseApi.delete(id),
    onSuccess: () => {
      toast.success("Expense log deleted successfully.")
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });
}