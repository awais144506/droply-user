"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { useExpenses, Expense } from "@/features/expenses/api/use-expenses";
import { ExpenseStats } from "@/features/expenses/components/expenses-stats";
import { ExpenseTable } from "@/features/expenses/components/expense-table";
import { Button } from "@/components/ui/button";

export default function ExpensesPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: expenses = [], isLoading } = useExpenses(branchId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  if (isTenantLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading petty expenses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Petty Expenses</h1>
          <p className="text-sm text-slate-500 mt-1">
            Log and categorize daily operational costs, bills, and office supplies.
          </p>
        </div>
        <Button 
          onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white h-10 px-4 rounded-xl shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" /> Log Expense
        </Button>
      </div>

      <ExpenseStats expenses={expenses} />
      
      <ExpenseTable 
        expenses={expenses} 
        onEdit={(expense) => {
          setEditingExpense(expense);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}