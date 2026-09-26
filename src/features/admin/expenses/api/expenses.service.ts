import { apiClient } from "@/lib/api-client";
import { Expense } from "../types/expenses";
import { CreateExpenseFormData } from "../schema/create-expense.schema";

export const expenseApi = {
  create: async (payload: CreateExpenseFormData): Promise<Expense> => {
    return await apiClient.post("/expense", payload);
  },

  getAll: async (branchId: string): Promise<Expense[]> => {
    return await apiClient.get(`/expense/branch/${branchId}`);
  },

  delete: async (id: string) => {
    return await apiClient.delete(`/expense/${id}`);
  }
};