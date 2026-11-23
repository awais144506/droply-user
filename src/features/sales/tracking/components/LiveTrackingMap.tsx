/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Clock, MapPin, AlertTriangle, Route } from "lucide-react";
import {
  FleetRiderOverview,
  LiveRiderSocketLocation,
  RiderHistoryResponse,
} from "../types/tracking";

function MapCameraController({
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
}

// Hook to fetch road-snapped coordinates from public OSRM router (Live Mode ONLY)
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

    let isCancelled = false;

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        if (!isCancelled && data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
          );
          setRouteCoords(coords);
        }
      } catch (err) {
        console.error(
          "Failed to fetch road route, falling back to straight line",
          err
        );
        if (!isCancelled) {
          setRouteCoords([
            [startLat, startLng],
            [endLat, endLng],
          ]);
        }
      }
    };

    fetchRoute();

    return () => {
      isCancelled = true;
    };
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
  const R = 6371e3;
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

// Safely check if a coordinate pair is valid (non-zero finite numbers)
function isValidCoord(lat?: number | null, lng?: number | null): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0)
  );
}

// Determine rider offline status from either WebSocket location payload or overview object
function isRiderOffline(
  rider: FleetRiderOverview,
  loc?: LiveRiderSocketLocation | null
): boolean {
  const locAny = loc as Record<string, unknown> | null | undefined;
  const riderAny = rider as unknown as Record<string, unknown>;

  if (locAny?.isOnline === false || locAny?.isOffline === true) return true;
  if (locAny?.isOnline === true) return false;
  if (riderAny?.isOnline === false || riderAny?.status === "OFFLINE") return true;

  return false;
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
  // Prevents Leaflet "Map container is being reused by another instance" under Strict Mode
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const selectedRiderLiveLoc = selectedRider
    ? liveLocations[selectedRider.id]
    : null;

  // Clean historical GPS pings into exact dots (filters invalid coords & stacked <5m duplicates)
  const historyDots = useMemo(() => {
    if (!isHistoryMode || !riderHistory?.locationPings?.length) return [];

    const validPings = riderHistory.locationPings.filter((p) =>
      isValidCoord(p.latitude, p.longitude)
    );
    if (validPings.length === 0) return [];

    const filtered: typeof validPings = [validPings[0]];

    for (let i = 1; i < validPings.length; i++) {
      const prev = filtered[filtered.length - 1];
      const curr = validPings[i];
      const isLast = i === validPings.length - 1;
      const dist = calculateDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      ).meters;

      if (dist >= 5 || isLast) {
        filtered.push(curr);
      }
    }

    return filtered;
  }, [isHistoryMode, riderHistory?.locationPings]);

  const historyBoundsPoints = useMemo<[number, number][]>(
    () => historyDots.map((p) => [p.latitude, p.longitude]),
    [historyDots]
  );

  const historyStartPoint: [number, number] | null =
    historyDots.length > 0
      ? [historyDots[0].latitude, historyDots[0].longitude]
      : null;

  const historyEndPoint: [number, number] | null =
    historyDots.length > 0
      ? [
          historyDots[historyDots.length - 1].latitude,
          historyDots[historyDots.length - 1].longitude,
        ]
      : null;

  const focusLat = historyEndPoint
    ? historyEndPoint[0]
    : selectedRiderLiveLoc
      ? selectedRiderLiveLoc.latitude
      : branchLat;

  const focusLng = historyEndPoint
    ? historyEndPoint[1]
    : selectedRiderLiveLoc
      ? selectedRiderLiveLoc.longitude
      : branchLng;

  const targetZoom = selectedRider ? 16 : 13;

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

  const roadRouteCoords = useRoadRoute(
    !isHistoryMode ? selectedRiderLiveLoc?.latitude : null,
    !isHistoryMode ? selectedRiderLiveLoc?.longitude : null,
    !isHistoryMode ? onRouteOrder?.customer.latitude : null,
    !isHistoryMode ? onRouteOrder?.customer.longitude : null
  );

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

  const cleanedStopLogs = useMemo(() => {
    if (!isHistoryMode || !riderHistory?.stopLogs) return [];
    const grouped: typeof riderHistory.stopLogs = [];

    for (const stop of riderHistory.stopLogs) {
      if (!isValidCoord(stop.latitude, stop.longitude)) continue;
      const existing = grouped.find(
        (g) =>
          calculateDistance(
            g.latitude,
            g.longitude,
            stop.latitude,
            stop.longitude
          ).meters < 25
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

  const icons = useMemo(() => {
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
      isStopped: boolean,
      isOffline: boolean
    ) => {
      const bgColor = isOffline
        ? "#64748b"
        : isStopped
          ? "#e11d48"
          : isSelected
            ? "#0284c7"
            : "#10b981";

      const statusDotColor = isOffline ? "#ef4444" : "#22c55e";
      const borderColor = isOffline ? "#ef4444" : "#ffffff";

      return L.divIcon({
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; opacity: ${isOffline ? 0.85 : 1};">
            <div style="display: flex; align-items: center; gap: 5px; background: #0f172a; color: white; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; margin-bottom: 3px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.25); border: 1px solid ${isOffline ? "#ef4444" : "transparent"};">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: ${statusDotColor}; display: inline-block; flex-shrink: 0;"></span>
              <span>${name}</span>
              ${isOffline ? `<span style="color: #fca5a5; font-size: 9px; font-weight: 900;">OFFLINE</span>` : isStopped ? "⚠️" : ""}
            </div>
            <div style="position: relative; width: 36px; height: 36px; border-radius: 50%; background: ${bgColor}; border: 3px solid ${borderColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">
              🛵
              ${
                isOffline
                  ? `<span style="position: absolute; top: -3px; right: -3px; width: 11px; height: 11px; border-radius: 50%; background: #ef4444; border: 2px solid white;"></span>`
                  : ""
              }
            </div>
          </div>
        `,
        className: "",
        iconSize: [110, 58],
        iconAnchor: [55, 50],
        popupAnchor: [0, -46],
      });
    };

    const createOrderIcon = (status: string, customerName: string) => {
      const isOnRoute = status === "ON_ROUTE";
      const isArrived = status === "ARRIVED";
      const bg = isArrived ? "#10b981" : isOnRoute ? "#f59e0b" : "#64748b";

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
      {/* Bottom Floating Live Route Info Pill */}
      {selectedRider && !isHistoryMode && onRouteOrder && liveRouteMetrics && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-999 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 pointer-events-auto">
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
              Select a rider from the top bar to view their historical GPS points & stops.
            </span>
          ) : isHistoryLoading ? (
            <span className="text-xs font-bold text-slate-500 animate-pulse">
              Loading GPS history for {selectedRider.name}...
            </span>
          ) : (
            <div className="flex items-center gap-4 text-xs font-bold">
              <span>
                {selectedRider.name} •{" "}
                <span className="text-blue-600">
                  {historyDots.length} GPS Points
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

      {isMounted && (
        <MapContainer
          center={[branchLat, branchLng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapCameraController
            targetLat={focusLat}
            targetLng={focusLng}
            zoom={targetZoom}
            boundsPoints={historyBoundsPoints}
            isHistoryMode={isHistoryMode}
          />

          {/* 1. Branch Headquarters Marker */}
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

          {/* 2. LIVE MODE: RIDERS, ACTIVE ORDERS & ROAD ROUTE POLYLINE */}
          {!isHistoryMode &&
            riders.map((rider) => {
              const loc = liveLocations[rider.id];
              if (!loc || !isValidCoord(loc.latitude, loc.longitude)) {
                return null;
              }

              const isSelected = selectedRider?.id === rider.id;
              const offline = isRiderOffline(rider, loc);

              return (
                <Marker
                  key={rider.id}
                  position={[loc.latitude, loc.longitude]}
                  icon={icons.createRiderIcon(
                    rider.name,
                    isSelected,
                    loc.isStopped,
                    offline
                  )}
                  zIndexOffset={isSelected ? 1000 : offline ? 0 : 10}
                  eventHandlers={{
                    click: () => onSelectRider(rider),
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 min-w-38.75">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-black text-slate-900 text-xs">
                          {rider.name}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                            offline
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              offline ? "bg-rose-600" : "bg-emerald-600"
                            }`}
                          />
                          {offline ? "Offline" : "Online"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {rider.phone}
                      </p>
                      {offline && (
                        <p className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                          🔴 Connection lost — showing last known spot
                        </p>
                      )}
                      {!offline && loc.isStopped && (
                        <p className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                          ⚠️ Stopped at location
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {!isHistoryMode &&
            selectedRider &&
            selectedRider.activeOrders?.map((order) => {
              const { latitude, longitude, name } = order.customer || {};
              if (!isValidCoord(latitude, longitude)) return null;

              return (
                <Marker
                  key={order.id}
                  position={[latitude!, longitude!]}
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

          {/* 3. HISTORY MODE: EXACT SMALL BLUE GPS DOTS (NO FAKE LINES) */}
          {isHistoryMode &&
            selectedRider &&
            historyDots.map((ping, idx) => {
              const pingAny = ping as unknown as Record<string, unknown>;
              const rawTime =
                pingAny.recordedAt || pingAny.createdAt || pingAny.timestamp;
              const formattedTime = rawTime
                ? new Date(String(rawTime)).toLocaleTimeString()
                : null;

              return (
                <CircleMarker
                  key={String(
                    pingAny.id || `${ping.latitude}-${ping.longitude}-${idx}`
                  )}
                  center={[ping.latitude, ping.longitude]}
                  radius={4.5}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 1.5,
                    fillColor: "#2563eb",
                    fillOpacity: 0.92,
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-0.5 text-[11px]">
                      <p className="font-black text-slate-900">
                        GPS Point #{idx + 1}
                      </p>
                      {formattedTime && (
                        <p className="font-semibold text-blue-600">
                          {formattedTime}
                        </p>
                      )}
                      <p className="font-mono text-[10px] text-slate-500">
                        {ping.latitude.toFixed(6)}, {ping.longitude.toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

          {isHistoryMode && historyStartPoint && (
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

          {isHistoryMode && historyEndPoint && (
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

          {isHistoryMode &&
            selectedRider &&
            cleanedStopLogs.map((stop) => (
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
            ))}
        </MapContainer>
      )}
    </div>
  );
};