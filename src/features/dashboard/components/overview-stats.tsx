import { Building2, CircleDollarSign, Users, ShieldCheck } from "lucide-react";
import { KPICard } from "./kpi-card";

export function OverviewStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title="Active Branches"
        value="12"
        description="Across 3 target cities"
        icon={Building2}
        trend={{ value: "+2 this mo", isPositive: true }}
        iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400"
      />

      <KPICard
        title="Monthly Revenue"
        value="PKR 96,000"
        description="Flat Rs. 8k/mo billing model"
        icon={CircleDollarSign}
        trend={{ value: "100% Collected", isPositive: true }}
        iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400"
      />

      <KPICard
        title="Active Platform Seats"
        value="94 / 180"
        description="Riders & Branch Managers"
        icon={Users}
        trend={{ value: "52% Quota", isPositive: true }}
        iconColor="text-violet-600 bg-violet-50 dark:bg-violet-950/50 dark:text-violet-400"
      />

      <KPICard
        title="System Uptime"
        value="99.98%"
        description="NestJS & WebSocket Gateway"
        icon={ShieldCheck}
        iconColor="text-teal-600 bg-teal-50 dark:bg-teal-950/50 dark:text-teal-400"
      />
    </div>
  );
}