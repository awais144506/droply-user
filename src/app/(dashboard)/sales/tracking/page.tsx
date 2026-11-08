"use client";

import React, { useState } from "react";
import { useRole } from "@/lib/hooks/use-role";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { LiveTrackingMap } from "@/features/sales/tracking/components/LiveTrackingMap";
import { LiveTrackingSidebar } from "@/features/sales/tracking/components/LiveTrackingSidebar";
import {
  useFleetOverview,
  useLiveRiderSocket,
  useRiderHistory,
} from "@/features/sales/tracking/api/user-riderTracking";
import { FleetRiderOverview } from "@/features/sales/tracking/types/tracking";
import Loading from "@/app/loading";

const LiveTracking = () => {
  const { branchId, userTier, isLoading: isTenantLoading } = useRole();
  const { data: branchData, isLoading: isBranchLoading } = useBranchSettings(branchId);

  // Null means Live Mode by default. A selected YYYY-MM-DD string triggers History Mode.
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRider, setSelectedRider] = useState<FleetRiderOverview | null>(null);

  const isHistoryMode = Boolean(selectedDate);

  // 1. Fetch Fleet Overview
  const { data: riders = [], isLoading: isFleetLoading, refetch, isRefetching } = useFleetOverview(
    branchId,
    userTier
  );

  // 2. Connect Live WebSocket
  const { liveLocations, isSocketConnected } = useLiveRiderSocket(
    branchId,
    userTier
  );

  // 3. Fetch Rider History (Only runs when a date & rider are selected)
  const { data: riderHistory, isLoading: isHistoryLoading } = useRiderHistory(
    selectedRider?.id,
    selectedDate || undefined,
    userTier
  );

  // Keep selectedRider synced with fresh polling data from riders array
  const activeSelectedRider =
    riders.find((r) => r.id === selectedRider?.id) || selectedRider;

  if (isTenantLoading || isBranchLoading || isFleetLoading) return <Loading text="Loading Live Tracking..."/>

  const branchLat = branchData?.branch?.latitude ?? 30.675;
  const branchLng = branchData?.branch?.longitude ?? 73.1025;
  const branchName = branchData?.name || "Branch Headquarters";
  const branchAddress = branchData?.address || "Main Distribution Hub";
  const imageUrl = branchData?.logoUrl || "";

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden rounded-3xl">
      {/* Top Horizontal Rider & Stats Bar */}
      <LiveTrackingSidebar
        riders={riders}
        selectedRider={activeSelectedRider}
        onSelect={setSelectedRider}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        isSocketConnected={isSocketConnected}
        onRefetch={refetch}
        isRefetching={isRefetching}
      />

      {/* Full-Screen Map Component */}
      <LiveTrackingMap
        key={`${branchLat}-${branchLng}`}
        branchLat={branchLat}
        branchLng={branchLng}
        branchName={branchName}
        branchAddress={branchAddress}
        imageUrl={imageUrl}
        riders={riders}
        liveLocations={liveLocations}
        selectedRider={activeSelectedRider}
        onSelectRider={setSelectedRider}
        isHistoryMode={isHistoryMode}
        riderHistory={riderHistory}
        isHistoryLoading={isHistoryLoading}
      />
    </div>
  );
};

export default LiveTracking;