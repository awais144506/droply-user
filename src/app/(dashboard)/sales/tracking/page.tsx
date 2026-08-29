"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bike,
  MapPin,
  RefreshCw,
  Droplet,
  Wallet,
  Navigation,
  Search,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package,
  RotateCcw,
  ListOrdered,
  Radio,
  WifiOff,
  Battery,
  Phone,
} from "lucide-react";

export type RiderActivityStatus = "ON_RIDE" | "AT_CUSTOMER" | "IDLE_PLANT" | "OFFLINE";
export type StopDeliveryStatus = "DELIVERED" | "HEADING_NOW" | "PENDING" | "FAILED";

export interface RiderDeliveryStop {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  bottlesToDeliver: number;
  bottlesReturned: number;
  cashToCollect: number;
  cashCollected: number;
  status: StopDeliveryStatus;
  completedAt?: string;
  coordinates: [number, number];
}

export interface ActiveRiderTracker {
  id: string;
  riderName: string;
  phone: string;
  assignedZone: string;
  status: RiderActivityStatus;
  batteryLevel: number;
  speedKmH: number;
  currentStopName: string;
  currentAddress: string;
  distanceToStopFormatted: string;
  loadedBottles: number;
  deliveredBottles: number;
  emptyCollected: number;
  cashInBag: number;
  lastGpsUpdate: string;
  coordinates: [number, number]; // [lat, lng]
  destinationCoordinates?: [number, number];
  stops: RiderDeliveryStop[];
}

// Sahiwal Delivery Fleet Data (Including Live and Offline Riders)
const MOCK_RIDERS: ActiveRiderTracker[] = [
  {
    id: "r-1",
    riderName: "Majid Ali",
    phone: "+92 300 1234567",
    assignedZone: "Farid Town (Block Y & Z)",
    status: "ON_RIDE",
    batteryLevel: 88,
    speedKmH: 24,
    currentStopName: "Tariq Mahmood",
    currentAddress: "House 14, Block Y, Farid Town, Sahiwal",
    distanceToStopFormatted: "350m away",
    loadedBottles: 120,
    deliveredBottles: 42,
    emptyCollected: 40,
    cashInBag: 8400,
    lastGpsUpdate: "10s ago",
    coordinates: [30.672, 73.114],
    destinationCoordinates: [30.675, 73.118],
    stops: [
      {
        id: "stop-101",
        orderNumber: "ORD-9101",
        customerName: "Dr. Shahida Parveen",
        phone: "+92 333 1122334",
        address: "House 18, Block A, Main Blvd",
        bottlesToDeliver: 2,
        bottlesReturned: 2,
        cashToCollect: 400,
        cashCollected: 400,
        status: "DELIVERED",
        completedAt: "09:45 AM",
        coordinates: [30.671, 73.099],
      },
      {
        id: "stop-102",
        orderNumber: "ORD-9102",
        customerName: "Farhan Zafar",
        phone: "+92 312 3344556",
        address: "House 5, Street 2, Block Y",
        bottlesToDeliver: 4,
        bottlesReturned: 4,
        cashToCollect: 800,
        cashCollected: 800,
        status: "DELIVERED",
        completedAt: "10:30 AM",
        coordinates: [30.673, 73.112],
      },
      {
        id: "stop-103",
        orderNumber: "ORD-9103",
        customerName: "Tariq Mahmood",
        phone: "+92 321 4455667",
        address: "House 14, Block Y, Farid Town",
        bottlesToDeliver: 4,
        bottlesReturned: 4,
        cashToCollect: 800,
        cashCollected: 0,
        status: "HEADING_NOW",
        coordinates: [30.675, 73.118],
      },
      {
        id: "stop-104",
        orderNumber: "ORD-9104",
        customerName: "Al-Rehman Mart",
        phone: "+92 300 9988112",
        address: "Corner Shop 3, Block Z Market",
        bottlesToDeliver: 8,
        bottlesReturned: 8,
        cashToCollect: 1600,
        cashCollected: 0,
        status: "PENDING",
        coordinates: [30.677, 73.121],
      },
      {
        id: "stop-105",
        orderNumber: "ORD-9105",
        customerName: "Muhammad Bilal",
        phone: "+92 304 9988776",
        address: "House 112, Block Z, Street 9",
        bottlesToDeliver: 6,
        bottlesReturned: 6,
        cashToCollect: 1200,
        cashCollected: 0,
        status: "PENDING",
        coordinates: [30.679, 73.125],
      },
    ],
  },
  {
    id: "r-2",
    riderName: "Usman Tariq",
    phone: "+92 301 9876543",
    assignedZone: "Tariq Bin Ziad Colony",
    status: "AT_CUSTOMER",
    batteryLevel: 64,
    speedKmH: 0,
    currentStopName: "Al-Madina Sweets & Bakers",
    currentAddress: "Shop 12-14, Main Bazar, Sahiwal",
    distanceToStopFormatted: "Arrived at Drop",
    loadedBottles: 90,
    deliveredBottles: 50,
    emptyCollected: 48,
    cashInBag: 10000,
    lastGpsUpdate: "Just now",
    coordinates: [30.663, 73.104],
    destinationCoordinates: [30.662, 73.102],
    stops: [
      {
        id: "stop-201",
        orderNumber: "ORD-9106",
        customerName: "Gourmet Bakers Point",
        phone: "+92 321 8899001",
        address: "Main Circular Road",
        bottlesToDeliver: 15,
        bottlesReturned: 15,
        cashToCollect: 3000,
        cashCollected: 3000,
        status: "DELIVERED",
        completedAt: "10:15 AM",
        coordinates: [30.665, 73.107],
      },
      {
        id: "stop-202",
        orderNumber: "ORD-9107",
        customerName: "Al-Madina Sweets & Bakers",
        phone: "+92 300 7788990",
        address: "Shop 12-14, Main Bazar",
        bottlesToDeliver: 10,
        bottlesReturned: 10,
        cashToCollect: 2000,
        cashCollected: 0,
        status: "HEADING_NOW",
        coordinates: [30.662, 73.102],
      },
      {
        id: "stop-203",
        orderNumber: "ORD-9108",
        customerName: "Sahiwal Medical Clinic",
        phone: "+92 334 5566778",
        address: "Near Water Tank, Tariq Colony",
        bottlesToDeliver: 4,
        bottlesReturned: 4,
        cashToCollect: 800,
        cashCollected: 0,
        status: "PENDING",
        coordinates: [30.661, 73.098],
      },
    ],
  },
  {
    id: "r-3",
    riderName: "Bilal Hussain",
    phone: "+92 333 7788991",
    assignedZone: "High Street Commercial",
    status: "IDLE_PLANT",
    batteryLevel: 98,
    speedKmH: 0,
    currentStopName: "Sahiwal RO Plant Yard",
    currentAddress: "College Chowk, Sahiwal",
    distanceToStopFormatted: "Loading Stock",
    loadedBottles: 150,
    deliveredBottles: 0,
    emptyCollected: 0,
    cashInBag: 0,
    lastGpsUpdate: "2m ago",
    coordinates: [30.666, 73.109],
    destinationCoordinates: [30.6682, 73.1114],
    stops: [
      {
        id: "stop-301",
        orderNumber: "ORD-9109",
        customerName: "City Plaza Dispensary",
        phone: "+92 302 4433221",
        address: "Plaza 4, High Street",
        bottlesToDeliver: 10,
        bottlesReturned: 10,
        cashToCollect: 2000,
        cashCollected: 0,
        status: "PENDING",
        coordinates: [30.667, 73.113],
      },
    ],
  },
  {
    id: "r-4",
    riderName: "Kashif Niaz",
    phone: "+92 305 6677889",
    assignedZone: "Fateh Sher Colony",
    status: "OFFLINE",
    batteryLevel: 14,
    speedKmH: 0,
    currentStopName: "No Active Drop",
    currentAddress: "Last seen near Girls College Road",
    distanceToStopFormatted: "Offline / Disconnected",
    loadedBottles: 80,
    deliveredBottles: 12,
    emptyCollected: 12,
    cashInBag: 2400,
    lastGpsUpdate: "45 mins ago",
    coordinates: [30.669, 73.098],
    stops: [
      {
        id: "stop-401",
        orderNumber: "ORD-9110",
        customerName: "Fatima Welfare Trust",
        phone: "+92 331 2233445",
        address: "Fateh Sher Main Gate",
        bottlesToDeliver: 12,
        bottlesReturned: 12,
        cashToCollect: 2400,
        cashCollected: 2400,
        status: "DELIVERED",
        completedAt: "11:00 AM",
        coordinates: [30.67, 73.097],
      },
      {
        id: "stop-402",
        orderNumber: "ORD-9111",
        customerName: "Chaudhry Autos",
        phone: "+92 300 4455112",
        address: "Shop 8, Bypass Road",
        bottlesToDeliver: 6,
        bottlesReturned: 6,
        cashToCollect: 1200,
        cashCollected: 0,
        status: "PENDING",
        coordinates: [30.668, 73.095],
      },
    ],
  },
];

export default function LiveSalesTrackingPage() {
  const [riders] = useState<ActiveRiderTracker[]>(MOCK_RIDERS);
  const [selectedRiderId, setSelectedRiderId] = useState<string>("r-1");
  const [fleetFilter, setFleetFilter] = useState<"ALL" | "ONLINE" | "OFFLINE">("ALL");
  const [stopFilter, setStopFilter] = useState<"ALL" | "DELIVERED" | "PENDING">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Leaflet references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);

  const selectedRider =
    riders.find((r) => r.id === selectedRiderId) || riders[0];

  // Aggregate Fleet Metrics
  const onlineRiders = riders.filter((r) => r.status !== "OFFLINE");
  const offlineRiders = riders.filter((r) => r.status === "OFFLINE");
  const totalDeliveredToday = riders.reduce((sum, r) => sum + r.deliveredBottles, 0);
  const totalEmptiesRetrieved = riders.reduce((sum, r) => sum + r.emptyCollected, 0);
  const totalCashInBagTransit = riders.reduce((sum, r) => sum + r.cashInBag, 0);

  // Selected Rider Progress
  const deliveredStopsCount = selectedRider.stops.filter((s) => s.status === "DELIVERED").length;
  const pendingStopsCount = selectedRider.stops.filter((s) => s.status !== "DELIVERED").length;
  const totalStopsCount = selectedRider.stops.length;

  // Filtered Riders List
  const filteredRiders = riders.filter((r) => {
    const matchesSearch =
      r.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assignedZone.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (fleetFilter === "ONLINE" && r.status === "OFFLINE") return false;
    if (fleetFilter === "OFFLINE" && r.status !== "OFFLINE") return false;
    return true;
  });

  // Filtered Stops for Manifest
  const filteredStops = selectedRider.stops.filter((s) => {
    if (stopFilter === "DELIVERED" && s.status !== "DELIVERED") return false;
    if (stopFilter === "PENDING" && s.status === "DELIVERED") return false;
    return true;
  });

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      if (!mapInstanceRef.current && mapContainerRef.current && isMounted) {
        const map = L.map(mapContainerRef.current, {
          center: [30.6682, 73.1114],
          zoom: 14,
          zoomControl: false,
        });

        // Replace the CARTO tileLayer with OpenStreetMap standard tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: "topright" }).addTo(map);

        markersGroupRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Render Markers, Stops & Direction Line
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const updateMapLayers = async () => {
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;
      const markersGroup = markersGroupRef.current;

      if (!map || !markersGroup) return;

      markersGroup.clearLayers();
      if (routeLineRef.current) {
        routeLineRef.current.remove();
        routeLineRef.current = null;
      }

      // Plot All Stops of Selected Rider
      selectedRider.stops.forEach((stop, index) => {
        const isDelivered = stop.status === "DELIVERED";
        const isHeading = stop.status === "HEADING_NOW";

        const markerColor = isDelivered
          ? "#16a34a"
          : isHeading
            ? "#0284c7"
            : "#64748b";

        const stopIconHtml = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="
              background: ${markerColor};
              color: #ffffff;
              font-size: 10px;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 6px;
              white-space: nowrap;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
              border: 1.5px solid #ffffff;
            ">
              #${index + 1} ${isDelivered ? "✓" : isHeading ? "🎯" : "•"} ${stop.customerName.split(" ")[0]}
            </div>
            <div style="
              width: 9px;
              height: 9px;
              background: ${markerColor};
              border: 2px solid #ffffff;
              border-radius: 50%;
              margin-top: 2px;
            "></div>
          </div>
        `;

        const stopIcon = L.divIcon({
          html: stopIconHtml,
          className: "",
          iconSize: [0, 0],
        });

        const stopMarker = L.marker(stop.coordinates, { icon: stopIcon });
        markersGroup.addLayer(stopMarker);
      });

      // Plot Selected Rider's Live / Last Seen GPS Pin
      const isRiderOffline = selectedRider.status === "OFFLINE";
      const pinBackground = isRiderOffline ? "#94a3b8" : "#0f172a";
      const ringColor = isRiderOffline ? "#cbd5e1" : "#38bdf8";

      const riderIconHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
          <div style="
            background: ${pinBackground};
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 7px;
            white-space: nowrap;
            box-shadow: 0 6px 10px -1px rgba(0,0,0,0.3);
            border: 2px solid ${ringColor};
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>🛵 ${selectedRider.riderName} ${isRiderOffline ? "(Offline)" : ""}</span>
          </div>
          <div style="
            width: 12px;
            height: 12px;
            background: ${ringColor};
            border: 2.5px solid #ffffff;
            border-radius: 50%;
            margin-top: 2px;
          "></div>
        </div>
      `;

      const riderMarker = L.marker(selectedRider.coordinates, {
        icon: L.divIcon({ html: riderIconHtml, className: "", iconSize: [0, 0] }),
        zIndexOffset: 1000,
      });
      markersGroup.addLayer(riderMarker);

      // Draw Heading Polyline if Active
      if (!isRiderOffline && selectedRider.destinationCoordinates) {
        routeLineRef.current = L.polyline(
          [selectedRider.coordinates, selectedRider.destinationCoordinates],
          {
            color: "#0284c7",
            weight: 4,
            opacity: 0.85,
            dashArray: "6, 8",
          }
        ).addTo(map);
      }

      // Fit View
      const allCoordinates = [
        selectedRider.coordinates,
        ...selectedRider.stops.map((s) => s.coordinates),
      ];
      const bounds = L.latLngBounds(allCoordinates);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    };

    updateMapLayers();
  }, [selectedRiderId, selectedRider]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Live Fleet Dispatch & Tracking
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time GPS Active</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time rider GPS coordinates, online/offline status, bottle dispatches, and transit cash.
          </p>
        </div>

        <button
          onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          className={`h-9 px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs ${isAutoRefresh
              ? "bg-sky-50 border-sky-200 text-sky-700"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isAutoRefresh ? "animate-spin" : ""}`} />
          <span>{isAutoRefresh ? "Auto Syncing (3s)" : "Paused"}</span>
        </button>
      </div>

      {/* Primary KPI Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Fleet Status & Offline Count */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Fleet Status
            </span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Bike className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-slate-900">{onlineRiders.length} Online</p>
              {offlineRiders.length > 0 && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60 flex items-center gap-1">
                  <WifiOff className="h-3 w-3" />
                  <span>{offlineRiders.length} Offline</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {riders.length} Total registered sector riders
            </p>
          </div>
        </div>

        {/* Total Bottles Dropped */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Bottles Dropped Today
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Droplet className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-700 font-mono">
              {totalDeliveredToday}{" "}
              <span className="text-xs font-normal text-slate-400 font-sans">Full 19L</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalEmptiesRetrieved} empties returned to plant
            </p>
          </div>
        </div>

        {/* Live Cash in Bags */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Live Cash in Bag (Transit)
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600 font-mono">
              Rs {totalCashInBagTransit.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Active money in fleet possession</p>
          </div>
        </div>

        {/* Active Route Completion */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Route Execution Rate
            </span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Navigation className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {deliveredStopsCount}/{totalStopsCount} Drops
            </p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{
                  width: `${Math.round((deliveredStopsCount / totalStopsCount) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Split Tracking Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Interactive Leaflet Map */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-200/90 shadow-sm min-h-[480px] relative overflow-hidden flex flex-col justify-between p-4">
          <div
            ref={mapContainerRef}
            className="absolute inset-0 z-0 h-full w-full"
          />

          {/* Top Floating Sector Badge */}
          <div className="relative z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs self-start">
            <div className="flex items-center gap-2">
              <Radio
                className={`h-4 w-4 ${selectedRider.status === "OFFLINE" ? "text-slate-400" : "text-sky-600 animate-pulse"
                  }`}
              />
              <span className="font-bold text-slate-900">
                {selectedRider.riderName} • {selectedRider.assignedZone}
              </span>
            </div>
          </div>

          {/* Bottom Floating Active Destination HUD */}
          <div className="relative z-10 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-white space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-9 w-9 rounded-xl font-bold text-xs flex items-center justify-center ${selectedRider.status === "OFFLINE"
                      ? "bg-slate-800 border border-slate-700 text-slate-400"
                      : "bg-sky-500/20 border border-sky-500/40 text-sky-400"
                    }`}
                >
                  {selectedRider.riderName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedRider.riderName}</h3>
                  <p className="text-[11px] text-slate-400">{selectedRider.assignedZone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-300">
                  {deliveredStopsCount}/{totalStopsCount} Delivered
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${selectedRider.status === "OFFLINE"
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                      : selectedRider.status === "ON_RIDE"
                        ? "bg-sky-500/20 text-sky-400 border-sky-500/40"
                        : selectedRider.status === "AT_CUSTOMER"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    }`}
                >
                  {selectedRider.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Target Drop Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Drop</span>
                <span className="font-bold text-emerald-400 truncate block mt-0.5">
                  {selectedRider.currentStopName}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">GPS Status</span>
                <span className="font-bold text-sky-400 block mt-0.5">
                  {selectedRider.distanceToStopFormatted}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cash in Bag</span>
                <span className="font-bold text-amber-400 font-mono block mt-0.5">
                  Rs {selectedRider.cashInBag.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Device Power</span>
                <span className="font-bold text-emerald-400 font-mono block mt-0.5">
                  {selectedRider.batteryLevel}% Battery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Sidebar with Online/Offline Filtering */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Fleet Status ({riders.length})
              </h3>

              {/* Online / Offline Filter */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold text-slate-600">
                <button
                  onClick={() => setFleetFilter("ALL")}
                  className={`px-2 py-0.5 rounded ${fleetFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs" : ""}`}
                >
                  All ({riders.length})
                </button>
                <button
                  onClick={() => setFleetFilter("ONLINE")}
                  className={`px-2 py-0.5 rounded ${fleetFilter === "ONLINE" ? "bg-white text-emerald-700 shadow-2xs" : ""}`}
                >
                  Online ({onlineRiders.length})
                </button>
                <button
                  onClick={() => setFleetFilter("OFFLINE")}
                  className={`px-2 py-0.5 rounded ${fleetFilter === "OFFLINE" ? "bg-white text-rose-700 shadow-2xs" : ""}`}
                >
                  Offline ({offlineRiders.length})
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter rider or zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            {/* Rider Cards Feed */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {filteredRiders.map((r) => {
                const isSelected = r.id === selectedRiderId;
                const isOffline = r.status === "OFFLINE";
                const completedCount = r.stops.filter((s) => s.status === "DELIVERED").length;
                const progressPct = Math.round((completedCount / r.stops.length) * 100);

                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRiderId(r.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${isSelected
                        ? "bg-sky-50/70 border-sky-500 shadow-2xs"
                        : isOffline
                          ? "bg-slate-50/60 border-slate-200 opacity-75"
                          : "bg-white border-slate-200/90 hover:border-slate-300"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-8 w-8 rounded-xl font-bold text-xs flex items-center justify-center ${isOffline ? "bg-slate-200 text-slate-500" : "bg-slate-100 text-slate-700"
                            }`}
                        >
                          {r.riderName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-900">{r.riderName}</p>
                            {isOffline && (
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">{r.assignedZone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${r.batteryLevel < 20
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-slate-100 text-slate-600"
                            }`}
                        >
                          {r.batteryLevel}%
                        </span>
                        <ChevronRight className={`h-4 w-4 ${isSelected ? "text-sky-600" : "text-slate-300"}`} />
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">
                        {completedCount}/{r.stops.length} Delivered ({progressPct}%)
                      </span>
                      <span className="text-amber-600 font-bold font-mono">
                        Rs {r.cashInBag.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isOffline ? "bg-slate-400" : "bg-sky-600"}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Rider's Order Manifest */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Manifest Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
              <ListOrdered className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  {selectedRider.riderName}'s Shift Manifest
                </h2>
                <span className="text-[11px] font-semibold text-slate-500">
                  ({selectedRider.stops.length} Total Drops)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Full delivery progress, returnable bottle exchanges, and payment collection status.
              </p>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-medium text-slate-600 self-start md:self-auto">
            <button
              onClick={() => setStopFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${stopFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs font-semibold" : ""
                }`}
            >
              All Stops ({totalStopsCount})
            </button>
            <button
              onClick={() => setStopFilter("DELIVERED")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${stopFilter === "DELIVERED" ? "bg-white text-emerald-700 shadow-2xs font-semibold" : ""
                }`}
            >
              Delivered ({deliveredStopsCount})
            </button>
            <button
              onClick={() => setStopFilter("PENDING")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${stopFilter === "PENDING" ? "bg-white text-sky-700 shadow-2xs font-semibold" : ""
                }`}
            >
              Pending ({pendingStopsCount})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Order & Customer</th>
                <th className="py-3 px-4">Delivery Location</th>
                <th className="py-3 px-4 text-center">Bottles (Delivered / Return)</th>
                <th className="py-3 px-4 text-right">Cash Collection</th>
                <th className="py-3 px-4 text-center">Drop Status</th>
                <th className="py-3 px-4 text-right">Execution Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStops.map((stop, index) => {
                const isDelivered = stop.status === "DELIVERED";
                const isHeadingNow = stop.status === "HEADING_NOW";

                return (
                  <tr
                    key={stop.id}
                    className={`transition-colors ${isHeadingNow
                        ? "bg-sky-50/40"
                        : isDelivered
                          ? "hover:bg-slate-50/60"
                          : "hover:bg-slate-50/80"
                      }`}
                  >
                    <td className="py-3 px-4 text-center font-bold text-slate-400 font-mono">
                      {index + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{stop.customerName}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span>{stop.orderNumber}</span>
                        <span>•</span>
                        <span>{stop.phone}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{stop.address}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-mono">
                      <span className="font-bold text-sky-600">{stop.bottlesToDeliver} Full</span>
                      <span className="text-slate-300 mx-1.5">/</span>
                      <span className="font-bold text-emerald-600">{stop.bottlesReturned} Empty</span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono">
                      {isDelivered ? (
                        <div>
                          <span className="font-bold text-emerald-700">
                            Rs {stop.cashCollected.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 block">Collected</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-slate-900">
                            Rs {stop.cashToCollect.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-amber-600 block">Target Cash</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {isDelivered ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Delivered</span>
                        </span>
                      ) : isHeadingNow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 animate-pulse">
                          <Navigation className="h-3 w-3" />
                          <span>Heading Now</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <Clock className="h-3 w-3" />
                          <span>Pending Drop</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {stop.completedAt ? (
                        <span className="text-emerald-700 font-medium">{stop.completedAt}</span>
                      ) : isHeadingNow ? (
                        <span className="text-sky-600 font-bold text-[11px]">In Progress</span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Queued</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}