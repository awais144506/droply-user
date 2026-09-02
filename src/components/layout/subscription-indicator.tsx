"use client";

import { Zap, Clock } from "lucide-react";
import Link from "next/link";

export function SubscriptionIndicator() {
  // TODO: Replace with your actual TanStack Query hook (e.g., useBranchSubscription)
  const subscription = {
    plan: "MONTHLY", // TRIAL, MONTHLY, YEARLY
    tierName: "Gold", 
    status: "ACTIVE", // ACTIVE, PAST_DUE
    autoRenew: true,
    currentPeriodEnd: "Oct 1, 2026",
    daysLeftInTrial: 5,
  };

  const isTrial = subscription.plan === "TRIAL";
  const isPastDue = subscription.status === "PAST_DUE";

  // Formats text to show "Gold • Monthly" or "Free Trial"
  const planDisplay = isTrial 
    ? "Free Trial" 
    : `${subscription.tierName} • ${subscription.plan}`;

  return (
    <Link 
      href="/admin/subscription"
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full mr-4 hover:bg-slate-100 transition-colors cursor-pointer group"
    >
      {isTrial ? (
        <Clock className="h-3.5 w-3.5 text-sky-500" />
      ) : isPastDue ? (
        <Zap className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
      ) : (
        <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
      )}
      
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider leading-none">
          {planDisplay}
        </span>
        <span className={`text-[9px] font-medium leading-none mt-1 ${isPastDue ? "text-rose-600 font-bold" : "text-slate-500"}`}>
          {isTrial 
            ? `${subscription.daysLeftInTrial} days left` 
            : isPastDue 
              ? "Payment Overdue" 
              : `Renews ${subscription.currentPeriodEnd}`
          }
        </span>
      </div>
    </Link>
  );
}