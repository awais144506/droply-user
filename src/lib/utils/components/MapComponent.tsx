/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface MapComponentProps {
  lat: number;
  lng: number;
  zoom?: number;
  popupText?: string;
  showCircle?: boolean;
  circleRadius?: number; // In meters
  height?: string; // Tailwind class like "h-64" or specific value like "400px"
}

export default function MapComponent({
  lat,
  lng,
  zoom = 14,
  popupText,
  showCircle = false,
  circleRadius = 1500, // Default 1.5km radius
  height = "h-full",
}: MapComponentProps) {
  const center: [number, number] = [lat, lng];

  return (
    <div className={`w-full rounded-xl overflow-hidden z-0 ${height}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ height: "100%", width: "100%", minHeight: "300px" }}
      >
        {/* Using standard OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={center}>
          {popupText && <Popup className="font-bold text-slate-800">{popupText}</Popup>}
        </Marker>

        {showCircle && (
          <Circle
            center={center}
            radius={circleRadius}
            pathOptions={{
              color: "#0ea5e9", // Sky 500
              fillColor: "#0ea5e9",
              fillOpacity: 0.1,
              weight: 2
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}