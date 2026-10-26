import { apiClient } from "@/lib/api-client";
import { Expense } from "../types/expenses";
import { CreateExpenseFormData } from "../schema/create-expense.schema";

const API = '/expense/user'

export const expenseApi = {
  create: async (payload: CreateExpenseFormData): Promise<Expense> => {
    return await apiClient.post(`${API}`, payload);
  },

  getAll: async (): Promise<Expense[]> => {
    return await apiClient.get(`${API}`);
  },

  delete: async (id: string) => {
    return await apiClient.delete(`${API}/${id}`);
  }
};