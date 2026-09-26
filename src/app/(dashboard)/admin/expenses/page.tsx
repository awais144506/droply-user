"use client";

import { useRole } from "@/lib/hooks/use-role";
import { useExpenses } from "@/features/admin/expenses/api/use-expenses";
import { ExpenseStats } from "@/features/admin/expenses/components/expenses-stats";
import { ExpenseTable } from "@/features/admin/expenses/components/expense-table";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import Loading from "@/app/loading";

export default function ExpensesPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading } = useExpenses(branchId);
  const stats = data?.stats || { totalAmount: 0 };
  const expenses = data?.expenses;


  if (isTenantLoading || isLoading) return <Loading text="Loading expenses logs..." />

  return (
    <div className="space-y-6 min-w-300 mx-auto p-6">
      <MainPageHeader
        heading="Petty Expenses"
        description="Log and categorize daily operational costs, bills, and office supplies."
        href="/admin/expenses/create-log"
        btnText="Log Expense"
      />

      <ExpenseStats totalExpenses={stats?.totalAmount} />

      <ExpenseTable
        expenses={expenses}
      />
    </div>
  );
}