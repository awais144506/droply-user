/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useMemo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Navigation, Clock, MapPin, AlertTriangle, Route } from "lucide-react";
import {
  FleetRiderOverview,
  LiveRiderSocketLocation,
  RiderHistoryResponse,
} from "../types/tracking";

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

// Helper component to smoothly fly/zoom map camera or fit bounds in history mode
const MapCameraController = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMap } = mod;
      return function CameraUpdater({
        targetLat,
        targetLng,
        zoom,
        boundsPoints,
        isHistoryMode,
      }: {
        targetLat: number;
        targetLng: number;
        zoom: number;
        boundsPoints?: [number, number][];
        isHistoryMode?: boolean;
      }) {
        const map = useMap();
        useEffect(() => {
          if (isHistoryMode && boundsPoints && boundsPoints.length > 1) {
            map.fitBounds(boundsPoints, {
              padding: [90, 90],
              maxZoom: 17,
              animate: true,
              duration: 1.0,
            });
          } else if (targetLat && targetLng) {
            map.flyTo([targetLat, targetLng], zoom, {
              animate: true,
              duration: 1.2,
            });
          }
        }, [map, targetLat, targetLng, zoom, isHistoryMode, boundsPoints]);
        return null;
      };
    }),
  { ssr: false }
);

// Hook to fetch road-snapped coordinates from public OSRM router (Live Mode)
function useRoadRoute(
  startLat?: number | null,
  startLng?: number | null,
  endLat?: number | null,
  endLng?: number | null
) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!startLat || !startLng || !endLat || !endLng) {
      setRouteCoords([]);
      return;
    }

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
          );
          setRouteCoords(coords);
        }
      } catch (err) {
        console.error("Failed to fetch road route, falling back to straight line", err);
        setRouteCoords([
          [startLat, startLng],
          [endLat, endLng],
        ]);
      }
    };

    fetchRoute();
  }, [startLat, startLng, endLat, endLng]);

  return routeCoords;
}

// Haversine formula to calculate distance in meters
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { meters: number; formatted: string } {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const meters = Math.round(R * c);

  if (meters >= 1000) {
    return { meters, formatted: `${(meters / 1000).toFixed(2)} km` };
  }
  return { meters, formatted: `${meters} m` };
}

/**
 * Extracts clean checkpoints from raw GPS pings (spaced >= 40m apart)
 * and removes stationary back-and-forth jitter spikes.
 */
function extractKeyWaypoints(
  pings: Array<{ latitude: number; longitude: number }>,
  minDistanceMeters = 40
): [number, number][] {
  if (!pings || pings.length === 0) return [];
  if (pings.length === 1) return [[pings[0].latitude, pings[0].longitude]];

  const waypoints: [number, number][] = [[pings[0].latitude, pings[0].longitude]];

  for (let i = 1; i < pings.length; i++) {
    const prev = waypoints[waypoints.length - 1];
    const curr = pings[i];
    const dist = calculateDistance(prev[0], prev[1], curr.latitude, curr.longitude).meters;

    if (dist >= minDistanceMeters) {
      // Spike filter: if the new point jumps right back to the point before `prev`, skip `prev`
      if (waypoints.length >= 2) {
        const prevPrev = waypoints[waypoints.length - 2];
        const distToPrevPrev = calculateDistance(
          prevPrev[0],
          prevPrev[1],
          curr.latitude,
          curr.longitude
        ).meters;
        if (distToPrevPrev < minDistanceMeters * 0.6) {
          waypoints.pop(); // Remove the outlier spike
        }
      }
      waypoints.push([curr.latitude, curr.longitude]);
    }
  }

  // Always preserve the final destination point
  const lastPing = pings[pings.length - 1];
  const lastWp = waypoints[waypoints.length - 1];
  if (
    calculateDistance(lastWp[0], lastWp[1], lastPing.latitude, lastPing.longitude).meters > 10
  ) {
    waypoints.push([lastPing.latitude, lastPing.longitude]);
  }

  return waypoints;
}

/**
 * Hook that takes raw historical GPS pings and snaps them strictly onto actual
 * OpenStreetMap roads using OSRM's routing engine in chunks so lines NEVER cut across houses.
 */
function useRoadSnappedHistory(
  isHistoryMode: boolean,
  pings?: Array<{ latitude: number; longitude: number }>
) {
  const [snappedCoords, setSnappedCoords] = useState<[number, number][]>([]);
  const [isSnapping, setIsSnapping] = useState(false);

  const waypoints = useMemo(() => {
    if (!isHistoryMode || !pings || pings.length === 0) return [];
    return extractKeyWaypoints(pings, 40);
  }, [isHistoryMode, pings]);

  useEffect(() => {
    if (!isHistoryMode || waypoints.length === 0) {
      setSnappedCoords([]);
      return;
    }

    if (waypoints.length === 1) {
      setSnappedCoords(waypoints);
      return;
    }

    let isCancelled = false;

    const snapToRoads = async () => {
      setIsSnapping(true);
      try {
        // Chunk into groups of max 25 waypoints per OSRM request ( overlapping by 1 point )
        const CHUNK_SIZE = 25;
        const allRoadCoords: [number, number][] = [];

        for (let i = 0; i < waypoints.length - 1; i += CHUNK_SIZE - 1) {
          const chunk = waypoints.slice(i, i + CHUNK_SIZE);
          if (chunk.length < 2) break;

          const coordString = chunk
            .map(([lat, lng]) => `${lng},${lat}`)
            .join(";");

          // First try OSRM Map Matching (match/v1) with 35m GPS radius tolerance
          const radiuses = chunk.map(() => "35").join(";");
          const matchUrl = `https://router.project-osrm.org/match/v1/driving/${coordString}?overview=full&geometries=geojson&radiuses=${radiuses}&gaps=ignore`;

          let chunkCoords: [number, number][] = [];

          try {
            const matchRes = await fetch(matchUrl);
            const matchData = await matchRes.json();

            if (
              matchData.code === "Ok" &&
              matchData.matchings &&
              matchData.matchings.length > 0
            ) {
              for (const matching of matchData.matchings) {
                const coords = matching.geometry.coordinates.map(
                  (c: [number, number]) => [c[1], c[0]] as [number, number]
                );
                chunkCoords.push(...coords);
              }
            }
          } catch {
            // Fallback to route/v1 below if match fails
          }

          // Fallback to OSRM multi-waypoint routing (route/v1) if match/v1 didn't return a full trace
          if (chunkCoords.length < 2) {
            const routeUrl = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;
            const routeRes = await fetch(routeUrl);
            const routeData = await routeRes.json();

            if (
              routeData.code === "Ok" &&
              routeData.routes &&
              routeData.routes.length > 0
            ) {
              chunkCoords = routeData.routes[0].geometry.coordinates.map(
                (c: [number, number]) => [c[1], c[0]] as [number, number]
              );
            } else {
              chunkCoords = chunk;
            }
          }

          if (allRoadCoords.length > 0 && chunkCoords.length > 0) {
            allRoadCoords.push(...chunkCoords.slice(1));
          } else {
            allRoadCoords.push(...chunkCoords);
          }
        }

        if (!isCancelled) {
          setSnappedCoords(allRoadCoords.length > 0 ? allRoadCoords : waypoints);
        }
      } catch (err) {
        console.error("OSRM history road-snapping failed, using clean waypoints:", err);
        if (!isCancelled) {
          setSnappedCoords(waypoints);
        }
      } finally {
        if (!isCancelled) {
          setIsSnapping(false);
        }
      }
    };

    snapToRoads();

    return () => {
      isCancelled = true;
    };
  }, [isHistoryMode, waypoints]);

  return {
    historyPolylineCoords: snappedCoords.length > 0 ? snappedCoords : waypoints,
    isSnapping,
  };
}

type Props = {
  branchLat: number;
  branchLng: number;
  branchName: string;
  branchAddress: string;
  imageUrl?: string;
  riders?: FleetRiderOverview[];
  liveLocations?: Record<string, LiveRiderSocketLocation>;
  selectedRider: FleetRiderOverview | null;
  onSelectRider: (rider: FleetRiderOverview | null) => void;
  isHistoryMode?: boolean;
  riderHistory?: RiderHistoryResponse;
  isHistoryLoading?: boolean;
};

export const LiveTrackingMap = ({
  branchLat,
  branchLng,
  branchName,
  branchAddress,
  imageUrl,
  riders = [],
  liveLocations = {},
  selectedRider,
  onSelectRider,
  isHistoryMode = false,
  riderHistory,
  isHistoryLoading = false,
}: Props) => {
  // Determine camera focus coordinates
  const selectedRiderLiveLoc = selectedRider
    ? liveLocations[selectedRider.id]
    : null;

  const firstHistoryPing =
    isHistoryMode && riderHistory?.locationPings?.length
      ? riderHistory.locationPings[riderHistory.locationPings.length - 1]
      : null;

  const focusLat = firstHistoryPing
    ? firstHistoryPing.latitude
    : selectedRiderLiveLoc
      ? selectedRiderLiveLoc.latitude
      : branchLat;

  const focusLng = firstHistoryPing
    ? firstHistoryPing.longitude
    : selectedRiderLiveLoc
      ? selectedRiderLiveLoc.longitude
      : branchLng;

  const targetZoom = selectedRider ? 16 : 13;

  // Find active ON_ROUTE order for selected rider
  const onRouteOrder = useMemo(() => {
    if (!selectedRider || isHistoryMode) return null;
    return (
      selectedRider.activeOrders?.find(
        (o) =>
          o.status === "ON_ROUTE" &&
          o.customer?.latitude != null &&
          o.customer?.longitude != null
      ) || null
    );
  }, [selectedRider, isHistoryMode]);

  // Fetch road-snapped route coordinates via OSRM (Live Mode)
  const roadRouteCoords = useRoadRoute(
    selectedRiderLiveLoc?.latitude,
    selectedRiderLiveLoc?.longitude,
    onRouteOrder?.customer.latitude,
    onRouteOrder?.customer.longitude
  );

  // Calculate live distance between selected rider and their ON_ROUTE customer
  const liveRouteMetrics = useMemo(() => {
    if (
      !onRouteOrder ||
      !selectedRiderLiveLoc ||
      !onRouteOrder.customer.latitude ||
      !onRouteOrder.customer.longitude
    ) {
      return null;
    }
    return calculateDistance(
      selectedRiderLiveLoc.latitude,
      selectedRiderLiveLoc.longitude,
      onRouteOrder.customer.latitude,
      onRouteOrder.customer.longitude
    );
  }, [onRouteOrder, selectedRiderLiveLoc]);

  // 🔥 Snap historical GPS trail strictly onto actual roads via OSRM
  const { historyPolylineCoords, isSnapping } = useRoadSnappedHistory(
    isHistoryMode,
    riderHistory?.locationPings
  );

  // Deduplicate overlapping stop logs that are within 25m of each other
  const cleanedStopLogs = useMemo(() => {
    if (!isHistoryMode || !riderHistory?.stopLogs) return [];
    const grouped: typeof riderHistory.stopLogs = [];

    for (const stop of riderHistory.stopLogs) {
      const existing = grouped.find(
        (g) =>
          calculateDistance(g.latitude, g.longitude, stop.latitude, stop.longitude)
            .meters < 25
      );
      if (existing) {
        if (stop.durationMinutes > existing.durationMinutes) {
          existing.durationMinutes = stop.durationMinutes;
          existing.endedAt = stop.endedAt;
        }
      } else {
        grouped.push({ ...stop });
      }
    }
    return grouped;
  }, [isHistoryMode, riderHistory]);

  const historyStartPoint =
    historyPolylineCoords.length > 0 ? historyPolylineCoords[0] : null;
  const historyEndPoint =
    historyPolylineCoords.length > 0
      ? historyPolylineCoords[historyPolylineCoords.length - 1]
      : null;

  // Check if Start and End points are close to each other (< 45m apart)
  const isRoundTripSameSpot = useMemo(() => {
    if (!historyStartPoint || !historyEndPoint) return false;
    return (
      calculateDistance(
        historyStartPoint[0],
        historyStartPoint[1],
        historyEndPoint[0],
        historyEndPoint[1]
      ).meters < 45
    );
  }, [historyStartPoint, historyEndPoint]);

  // Create custom Leaflet icons safely on client side
  const icons = useMemo(() => {
    if (typeof window === "undefined") return null;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");

    const branchIcon = L.divIcon({
      html: imageUrl
        ? `<div style="width: 42px; height: 42px; border-radius: 50%; border: 3px solid #059669; overflow: hidden; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;">
             <img src="${imageUrl}" alt="Branch" style="width: 100%; height: 100%; object-fit: cover;" />
           </div>`
        : `<div style="width: 38px; height: 38px; border-radius: 50%; background: #059669; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">
             🏢
           </div>`,
      className: "",
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -22],
    });

    const createRiderIcon = (
      name: string,
      isSelected: boolean,
      isStopped: boolean
    ) => {
      const bgColor = isStopped
        ? "#e11d48"
        : isSelected
          ? "#0284c7"
          : "#10b981";

      return L.divIcon({
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #0f172a; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; margin-bottom: 3px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              ${name} ${isStopped ? "⚠️" : ""}
            </div>
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${bgColor}; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">
              🛵
            </div>
          </div>
        `,
        className: "",
        iconSize: [80, 56],
        iconAnchor: [40, 48],
        popupAnchor: [0, -45],
      });
    };

    const createOrderIcon = (status: string, customerName: string) => {
      const isOnRoute = status === "ON_ROUTE";
      const isArrived = status === "ARRIVED";
      const bg = isArrived
        ? "#10b981"
        : isOnRoute
          ? "#f59e0b"
          : "#64748b";

      return L.divIcon({
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: white; color: #0f172a; border: 1px solid #cbd5e1; font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 4px; margin-bottom: 2px; white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,0.12);">
              ${customerName}
            </div>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${bg}; border: 2px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px;">
              📦
            </div>
          </div>
        `,
        className: "",
        iconSize: [70, 44],
        iconAnchor: [35, 38],
        popupAnchor: [0, -35],
      });
    };

    // Stop badge floats cleanly ABOVE the coordinate with a stem so it never covers START/END
    const createStopLogIcon = (durationMinutes: number) =>
      L.divIcon({
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #e11d48; color: white; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; white-space: nowrap; box-shadow: 0 4px 8px rgba(225,29,72,0.4); border: 1.5px solid white;">
              ⏸ ${durationMinutes}m stop
            </div>
            <div style="width: 2px; height: 10px; background: #e11d48;"></div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #e11d48; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        className: "",
        iconSize: [84, 48],
        iconAnchor: [42, 44],
        popupAnchor: [0, -42],
      });

    // Sleek Start & End pill badges pushed to bottom-left and bottom-right when close
    const createStartPointIcon = (offsetLeft: boolean) =>
      L.divIcon({
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #10b981; color: white; font-size: 9px; font-weight: 900; letter-spacing: 0.04em; padding: 2px 8px; border-radius: 9999px; border: 1.5px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.25); white-space: nowrap;">
              ● START
            </div>
          </div>
        `,
        className: "",
        iconSize: [64, 24],
        iconAnchor: offsetLeft ? [72, -6] : [32, 12],
        popupAnchor: [0, -12],
      });

    const createEndPointIcon = (offsetRight: boolean) =>
      L.divIcon({
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #0f172a; color: white; font-size: 9px; font-weight: 900; letter-spacing: 0.04em; padding: 2px 8px; border-radius: 9999px; border: 1.5px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3); white-space: nowrap;">
              🏁 END
            </div>
          </div>
        `,
        className: "",
        iconSize: [58, 24],
        iconAnchor: offsetRight ? [-8, -6] : [29, 12],
        popupAnchor: [0, -12],
      });

    return {
      branchIcon,
      createRiderIcon,
      createOrderIcon,
      createStopLogIcon,
      createStartPointIcon,
      createEndPointIcon,
    };
  }, [imageUrl]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      {/* Bottom Floating Live Route / History Info Pill */}
      {selectedRider && !isHistoryMode && onRouteOrder && liveRouteMetrics && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[999] bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 pointer-events-auto">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                ON ROUTE
              </span>
              <span className="text-xs font-bold text-slate-300">
                #{onRouteOrder.orderCode}
              </span>
            </div>
            <p className="text-sm font-extrabold mt-0.5">
              Heading to {onRouteOrder.customer.name}
            </p>
          </div>
          <div className="pl-4 border-l border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Remaining Distance
            </span>
            <span className="text-base font-black text-emerald-400">
              {liveRouteMetrics.formatted}
            </span>
          </div>
        </div>
      )}

      {/* History Mode Banner */}
      {isHistoryMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-999 bg-white/95 backdrop-blur-md text-slate-900 px-5 py-2.5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3 pointer-events-auto">
          <Clock className="w-4 h-4 text-sky-600" />
          {!selectedRider ? (
            <span className="text-xs font-bold text-slate-600">
              Select a rider from the top bar to view their historical route & stops.
            </span>
          ) : isHistoryLoading || isSnapping ? (
            <span className="text-xs font-bold text-slate-500 animate-pulse">
              Snapping route to roads for {selectedRider.name}...
            </span>
          ) : (
            <div className="flex items-center gap-4 text-xs font-bold">
              <span>
                {selectedRider.name} •{" "}
                <span className="text-sky-600">
                  Road-Snapped Route
                </span>
              </span>
              <span className="text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {cleanedStopLogs.length} Stops Recorded
              </span>
            </div>
          )}
        </div>
      )}

      <MapContainer
        key={`${branchLat}-${branchLng}`}
        center={[branchLat, branchLng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Smooth Camera Fly-To & History Bounds Controller */}
        <MapCameraController
          targetLat={focusLat}
          targetLng={focusLng}
          zoom={targetZoom}
          boundsPoints={historyPolylineCoords}
          isHistoryMode={isHistoryMode}
        />

        {/* 1. Branch Headquarters Marker */}
        {icons?.branchIcon && (
          <Marker position={[branchLat, branchLng]} icon={icons.branchIcon}>
            <Popup>
              <div className="p-1 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  {branchName}
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  {branchAddress}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* ================================================================= */}
        {/* 2. LIVE MODE: RENDER RIDERS, ACTIVE ORDERS & ROAD ROUTE POLYLINE  */}
        {/* ================================================================= */}
        {!isHistoryMode &&
          riders.map((rider) => {
            const loc = liveLocations[rider.id];
            if (!loc || !icons) return null;

            const isSelected = selectedRider?.id === rider.id;

            return (
              <Marker
                key={rider.id}
                position={[loc.latitude, loc.longitude]}
                icon={icons.createRiderIcon(
                  rider.name,
                  isSelected,
                  loc.isStopped
                )}
                zIndexOffset={isSelected ? 1000 : 1}
                eventHandlers={{
                  click: () => onSelectRider(rider),
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 min-w-[150px]">
                    <p className="font-black text-slate-900 text-xs">
                      {rider.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      {rider.phone}
                    </p>
                    {loc.isStopped && (
                      <p className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        ⚠️ Stopped at location
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Selected Rider's Active Customer Order Pins */}
        {!isHistoryMode &&
          selectedRider &&
          selectedRider.activeOrders?.map((order) => {
            const { latitude, longitude, name } = order.customer || {};
            if (latitude == null || longitude == null || !icons) return null;

            return (
              <Marker
                key={order.id}
                position={[latitude, longitude]}
                icon={icons.createOrderIcon(order.status, name)}
              >
                <Popup>
                  <div className="p-1 space-y-1">
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                      {order.status}
                    </span>
                    <p className="font-black text-slate-900 text-xs mt-1">
                      {name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-bold">
                      Order #{order.orderCode}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Road-Snapped Polyline (Following actual streets via OSRM) */}
        {!isHistoryMode && roadRouteCoords.length > 0 && (
          <Polyline
            positions={roadRouteCoords}
            pathOptions={{
              color: "#0284c7",
              weight: 5,
              dashArray: "10, 10",
              opacity: 0.9,
            }}
          />
        )}

        {/* ================================================================= */}
        {/* 3. HISTORY MODE: OSRM ROAD-SNAPPED GPS TRAIL & CLEAN PINS         */}
        {/* ================================================================= */}
        {isHistoryMode && selectedRider && historyPolylineCoords.length > 0 && (
          <>
            {/* Crisp White Road Casing */}
            <Polyline
              positions={historyPolylineCoords}
              pathOptions={{
                color: "#ffffff",
                weight: 9,
                opacity: 0.95,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            {/* Royal Blue Road-Snapped Core */}
            <Polyline
              positions={historyPolylineCoords}
              pathOptions={{
                color: "#2563eb",
                weight: 5,
                opacity: 1,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}

        {/* Start Point Marker */}
        {isHistoryMode && historyStartPoint && icons && (
          <Marker
            position={historyStartPoint}
            icon={icons.createStartPointIcon(isRoundTripSameSpot)}
            zIndexOffset={800}
          >
            <Popup>
              <div className="p-1 text-xs font-bold text-slate-800">
                🚀 Trip Started Here
              </div>
            </Popup>
          </Marker>
        )}

        {/* End Point Marker */}
        {isHistoryMode && historyEndPoint && icons && (
          <Marker
            position={historyEndPoint}
            icon={icons.createEndPointIcon(isRoundTripSameSpot)}
            zIndexOffset={900}
          >
            <Popup>
              <div className="p-1 text-xs font-bold text-slate-800">
                🏁 Trip Ended / Latest Position
              </div>
            </Popup>
          </Marker>
        )}

        {/* Deduplicated Stop Log Markers */}
        {isHistoryMode &&
          selectedRider &&
          cleanedStopLogs.map((stop) => {
            if (!icons) return null;
            return (
              <Marker
                key={stop.id}
                position={[stop.latitude, stop.longitude]}
                icon={icons.createStopLogIcon(stop.durationMinutes)}
                zIndexOffset={1000}
              >
                <Popup>
                  <div className="p-1 space-y-1">
                    <div className="flex items-center gap-1 text-rose-600 font-black text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      Stopped for {stop.durationMinutes} mins
                    </div>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      From: {new Date(stop.startedAt).toLocaleTimeString()}
                    </p>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      To: {new Date(stop.endedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};