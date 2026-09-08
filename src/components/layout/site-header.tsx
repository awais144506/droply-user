/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { NavUser } from "./nav-user";
import { SubscriptionIndicator } from "./subscription-indicator";

function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    // Placeholder to prevent layout shift before hydration
    return <div className="hidden md:block w-32 h-8 animate-pulse bg-slate-50 rounded-lg mr-4"></div>;
  }

  return (
    <div className="hidden md:flex flex-col items-end text-right mr-4 border-r border-slate-200 pr-4">
      <span className="text-sm font-bold text-slate-800 tracking-tight">
        {time.toLocaleTimeString("en-PK", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}
      </span>
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
        {time.toLocaleDateString("en-PK", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric"
        })}
      </span>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="flex z-500 h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 z-20 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4">
        <SubscriptionIndicator />
      </div>
    
      <div className="flex items-center">
        <LiveClock />
        <NavUser />
      </div>
    </header>
  );
}