/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { NavUser } from "./nav-user";
import Image from "next/image";
import { SubscriptionIndicator } from "./subscription-indicator";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { useRole } from "@/lib/hooks/use-role";
import { Building2 } from "lucide-react"; // Fallback icon if branch image is missing

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
  const envMode = process.env.NEXT_PUBLIC_NODE_ENV;
  const roleData = useRole();
  const { data: branchData, isLoading } = useBranchSettings(roleData.branchId);

  // Extract branch name and image safely from branchData (adjust property paths if your API shape differs)
  const branchName = branchData?.name;
  const branchImageUrl = branchData?.logoUrl

  return (
    <header className="relative z-2000 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 top-0 shadow-sm">
      {/* Left side: Env mode & Subscription Indicator */}
      <div className="flex items-center gap-3 z-10">
        {envMode !== 'production' && (
          <div className="flex items-center gap-2">
            {envMode === "development" && (
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                Dev
              </span>
            )}
            {envMode === "staging" && (
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wide">
                Staging
              </span>
            )}
          </div>
        )}
        <SubscriptionIndicator branchId={roleData.branchId} />
      </div>

      {/* Center: Branch Name & Image (Absolutely centered so it never gets pushed off) */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 max-w-[40%] truncate px-2">
        {isLoading ? (
          <div className="h-6 w-32 animate-pulse bg-slate-100 rounded-md" />
        ) : (
          <>
            {branchImageUrl ? (
              <Image
                src={branchImageUrl}
                alt={branchName || "Branch Logo"}
                width={40}
                height={40}
                className="rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
                <Building2 className="h-4 w-4" />
              </div>
            )}
            <span className="text-lg font-bold text-slate-800 tracking-tight truncate">
              {branchName || "Droply Branch"}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center z-10">
        <LiveClock tier={roleData.userTier} />
        <NavUser />
      </div>
    </header>
  );
}