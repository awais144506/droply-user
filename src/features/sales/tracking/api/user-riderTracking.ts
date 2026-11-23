/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { riderTrackingService } from "./riderTracking.service";
import { LiveRiderSocketLocation } from "../types/tracking";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export const TRACKING_QUERY_KEYS = {
  all: ["rider-tracking"] as const,
  overview: (branchId?: string | null) =>
    [...TRACKING_QUERY_KEYS.all, "overview", branchId] as const,
  history: (riderId?: string | null, date?: string) =>
    [...TRACKING_QUERY_KEYS.all, "history", riderId, date] as const,
};

/**
 * HOOK 1: Fetch all branch riders, active orders, presence, and daily stats
 */
export function useFleetOverview(branchId?: string | null, userTier?: string) {
  const isPlatinum = userTier?.toUpperCase() === "PLATINUM";

  return useQuery({
    queryKey: TRACKING_QUERY_KEYS.overview(branchId),
    queryFn: () => riderTrackingService.getFleetOverview(),
    enabled: Boolean(branchId) && isPlatinum,
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

/**
 * HOOK 2: Fetch historical GPS pings & stop logs for a selected rider and date (YYYY-MM-DD)
 */
export function useRiderHistory(
  riderId?: string | null,
  date?: string,
  userTier?: string
) {
  const isPlatinum = userTier?.toUpperCase() === "PLATINUM";

  return useQuery({
    queryKey: TRACKING_QUERY_KEYS.history(riderId, date),
    queryFn: () => riderTrackingService.getRiderHistory(riderId!, date!),
    enabled: Boolean(riderId) && Boolean(date) && isPlatinum,
    staleTime: 60000,
  });
}

type RiderLiveState = LiveRiderSocketLocation & {
  isOnline?: boolean;
  lastUpdatedAt?: number;
};

/**
 * HOOK 3: Real-time WebSocket hook for live rider coordinates & presence on the Manager Map
 */
export function useLiveRiderSocket(
  branchId?: string | null,
  userTier?: string
) {
  const [liveLocations, setLiveLocations] = useState<
    Record<string, RiderLiveState>
  >({});
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const isPlatinum = userTier?.toUpperCase() === "PLATINUM";

  useEffect(() => {
    // Clear stale rider locations whenever branch or tier eligibility changes
    setLiveLocations({});

    if (!branchId || !isPlatinum || !BACKEND_URL) {
      setIsSocketConnected(false);
      return;
    }

    const socket: Socket = io(`${BACKEND_URL}/rider`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      autoConnect: true,
    });

    socket.on("connect", () => {
      setIsSocketConnected(true);
      socket.emit("joinBranchMap", { branchId });
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("[RiderSocket] Connection error:", err.message);
      setIsSocketConnected(false);
    });

    // Replace state cleanly with authoritative snapshot for this branch
    socket.on("initialRiderLocations", (initialList: RiderLiveState[]) => {
      const nextMap: Record<string, RiderLiveState> = {};
      initialList.forEach((loc) => {
        if (!loc?.riderId) return;
        nextMap[loc.riderId] = {
          ...loc,
          lastUpdatedAt: Date.now(),
        };
      });
      setLiveLocations(nextMap);
    });

    // Live GPS update -> automatically marks rider online again
    socket.on("riderLocationUpdated", (update: RiderLiveState) => {
      if (!update?.riderId) return;
      setLiveLocations((prev) => ({
        ...prev,
        [update.riderId]: {
          ...prev[update.riderId],
          ...update,
          isOnline: update.isOnline ?? true,
          lastUpdatedAt: Date.now(),
        },
      }));
    });

    // Dedicated presence event when rider's socket disconnects or reconnects
    socket.on(
      "riderStatusUpdated",
      ({ riderId, isOnline }: { riderId: string; isOnline: boolean }) => {
        if (!riderId) return;
        setLiveLocations((prev) => {
          if (!prev[riderId]) return prev;
          return {
            ...prev,
            [riderId]: {
              ...prev[riderId],
              isOnline,
            },
          };
        });
      }
    );

    // Fallback alias in case your gateway emits `riderOffline`
    socket.on("riderOffline", ({ riderId }: { riderId: string }) => {
      if (!riderId) return;
      setLiveLocations((prev) => {
        if (!prev[riderId]) return prev;
        return {
          ...prev,
          [riderId]: {
            ...prev[riderId],
            isOnline: false,
          },
        };
      });
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [branchId, isPlatinum]);

  return {
    liveLocations,
    isSocketConnected,
  };
}