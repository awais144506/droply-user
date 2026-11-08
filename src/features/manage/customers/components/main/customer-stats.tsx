"use client";

import { Users, Wallet, Package } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";

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
        title="Total Customers"
        value={totalCustomers}
        icon={Users}
        postfix={`(${activeCount} Active)`}
        postfixTextColor="text-emerald-600"
      />

      <PageStatsCard
        title="Total Outstanding"
        prefix="Rs."
        value={totalDebt}
        icon={Wallet}
        iconContainerClass="bg-amber-50 text-amber-600"
      />

      <PageStatsCard
        title="Returnable Items"
        postfix="items"
        value={totalAssets}
        icon={Package}
        iconContainerClass="bg-indigo-50 text-indigo-600"
      />
    </div>
  );
}