"use client";

import { Users, Wallet, Package } from "lucide-react";
import PageStatsCard from "@/utils/page-stats-card";

interface CustomerStatsProps {
  totalCustomers: number;
  activeCount: number;
  totalDebt: number;
  totalAssets: number;
}

export function CustomerStats({
  totalCustomers,
  activeCount,
  totalDebt,
  totalAssets
}: CustomerStatsProps) {


  const totalDebtRupee = totalDebt.toLocaleString("en-PK", { maximumFractionDigits: 0 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <PageStatsCard
        title="Total Accounts"
        value={totalCustomers}
        icon={Users}
        postfix={`(${activeCount} Active)`}
      />

      <PageStatsCard
        title="Total Outstanding Khata"
        prefix="Rs."
        value={totalDebtRupee}
        icon={Wallet}
        iconContainerClass="bg-amber-50 text-amber-600"
      />

      <PageStatsCard
        title="Assets In Market"
        postfix="units"
        value={totalAssets}
        icon={Package}
        iconContainerClass="bg-indigo-50 text-indigo-600"
      />
    </div>
  );
}