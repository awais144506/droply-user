/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { riderTrackingService } from './riderTracking.service';
import { LiveRiderSocketLocation } from '../types/tracking';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export const TRACKING_QUERY_KEYS = {
  all: ['rider-tracking'] as const,
  overview: (branchId?: string | null) =>
    [...TRACKING_QUERY_KEYS.all, 'overview', branchId] as const,
  history: (riderId?: string | null, date?: string) =>
    [...TRACKING_QUERY_KEYS.all, 'history', riderId, date] as const,
};

/**
 * HOOK 1: Fetch all branch riders, active orders, presence, and daily stats
 */
export function useFleetOverview(branchId?: string | null, userTier?: string) {
  const isPlatinum = userTier?.toUpperCase() === 'PLATINUM';

  return useQuery({
    queryKey: TRACKING_QUERY_KEYS.overview(branchId),
    queryFn: () => riderTrackingService.getFleetOverview(),
    enabled: Boolean(branchId) && isPlatinum,
    refetchInterval: 30000, // Refresh order/collection stats every 30s alongside live socket
    staleTime: 10000,
  });
}

/**
 * HOOK 2: Fetch historical GPS pings & stop logs for a selected rider and date (YYYY-MM-DD)
 */
export function useRiderHistory(
  riderId?: string | null,
  date?: string,
  userTier?: string,
) {
  const isPlatinum = userTier?.toUpperCase() === 'PLATINUM';

  return useQuery({
    queryKey: TRACKING_QUERY_KEYS.history(riderId, date),
    queryFn: () => riderTrackingService.getRiderHistory(riderId!, date!),
    enabled: Boolean(riderId) && Boolean(date) && isPlatinum,
    staleTime: 60000,
  });
}

/**
 * HOOK 3: Real-time WebSocket hook for live rider coordinates on the Manager Map
 */
export function useLiveRiderSocket(branchId?: string | null, userTier?: string) {
  const [liveLocations, setLiveLocations] = useState<
    Record<string, LiveRiderSocketLocation>
  >({});
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const isPlatinum = userTier?.toUpperCase() === 'PLATINUM';

  useEffect(() => {
    // Wait until branchId is fully loaded and platinum is verified
    if (!branchId || !isPlatinum || !BACKEND_URL) {
      setIsSocketConnected(false);
      return;
    }

    const socket: Socket = io(`${BACKEND_URL}/rider`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      autoConnect: true,
    });

    socket.on('connect', () => {
      setIsSocketConnected(true);
      socket.emit('joinBranchMap', { branchId });
    });

    socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    socket.on(
      'initialRiderLocations',
      (initialList: LiveRiderSocketLocation[]) => {
        const nextMap: Record<string, LiveRiderSocketLocation> = {};
        initialList.forEach((loc) => {
          nextMap[loc.riderId] = loc;
        });
        setLiveLocations((prev) => ({ ...prev, ...nextMap }));
      },
    );

    socket.on('riderLocationUpdated', (update: LiveRiderSocketLocation) => {
      setLiveLocations((prev) => ({
        ...prev,
        [update.riderId]: update,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [branchId, isPlatinum]);

  return {
    liveLocations,
    isSocketConnected,
  };
}