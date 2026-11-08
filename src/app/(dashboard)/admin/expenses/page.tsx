"use client";

import { useRole } from "@/lib/hooks/use-role";
import { useExpenses } from "@/features/admin/expenses/api/use-expenses";
import { ExpenseStats } from "@/features/admin/expenses/components/expenses-stats";
import { ExpenseTable } from "@/features/admin/expenses/components/expense-table";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";

export default function ExpensesPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading, isError, error, refetch, isRefetching } = useExpenses(branchId);
  const stats = data?.stats || { totalAmount: 0 };
  const expenses = data?.expenses;


  if (isTenantLoading || isLoading || !data) return <Loading text="Loading Expenses..." />

  if (isError) return <ErrorBoundary error={error.message} />

  return (
    <div className="space-y-6 min-w-300 mx-auto p-6">
      <MainPageHeader
        heading="Petty Expenses"
        description="Log and categorize daily operational costs, bills, and office supplies."
        href="/admin/expenses/create-log"
        btnText="Log Expense"
        onRefresh={refetch}
        isRefreshing={isRefetching}
      />

      <ExpenseStats totalExpenses={stats?.totalAmount} />

      <ExpenseTable
        expenses={expenses}
      />
    </div>
  );
}