"use client";

import { Users, Wallet, Package } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";

interface ZoneStatsProps {
  totalCustomers?: number;
  totalLedger?: string;
  totalReturnables?: number;
}

export function ZoneDetailStats({
  totalCustomers,
  totalLedger,
  totalReturnables
}: ZoneStatsProps) {


  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <PageStatsCard
        title="Total Customers"
        value={totalCustomers || 0}
        icon={Users}
      />
      <PageStatsCard
        title="Zone Khata"
        value={totalLedger || 0}
        prefix="Rs."
        icon={Wallet}
        iconContainerClass="bg-amber-50 text-amber-600"
        valueColorClass="text-amber-600"
      />
      <PageStatsCard
        title="Assets Out"
        value={totalReturnables}
        postfix="items"
        icon={Package}
        iconContainerClass="bg-indigo-50 text-indigo-600"
        valueColorClass="text-indigo-600"
      />
    </div>
  );
}