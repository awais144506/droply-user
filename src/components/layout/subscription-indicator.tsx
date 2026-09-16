/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Zap, Clock, CalendarDays, AlertTriangle, Sparkles } from "lucide-react";
import Link from "next/link";
export function SubscriptionIndicator({ roleData }: { roleData: any }) {
  const { userTier, tierCycle, userStatus, renewDate, isLoading } = roleData;

  if (isLoading) {
    return (
      <div className="hidden sm:flex items-center gap-3 px-3.5 py-2 bg-white border border-slate-100 rounded-xl shadow-sm w-45 animate-pulse">
        <div className="h-7 w-7 bg-slate-200 rounded-lg shrink-0"></div>
        <div className="flex flex-col gap-1.5 w-full">
          <div className="h-2.5 bg-slate-200 rounded w-full"></div>
          <div className="h-2 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }
  const gracePeriod = parseInt(process.env.NEXT_PUBLIC_GRACE_PERIOD || "3", 10);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = renewDate ? new Date(renewDate as string) : new Date();
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate.getTime() - today.getTime();
  const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const isHardSuspended = daysLeft <= -gracePeriod;
  const isTrial = tierCycle === "TRIAL";
  const isExpired = daysLeft <= 0;

  const isSuspended = userStatus === "SUSPENDED" || (isHardSuspended && !isTrial);
  const isPastDue = userStatus === "PAST_DUE" || (isExpired && !isTrial && !isSuspended);
  const isEndingSoon = daysLeft <= gracePeriod && daysLeft > 0
  const isCritical = isSuspended || (isTrial && isExpired);
  const isWarning = (!isSuspended && isPastDue) || (isTrial && isEndingSoon);

  const formattedDate = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getTierTheme = () => {
    // 1. Critical Danger State (Red)
    if (isCritical) {
      return {
        wrapper: "bg-white border-rose-200 hover:border-rose-300",
        iconBox: "bg-rose-50 text-rose-600",
        icon: <Zap className="h-4 w-4 fill-rose-600" />,
        tierText: "text-slate-900",
        pill: "bg-rose-100 text-rose-700 animate-pulse border border-rose-200",
        dateText: "text-rose-600 font-semibold",
      };
    }

    // 2. Warning / Grace Period State (Amber)
    if (isWarning) {
      return {
        wrapper: "bg-white border-amber-300 hover:border-amber-400",
        iconBox: "bg-amber-50 text-amber-600",
        icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
        tierText: "text-slate-900",
        pill: "bg-amber-100 text-amber-700 animate-pulse border border-amber-200",
        dateText: "text-amber-600 font-semibold",
      };
    }

    // 3. Trial State
    if (isTrial) {
      return {
        wrapper: "bg-white border-sky-200 hover:border-sky-300",
        iconBox: "bg-sky-50 text-sky-600",
        icon: <Clock className="h-4 w-4" />,
        tierText: "text-slate-900",
        pill: "bg-sky-100 text-sky-700",
        dateText: "text-slate-500",
      };
    }

    // 4. Active Premium States
    switch (userTier?.toUpperCase()) {
      case "PLATINUM":
        return {
          wrapper: "bg-slate-900 border-slate-800 hover:border-indigo-500 shadow-md shadow-indigo-500/10",
          iconBox: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-inner",
          icon: <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />,
          tierText: "bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400",
          pill: "bg-white/10 text-indigo-100 border border-white/10 backdrop-blur-sm",
          dateText: "text-slate-400",
        };
      case "GOLD":
        return {
          wrapper: "bg-gradient-to-b from-amber-50/50 to-white border-amber-200 hover:border-amber-400 shadow-sm shadow-amber-500/5",
          iconBox: "bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-inner",
          icon: <Zap className="h-4 w-4 fill-white group-hover:scale-110 transition-transform" />,
          tierText: "text-amber-700",
          pill: "bg-amber-100/80 text-amber-800 border border-amber-200/50",
          dateText: "text-slate-500",
        };
      default: // SILVER
        return {
          wrapper: "bg-white border-slate-200 hover:border-slate-300",
          iconBox: "bg-slate-100 text-slate-500",
          icon: <Zap className="h-4 w-4 fill-slate-400 group-hover:scale-110 transition-transform" />,
          tierText: "text-slate-700",
          pill: "bg-slate-100 text-slate-600 border border-slate-200",
          dateText: "text-slate-500",
        };
    }
  };

  const theme = getTierTheme();

  return (
    <div className="flex items-center gap-3">
      {/* Main Indicator Card */}
      <Link
        href="/admin/subscription"
        className={`hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-300 cursor-pointer group border ${theme.wrapper}`}
      >
        <div className={`p-1.5 rounded-lg transition-all duration-300 ${theme.iconBox}`}>
          {theme.icon}
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-extrabold tracking-wide uppercase ${theme.tierText}`}>
              {userTier} <span className="opacity-40 mx-0.5 font-normal">|</span> {tierCycle}
            </span>

            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wide uppercase ${theme.pill}`}>
              {isSuspended ? "Suspended"
                : (isTrial && isExpired) ? "Expired"
                  : isPastDue ? "Grace Period"
                    : `${daysLeft} Days Left`
              }
            </span>
          </div>

          <span className={`text-[10px] flex items-center gap-1 mt-0.5 ${theme.dateText}`}>
            <CalendarDays className="h-3 w-3 opacity-70" />
            {isTrial ? "Trial ends:" : "Renew Date:"}
            <span className={userTier?.toUpperCase() === "PLATINUM" && !isCritical && !isWarning ? "text-slate-200" : "font-semibold"}>
              {formattedDate}
            </span>
          </span>
        </div>
      </Link>

      {/* Urgent Action Banner - Adapts color based on severity */}
      {(isCritical || isWarning) && (
        <div className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl shadow-sm animate-pulse border ${isCritical ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"
          }`}>
          <AlertTriangle className={`h-4 w-4 ${isCritical ? "text-rose-600" : "text-amber-600"}`} />
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold uppercase leading-none ${isCritical ? "text-rose-700" : "text-amber-700"}`}>
              {isSuspended ? "Account Suspended"
                : (isTrial && isExpired) ? "Trial Expired"
                  : isPastDue ? "Payment Overdue"
                    : "Trial Ending Soon"}
            </span>
            <span className={`text-[9px] font-medium mt-0.5 ${isCritical ? "text-rose-600" : "text-amber-600"}`}>
              {isCritical ? "Update billing to restore access" : "Update billing to avoid disruption"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}