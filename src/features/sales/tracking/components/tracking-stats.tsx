"use client";

import { MapPin, Droplet, Wallet, Route } from "lucide-react";
import { TrackingData } from "../api/use-tracking";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";

export function TrackingStats({ data }: { data: TrackingData }) {
  const onlineCount = data.riders.filter((r) => r.status === "ONLINE").length;
  const offlineCount = data.riders.filter((r) => r.status === "OFFLINE").length;
  const liveCash = data.riders.reduce((acc, r) => acc + r.cashInBag, 0);

  const totalEstKM = data.riders.reduce((acc, r) => acc + r.estimatedKM, 0);
  const totalCoveredKM = data.riders.reduce((acc, r) => acc + r.coveredKM, 0);
  const deviation = totalCoveredKM > totalEstKM ? ((totalCoveredKM - totalEstKM) / totalEstKM) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Fleet Status Card */}
      <PageStatsCard
        title="Fleet Status"
        value={onlineCount}
        postfix="Online"
        postfixTextColor="text-slate-500"
        icon={MapPin}
        iconContainerClass="bg-sky-50 text-sky-600"
        description={`${offlineCount} Offline`}
      />

      {/* Inventory Progress Card */}
      <PageStatsCard
        title="Inventory Progress"
        value={data.plantStats.totalDropped}
        postfix="Dropped"
        postfixTextColor="text-slate-400"
        icon={Droplet}
        iconContainerClass="bg-emerald-50 text-emerald-600"
        valueColorClass="text-emerald-600"
        description={`${data.plantStats.collectedFromPlant} items collected from branch`}
      />

      {/* Live Cash in Bag Card */}
      <PageStatsCard
        title="Live Cash in Bag"
        prefix="Rs"
        value={liveCash.toLocaleString("en-PK")}
        icon={Wallet}
        iconContainerClass="bg-amber-50 text-amber-600"
        valueColorClass="text-amber-600"
        description="Active transit money in fleet possession"
      />

      {/* Mileage & Fuel Tracking Card */}
      <PageStatsCard
        title="Mileage & Fuel Tracking"
        value={totalCoveredKM.toFixed(1)}
        postfix="KM"
        postfixTextColor="text-slate-400"
        icon={Route}
        iconContainerClass="bg-indigo-50 text-indigo-600"
        valueColorClass="text-indigo-600"
        description={`Est. ${totalEstKM.toFixed(1)} KM ${deviation > 10 ? '• ⚠️ High Deviation' : ''}`}
      />
    </div>
  );
}