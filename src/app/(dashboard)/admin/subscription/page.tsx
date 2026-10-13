"use client";
import { useRole } from "@/lib/hooks/use-role";
import { useSubscription } from "@/features/admin/subscription/api/use-subscription";
import { PlanOverview } from "@/features/admin/subscription/components/main/plan-overview";
import ErrorBoundary from "@/app/error";
import Loading from "@/app/loading";
import BillingTable from "@/features/admin/subscription/components/main/billing-table";

export default function SubscriptionPage() {
  const { branchId } = useRole();
  const { data, isLoading, isError, error } = useSubscription(branchId);
  const currentPlan = data?.currentPlan
  const paymentHistory = data?.paymentHistory;

  if (isLoading) return <Loading text="Loading Subscription..." />
  if (isError) return <ErrorBoundary error={error.message} />

  if (!currentPlan) {
    return (
      <div className="p-6 text-center text-slate-500">
        No active subscription plan found for this branch.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Billing & Subscription</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your workspace plan, clear pending invoices, and track billing history.
        </p>
      </div>

      {/* FIXED: Changed 'plan' to 'currentPlan' */}
      <PlanOverview currentPlan={currentPlan} />
      <BillingTable
        ledger={paymentHistory}
      />
    </div>
  );
}