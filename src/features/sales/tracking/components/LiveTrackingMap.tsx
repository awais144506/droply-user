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

// Helper component to smoothly fly/zoom map camera when a rider is clicked
const MapCameraController = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMap } = mod;
      return function CameraUpdater({
        targetLat,
        targetLng,
        zoom,
      }: {
        targetLat: number;
        targetLng: number;
        zoom: number;
      }) {
        const map = useMap();
        useEffect(() => {
          if (targetLat && targetLng) {
            map.flyTo([targetLat, targetLng], zoom, {
              animate: true,
              duration: 1.2,
            });
          }
        }, [map, targetLat, targetLng, zoom]);
        return null;
      };
    }),
  { ssr: false }
);

// Hook to fetch road-snapped coordinates from public OSRM router
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

// Haversine formula to calculate live distance between rider and customer
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

  // Find active ON_ROUTE order for selected rider (to draw road-snapped polyline + distance)
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

  // Fetch road-snapped route coordinates via OSRM
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
        ? "#e11d48" // Rose-600 if stopped > 5 mins
        : isSelected
          ? "#0284c7" // Sky-600 if selected
          : "#10b981"; // Emerald-500 moving

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

    const createStopLogIcon = (durationMinutes: number) =>
      L.divIcon({
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #dc2626; color: white; font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 4px; margin-bottom: 2px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              Stopped ${durationMinutes}m
            </div>
            <div style="width: 26px; height: 26px; border-radius: 50%; background: #fef2f2; border: 2px solid #dc2626; box-shadow: 0 2px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; font-size: 12px;">
              🛑
            </div>
          </div>
        `,
        className: "",
        iconSize: [64, 42],
        iconAnchor: [32, 36],
        popupAnchor: [0, -32],
      });

    return {
      branchIcon,
      createRiderIcon,
      createOrderIcon,
      createStopLogIcon,
    };
  }, [imageUrl]);

  // Historical Polyline coordinates array
  const historyPolylineCoords = useMemo(() => {
    if (!isHistoryMode || !riderHistory?.locationPings) return [];
    return riderHistory.locationPings.map(
      (ping) => [ping.latitude, ping.longitude] as [number, number]
    );
  }, [isHistoryMode, riderHistory]);

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
              Select a rider from the top bar to view their historical route & stops.
            </span>
          ) : isHistoryLoading ? (
            <span className="text-xs font-bold text-slate-500 animate-pulse">
              Loading route history for {selectedRider.name}...
            </span>
          ) : (
            <div className="flex items-center gap-4 text-xs font-bold">
              <span>
                {selectedRider.name} •{" "}
                <span className="text-sky-600">
                  {riderHistory?.locationPings?.length || 0} GPS Points
                </span>
              </span>
              <span className="text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {riderHistory?.stopLogs?.length || 0} Stops Recorded
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

        {/* Smooth Camera Fly-To Controller */}
        <MapCameraController
          targetLat={focusLat}
          targetLng={focusLng}
          zoom={targetZoom}
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
                  <div className="p-1 space-y-1 min-w-37.5">
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
        {/* 3. HISTORY MODE: RENDER GPS TRAIL & STOP LOG PINS                 */}
        {/* ================================================================= */}
        {isHistoryMode && selectedRider && historyPolylineCoords.length > 0 && (
          <Polyline
            positions={historyPolylineCoords}
            pathOptions={{
              color: "#6366f1", // Indigo trail for history
              weight: 4,
              opacity: 0.85,
            }}
          />
        )}

        {isHistoryMode &&
          selectedRider &&
          riderHistory?.stopLogs?.map((stop) => {
            if (!icons) return null;
            return (
              <Marker
                key={stop.id}
                position={[stop.latitude, stop.longitude]}
                icon={icons.createStopLogIcon(stop.durationMinutes)}
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