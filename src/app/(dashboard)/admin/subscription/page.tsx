"use client";

import { Loader2 } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { useSubscription } from "@/features/subscription/api/use-subscription";
import { PlanOverview } from "@/features/subscription/components/plan-overview";
import { PaymentChannels } from "@/features/subscription/components/payment-channels";
import { BillingLedger } from "@/features/subscription/components/billing-ledger";

export default function SubscriptionPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading } = useSubscription(branchId);

  if (isTenantLoading || isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading subscription profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-300 mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Billing & Subscription</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your workspace plan, clear pending invoices, and track billing history.
        </p>
      </div>

      <PlanOverview plan={data.plan} />
      <PaymentChannels />
      <BillingLedger ledger={data.ledger} />
    </div>
  );
}