"use client";

import { Zap, Clock, CalendarDays } from "lucide-react";
import Link from "next/link";

export function SubscriptionIndicator() {
  // TODO: Replace with your actual TanStack Query hook (e.g., useBranchSubscription)
  const subscription = {
    plan: "MONTHLY", // TRIAL, MONTHLY, YEARLY
    tierName: "GOLD", 
    status: "ACTIVE", // ACTIVE, PAST_DUE
    autoRenew: true,
    currentPeriodEnd: "Oct 1, 2026",
    daysLeft: 23, 
    daysLeftInTrial: 5,
  };

  const isTrial = subscription.plan === "TRIAL";
  const isPastDue = subscription.status === "PAST_DUE";

  return (
    <Link 
      href="/admin/subscription"
      className="hidden sm:flex items-center gap-3 px-3.5 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-sky-200 transition-all cursor-pointer group"
    >
      {/* Dynamic Icon Badge */}
      <div className={`p-1.5 rounded-lg transition-colors ${
        isTrial ? "bg-sky-50 text-sky-600" 
        : isPastDue ? "bg-rose-50 text-rose-600" 
        : "bg-amber-50 text-amber-500"
      }`}>
        {isTrial ? (
          <Clock className="h-4 w-4" />
        ) : isPastDue ? (
          <Zap className="h-4 w-4 fill-rose-600" />
        ) : (
          <Zap className="h-4 w-4 fill-amber-500 group-hover:scale-110 transition-transform" />
        )}
      </div>
      
      <div className="flex flex-col justify-center">
        {/* Top Row: Tier, Cycle, and Countdown Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-900 tracking-wide uppercase">
            {subscription.tierName} <span className="text-slate-300 mx-0.5 font-normal">|</span> {subscription.plan}
          </span>
          
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wide uppercase ${
            isTrial ? "bg-sky-100 text-sky-700" 
            : isPastDue ? "bg-rose-100 text-rose-700 animate-pulse"
            : "bg-emerald-100 text-emerald-700"
          }`}>
            {isTrial 
              ? `${subscription.daysLeftInTrial} Days Left` 
              : isPastDue 
                ? "Overdue" 
                : `${subscription.daysLeft} Days Left`
            }
          </span>
        </div>
        
        {/* Bottom Row: Exact Renewal Date */}
        <span className={`text-[10px] font-medium mt-0.5 flex items-center gap-1 ${isPastDue ? "text-rose-600" : "text-slate-500"}`}>
          <CalendarDays className="h-3 w-3 opacity-70" />
          {isTrial ? "Trial ends:" : "Renews:"} <span className="font-semibold text-slate-700">{subscription.currentPeriodEnd}</span>
        </span>
      </div>
    </Link>
  );
}