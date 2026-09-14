"use client";

import { Truck, CheckCheckIcon, Wrench, Ban } from "lucide-react";
import PageStatsCard from "@/lib/utils/page-stats-card";

interface Props {
  total: number;
  active: number;
  inMaintenance: number;
  retired: number;
}
export function FleetStats({ total, active, inMaintenance, retired }: Props) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      <PageStatsCard
        title="Total Vehicles"
        value={total}
        icon={Truck}
      />
      <PageStatsCard
        title="Active"
        value={active}
        icon={CheckCheckIcon}
        iconContainerClass="bg-emerald-50 text-emerald-600"
      />
      <PageStatsCard
        title="Maintenance"
        value={inMaintenance}
        icon={Wrench}
        iconContainerClass="bg-amber-50 text-amber-600"
      />
      <PageStatsCard
        title="Retired"
        value={retired}
        icon={Ban}
        iconContainerClass="bg-rose-50 text-rose-600"
      />
    </div>
  );
}