"use client";

import { Loader2 } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { useDashboard } from "@/features/dashboard/api/use-dashboard";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { QuickSale } from "@/features/dashboard/components/quick-sale";
import { ActivityFeed } from "@/features/dashboard/components/activity-feed-card";

export default function DashboardPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading } = useDashboard(branchId);

  if (isTenantLoading || isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Syncing branch data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6 print:p-0 print:m-0">
      {/* Hide headers during print */}
      <div className="print:hidden">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Branch Operations</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time oversight of daily sales, inventory movement, and fleet execution.
        </p>
      </div>

      <div className="print:hidden">
        <DashboardStats stats={data.stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[450px]">
        <QuickSale items={data.quickSaleItems} />
        <ActivityFeed logs={data.recentLogs} />
      </div>
    </div>
  );
}