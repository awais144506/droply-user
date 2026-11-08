"use client";

import { CheckCircle2, CircleDashed } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";

export function TaskStats({ pending, completed }: { pending: number, completed: number }) {


  return (
    <div className="grid grid-cols-3 gap-3">
      <PageStatsCard
        title="Pending Tasks"
        value={pending}
        icon={CircleDashed}
      />
      <PageStatsCard
        title="Completed Tasks"
        value={completed}
        icon={CheckCircle2}
        valueColorClass="text-emerald-600"
        iconContainerClass="bg-emerald-50 text-emerald-600"
      />
    </div>
  );
}