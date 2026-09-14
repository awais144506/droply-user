/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { NavUser } from "./nav-user";
import { SubscriptionIndicator } from "./subscription-indicator";
import { useRole } from "@/lib/hooks/use-role";


function LiveClock({ tier }: { tier: string }) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return <div className="hidden md:block w-32 h-8 animate-pulse bg-slate-50 rounded-lg mr-4"></div>;
  }

  const getTheme = () => {
    switch (tier?.toUpperCase()) {
      case "PLATINUM":
        return {
          time: "bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600",
          date: "text-indigo-400 font-bold"
        };
      case "GOLD":
        return {
          time: "text-amber-600",
          date: "text-amber-500/80 font-bold"
        };
      default: // SILVER
        return {
          time: "text-slate-800",
          date: "text-slate-500 font-semibold"
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="hidden md:flex flex-col items-end text-right mr-4 border-r border-slate-200 pr-4">
      <span className={`text-sm font-bold tracking-tight ${theme.time}`}>
        {time.toLocaleTimeString("en-PK", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}
      </span>
      <span className={`text-[10px] uppercase tracking-wider ${theme.date}`}>
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
  const roleData = useRole();
  return (
    <header className="flex z-50 h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4">
        <SubscriptionIndicator roleData={roleData} />
      </div>

      <div className="flex items-center">
        <LiveClock tier={roleData.userTier} />
        <NavUser roleData={roleData} />
      </div>
    </header>
  );
}