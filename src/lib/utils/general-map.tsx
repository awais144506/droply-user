"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { MapComponentProps } from "./map-component";

// Dynamically import the map to prevent "window is not defined" SSR errors
const DynamicMap = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-62.5 bg-slate-50 flex flex-col items-center justify-center rounded-xl border border-slate-100">
      <MapPin className="h-6 w-6 text-slate-300 animate-pulse mb-2" />
      <span className="text-xs font-medium text-slate-400">Loading Map...</span>
    </div>
  ),
});

export default function GeneralMap(props: MapComponentProps) {
  return <DynamicMap {...props} />;
}