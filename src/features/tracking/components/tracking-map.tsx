"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Rider } from "../api/use-tracking";
import { Navigation } from "lucide-react";

// --- HARCODED PLANT LOCATION (To be fetched from DB later) ---
const PLANT_COORDS: [number, number] = [30.6750, 73.1025]; 

// 1. Pointy Tail Bike Icon (Rider) - Blue
const bikeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>`;
const riderIcon = new L.DivIcon({
  html: `<div style="background: white; border: 2.5px solid #0284c7; border-radius: 50% 50% 50% 0; padding: 4px; box-shadow: 2px 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; transform: rotate(-45deg);">
          <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">${bikeSvg}</div>
         </div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36], 
  popupAnchor: [0, -36]
});

// 2. Circular Home Icon (Customer Destination) - Red
const homeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const destIcon = new L.DivIcon({
  html: `<div style="background: white; border: 2.5px solid #e11d48; border-radius: 50%; padding: 5px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">${homeSvg}</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20]
});

// 3. Factory Icon (Main Plant) - Emerald Green
const plantSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>`;
const plantIcon = new L.DivIcon({
  html: `<div style="background: white; border: 2.5px solid #059669; border-radius: 8px; padding: 5px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">${plantSvg}</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20]
});


export default function TrackingMap({ rider, isHistoryMode }: { rider: Rider | null, isHistoryMode: boolean }) {
  const [roadPath, setRoadPath] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!rider) {
      setRoadPath([]);
      return;
    }

    const fetchRoadRoute = async () => {
      const headingStop = rider.stops.find(s => s.status === "HEADING_NOW");
      try {
        let coordsString = "";

        if (!isHistoryMode && headingStop) {
          coordsString = `${rider.currentLng},${rider.currentLat};${headingStop.lng},${headingStop.lat}`;
        } else if (isHistoryMode && rider.routeHistory.length > 1) {
          coordsString = rider.routeHistory.map(pt => `${pt[1]},${pt[0]}`).join(";");
        } else {
          setRoadPath([]);
          return;
        }

        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`);
        const data = await res.json();

        if (data.routes && data.routes[0]) {
          const decodedPath = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
          setRoadPath(decodedPath);
        }
      } catch (error) {
        console.error("OSRM Route Failed. Falling back.", error);
        if (!isHistoryMode && headingStop) {
          setRoadPath([[rider.currentLat, rider.currentLng], [headingStop.lat, headingStop.lng]]);
        } else if (isHistoryMode) {
          setRoadPath(rider.routeHistory);
        }
      }
    };

    fetchRoadRoute();
  }, [rider, isHistoryMode]);

  if (!rider) {
    return (
      <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400">
        <Navigation className="h-10 w-10 opacity-20" />
      </div>
    );
  }

  const headingStop = rider.stops.find(s => s.status === "HEADING_NOW");

  return (
    <div className="flex-1 rounded-2xl border border-slate-200 overflow-hidden relative z-0">
      <MapContainer 
        center={[rider.currentLat, rider.currentLng]} 
        zoom={14} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Main Plant Marker */}
        <Marker position={PLANT_COORDS} icon={plantIcon}>
          <Popup>
            <strong>Main Plant</strong><br />
            Dispatch Center
          </Popup>
        </Marker>

        {/* Rider Marker (Pointy Tail Bike) */}
        <Marker position={[rider.currentLat, rider.currentLng]} icon={riderIcon}>
          <Popup>
            <strong>{rider.name}</strong><br />
            {isHistoryMode ? "Last Known Location" : "Current Location"}
          </Popup>
        </Marker>

        {/* Live Target Marker & Road Snap Polyline */}
        {!isHistoryMode && headingStop && (
          <>
            <Marker position={[headingStop.lat, headingStop.lng]} icon={destIcon}>
              <Popup><strong>Heading Next:</strong><br/>{headingStop.customerName}</Popup>
            </Marker>
            
            {roadPath.length > 0 && (
              <Polyline 
                positions={roadPath} 
                pathOptions={{ color: "#0284c7", dashArray: "8, 10", weight: 4 }}
              />
            )}
          </>
        )}

        {/* Historical Full Route Polyline */}
        {isHistoryMode && roadPath.length > 0 && (
          <Polyline 
            positions={roadPath} 
            pathOptions={{ color: "#4f46e5", weight: 4, opacity: 0.8 }}
          />
        )}
      </MapContainer>
    </div>
  );
}