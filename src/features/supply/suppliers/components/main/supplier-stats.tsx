"use client";

import { Wallet } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";
import { formatCurrency } from "@/lib/utils/functions/setFormat";

export function SupplierStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <PageStatsCard
        title="Total Payable"
        icon={Wallet}
        value={formatCurrency(0)}
        prefix="Rs"
        description="Outstanding supplier bills to settle"
        valueColorClass="text-rose-600"
        iconContainerClass="text-rose-600 bg-rose-50"
      />
    </div>
  );
}