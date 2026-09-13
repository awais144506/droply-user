"use client";

import { Zap, Clock, CalendarDays, AlertTriangle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRole } from "@/hooks/use-role";

export function SubscriptionIndicator() {
  const { userTier, tierCycle, userStatus, renewDate, isLoading } = useRole();

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

  const endDate = renewDate ? new Date(renewDate as string) : new Date();
  const today = new Date();

  const diffTime = endDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isTrial = tierCycle === "TRIAL";
  const isExpired = daysLeft < 0;
  const isPastDue = userStatus === "PAST_DUE" || (daysLeft < 0 && !isTrial);
  const isSuspended = userStatus === "SUSPENDED";
  const isEndingSoon = daysLeft <= 3 && daysLeft >= 0;
  const hasIssue = isPastDue || isSuspended || isExpired;

  const formattedDate = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // 🔥 Tier-Specific Styling Configuration
  const getTierTheme = () => {
    // If there's an account issue, override premium styling with danger styling
    if (hasIssue) {
      return {
        wrapper: "bg-white border-rose-200 hover:border-rose-300",
        iconBox: "bg-rose-50 text-rose-600",
        icon: <Zap className="h-4 w-4 fill-rose-600" />,
        tierText: "text-slate-900",
        pill: "bg-rose-100 text-rose-700 animate-pulse border border-rose-200",
        dateText: "text-rose-600 font-semibold",
      };
    }

    if (isTrial) {
      return {
        wrapper: "bg-white border-sky-200 hover:border-sky-300",
        iconBox: "bg-sky-50 text-sky-600",
        icon: <Clock className="h-4 w-4" />,
        tierText: "text-slate-900",
        pill: isEndingSoon ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700",
        dateText: "text-slate-500",
      };
    }

    // Active Premium States
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
      {/* Urgent Action Banner */}


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
                  : isPastDue ? "Overdue"
                    : `${daysLeft} Days Left`
              }
            </span>
          </div>

          <span className={`text-[10px] flex items-center gap-1 mt-0.5 ${theme.dateText}`}>
            <CalendarDays className="h-3 w-3 opacity-70" />
            {isTrial ? "Trial ends:" : "Renew Date:"}
            <span className={userTier?.toUpperCase() === "PLATINUM" && !hasIssue ? "text-slate-200" : "text-slate-700 font-semibold"}>
              {formattedDate}
            </span>
          </span>
        </div>
      </Link>
      {(hasIssue || (isTrial && isEndingSoon)) && (
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl shadow-sm animate-pulse">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-rose-700 uppercase leading-none">
              {isSuspended ? "Account Suspended"
                : (isTrial && isExpired) ? "Trial Expired"
                  : isPastDue ? "Payment Overdue"
                    : "Trial Ending Soon"}
            </span>
            <span className="text-[9px] font-medium text-rose-600 mt-0.5">
              Update billing to avoid disruption
            </span>
          </div>
        </div>
      )}
    </div>
  );
}