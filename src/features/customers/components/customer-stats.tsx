"use client";

import { Users, Wallet, Package } from "lucide-react";
import PageStatsCard from "@/lib/utils/page-stats-card";

interface CustomerStatsProps {
  totalCustomers: number;
  activeCount: number;
  totalDebt: string;
  totalAssets: number;
}

export function CustomerStats({
  totalCustomers,
  activeCount,
  totalDebt,
  totalAssets
}: CustomerStatsProps) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <PageStatsCard
        title="Total Accounts"
        value={totalCustomers}
        icon={Users}
        postfix={`(${activeCount} Active)`}
        postfixTextColor="text-emerald-600"
      />

      <PageStatsCard
        title="Total Outstanding Khata"
        prefix="Rs."
        value={totalDebt}
        icon={Wallet}
        iconContainerClass="bg-amber-50 text-amber-600"
      />

      <PageStatsCard
        title="Assets In Market"
        postfix="items"
        value={totalAssets}
        icon={Package}
        iconContainerClass="bg-indigo-50 text-indigo-600"
      />
    </div>
  );
}