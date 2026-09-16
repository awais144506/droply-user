/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react"; 

export function NetworkIndicator() {
    const [isOnline, setIsOnline] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsOnline(navigator.onLine);
        // Listeners for network changes
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);


    if (!mounted) return null;
    return isOnline ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1 mr-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full shadow-sm transition-all duration-300">
            <Wifi className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Online</span>
        </div>
    ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 mr-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-full animate-pulse shadow-sm transition-all duration-300">
            <WifiOff className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Offline Mode</span>
        </div>
    );
}