"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRole } from "@/lib/hooks/use-role";
import { useTracking, Rider } from "@/features/sales/tracking/api/use-tracking";
import { TrackingStats } from "@/features/sales/tracking/components/tracking-stats";
import { RiderSidebar } from "@/features/sales/tracking/components/rider-sidebar";
import { ShiftManifest } from "@/features/sales/tracking/components/shift-manifest";
import TrackingHeader from "@/features/sales/tracking/components/tracking-header";
import Loading from "@/app/loading";
import { getLocalTodayString } from "@/lib/utils/functions/date-utils";

const TrackingMap = dynamic(() => import("@/features/sales/tracking/components/tracking-map"), {
  ssr: false,
  loading: () => <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 animate-pulse h-full" />
});

export default function TrackingPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const todayStr = getLocalTodayString();
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);

  const { data, isLoading } = useTracking(branchId, selectedDate);
  const isHistoryMode = selectedDate !== todayStr;

  if (isTenantLoading || isLoading || !data) return <Loading />

  if (!selectedRider && data.riders.length > 0) {
    setSelectedRider(data.riders[0]);
  }

  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">

      {/* Dynamic Header: Color shifts completely based on Live vs History mode */}
      <TrackingHeader
        isHistoryMode={isHistoryMode}
        todayStr={todayStr}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setSelectedRider={setSelectedRider}
        isFetching={isLoading}
      />

      <TrackingStats
        data={data}
      />

      <div className="flex flex-col lg:flex-row gap-6 h-112.5">
        <TrackingMap rider={selectedRider} isHistoryMode={isHistoryMode} />
        <RiderSidebar
          branchId={branchId}
          riders={data.riders}
          selectedRider={selectedRider}
          onSelect={setSelectedRider}
        />
      </div>

      <ShiftManifest rider={selectedRider} />
    </div>
  );
}