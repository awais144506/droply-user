/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Navigation } from "lucide-react";

// Dynamically import Leaflet modules with SSR disabled
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

type Props = {
    branchLat: number;
    branchLng: number;
    branchName: string;
    branchAddress: string;
    imageUrl?: string;
    selectedRider: any | null;
    onSelectRider: (rider: any) => void;
};

export const LiveTrackingMap = ({
    branchLat,
    branchLng,
    branchName,
    branchAddress,
    imageUrl,
    selectedRider,
}: Props) => {
    // Center map on selected rider if available, otherwise default to branch headquarters
    const centerLat = selectedRider?.currentLat ?? branchLat;
    const centerLng = selectedRider?.currentLng ?? branchLng;

    // 🔥 Safely initialize Leaflet's divIcon using useMemo so it only executes on the client side
    const branchIcon = useMemo(() => {
        if (typeof window === "undefined") return undefined;
        
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const L = require("leaflet");

        return L.divIcon({
            html: imageUrl
                ? `<div style="width: 42px; height: 42px; border-radius: 50%; border: 3px solid #059669; overflow: hidden; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                     <img src="${imageUrl}" alt="Branch" style="width: 100%; height: 100%; object-fit: cover;" />
                   </div>`
                : `<div style="width: 36px; height: 36px; border-radius: 50%; background: #059669; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
                     📍
                   </div>`,
            className: "",
            iconSize: imageUrl ? [42, 42] : [36, 36],
            iconAnchor: imageUrl ? [21, 21] : [18, 18],
            popupAnchor: [0, -22],
        });
    }, [imageUrl]);

    return (
        <div className="relative w-full h-full overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />

            <MapContainer
                center={[centerLat, centerLng]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Branch Headquarters Marker */}
                {branchIcon && (
                    <Marker position={[branchLat, branchLng]} icon={branchIcon}>
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
            </MapContainer>
        </div>
    );
};