"use client";
import { useRole } from "@/lib/hooks/use-role";
import { useSubscription } from "@/features/admin/subscription/api/use-subscription";
import { PlanOverview } from "@/features/admin/subscription/components/main/plan-overview";
import ErrorBoundary from "@/app/error";
import Loading from "@/app/loading";
import BillingTable from "@/features/admin/subscription/components/main/billing-table";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";

export default function SubscriptionPage() {
  const { branchId } = useRole();
  const { data, isLoading, isError, error, refetch, isRefetching } = useSubscription(branchId);
  const currentPlan = data?.currentPlan
  const paymentHistory = data?.paymentHistory;

  if (isLoading || !data) return <Loading text="Loading Subscription..." />
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
      <MainPageHeader
        heading="Billing & Subscription"
        description="Manage your workspace plan, clear pending invoices, and track billing history."
        onRefresh={refetch}
        isRefreshing={isRefetching}
      />

      {/* FIXED: Changed 'plan' to 'currentPlan' */}
      <PlanOverview currentPlan={currentPlan} />
      <BillingTable
        ledger={paymentHistory}
      />
    </div>
  );
}