/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRole } from "@/lib/hooks/use-role";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { LiveTrackingMap } from "@/features/sales/tracking/components/LiveTrackingMap";
import { LiveTrackingSidebar } from "@/features/sales/tracking/components/LiveTrackingSidebar";

const LiveTracking = () => {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: branchData, isLoading: isBranchLoading } = useBranchSettings(branchId);

  const [selectedRider, setSelectedRider] = useState<any | null>(null);

  if (isTenantLoading || isBranchLoading) {
    return (
      <div className="w-full h-[calc(100vh-5rem)] rounded-3xl border border-slate-200 bg-slate-50 flex items-center justify-center animate-pulse text-slate-400">
        Loading Live Tracking...
      </div>
    );
  }

  const branchLat = branchData?.branch?.latitude ?? 30.6750;
  const branchLng = branchData?.branch?.longitude ?? 73.1025;
  const branchName = branchData?.name || "Branch Headquarters";
  const branchAddress = branchData?.address || "Main Distribution Hub";
  const imageUrl = branchData?.logoUrl || "";

  return (
    <div className="relative w-full h-[calc(100vh-5rem)]">
      {/* Floating Sidebar Overlay */}
      <LiveTrackingSidebar
        selectedRider={selectedRider}
        onSelect={setSelectedRider}
      />

      {/* Full-Screen Map Component */}
      <LiveTrackingMap
        branchLat={branchLat}
        branchLng={branchLng}
        branchName={branchName}
        branchAddress={branchAddress}
        imageUrl={imageUrl}
        selectedRider={selectedRider}
        onSelectRider={setSelectedRider}
      />
    </div>
  );
};

export default LiveTracking;