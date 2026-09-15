"use client";

import { MapPin, Users, Wallet, RotateCcw } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";

interface ZoneStatsProps {
  totalZones: number;
  totalCustomers: number;
  totalLedger: number;
  totalReturnables: number;
}

export function ZoneStats({
  totalZones,
  totalCustomers,
  totalLedger,
  totalReturnables
}: ZoneStatsProps) {

  const totalLedgerRupees = totalLedger.toLocaleString("en-PK", { maximumFractionDigits: 0 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <PageStatsCard
        title="Total Zones"
        value={totalZones}
        icon={MapPin}
      />
      <PageStatsCard
        title="Total Customers"
        value={totalCustomers}
        icon={Users}
        iconContainerClass="bg-emerald-50 text-emerald-600"
      />
      <PageStatsCard
        title="Total Outstanding (KHATA)"
        value={totalLedgerRupees}
        prefix="Rs."
        icon={Wallet}
        iconContainerClass="bg-amber-50 text-amber-600"
      />
      <PageStatsCard
        title="Returnables Items Held"
        value={totalReturnables}
        postfix="items"
        icon={RotateCcw}
        iconContainerClass="bg-indigo-50 text-indigo-600"
      />
    </div>
  );
}