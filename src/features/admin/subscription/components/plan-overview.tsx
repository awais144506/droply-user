/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Crown, AlertTriangle, ArrowUpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlanOverview({ roleData }: { roleData: any }) {
  const { userTier, tierCycle, userStatus, renewDate, isLoading } = roleData;

  if (isLoading) {
    return <div className="h-40 w-full bg-slate-50 border border-slate-100 rounded-2xl animate-pulse"></div>;
  }

  const isTrial = tierCycle === "TRIAL";
  const isPastDue = userStatus === "PAST_DUE";

  // 1. Dynamic Tier Themes
  const themes: Record<string, any> = {
    SILVER: {
      border: "border-slate-300",
      iconBg: "bg-slate-100",
      iconText: "text-slate-500",
      progressFill: "bg-slate-400",
    },
    GOLD: {
      border: "border-amber-400",
      iconBg: "bg-amber-100",
      iconText: "text-amber-500",
      progressFill: "bg-amber-400",
    },
    PLATINUM: {
      border: "border-slate-800",
      iconBg: "bg-slate-900",
      iconText: "text-slate-100",
      progressFill: "bg-slate-800",
    }
  };

  const theme = themes[userTier?.toUpperCase()] || themes.SILVER;

  // 2. Date & Progress Calculations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = renewDate ? new Date(renewDate) : new Date();
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const maxGraceDays = parseInt(process.env.NEXT_PUBLIC_GRACE_PERIOD || "3", 10); 
  let cycleDays = tierCycle === "MONTHLY" ? 30 : tierCycle === "YEARLY" ? 365 : 7;
  if (isTrial) cycleDays = 7;

  let progressPercent = 0;
  let statusText = "";
  let progressColor = theme.progressFill;
  
  if (isTrial) {
    // Handling Free Trial Logic
    const daysUsed = Math.max(0, cycleDays - diffDays);
    progressPercent = Math.min(100, (daysUsed / cycleDays) * 100);
    progressColor = "bg-indigo-500";
    statusText = `${Math.max(0, diffDays)} days remaining in free trial`;
  } else if (isPastDue || diffDays < 0) {
    // Handling Grace Period Logic
    const overdueDays = Math.abs(diffDays);
    const graceLeft = Math.max(0, maxGraceDays - overdueDays);
    
    progressPercent = Math.min(100, (overdueDays / maxGraceDays) * 100);
    progressColor = "bg-rose-500";
    statusText = graceLeft > 0 ? `${graceLeft} days left in grace period` : "Grace period expired";
  } else {
    // Handling Active Cycle Logic
    const daysUsed = Math.max(0, cycleDays - diffDays);
    
    progressPercent = Math.min(100, (daysUsed / cycleDays) * 100);
    statusText = `${Math.max(0, diffDays)} days remaining in current cycle`;
  }

  // 3. UI Overrides for States
  let containerBorder = theme.border;
  let containerBg = "bg-white";

  if (isPastDue || diffDays < 0) {
    containerBorder = "border-rose-400";
    containerBg = "bg-rose-50/30";
  } else if (isTrial) {
    containerBorder = "border-indigo-400";
    containerBg = "bg-indigo-50/40";
  }

  return (
    <div className={`p-6 rounded-2xl border-2 shadow-sm flex flex-col gap-6 transition-colors duration-300 ${containerBorder} ${containerBg}`}>
      
      {/* Top Section: Info & CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl shadow-sm ${isTrial ? "bg-indigo-100 text-indigo-600" : theme.iconBg} ${!isTrial && theme.iconText}`}>
            <Crown className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900 capitalize">
                {userTier} Plan <span className="text-sm font-medium text-slate-500 capitalize">({isTrial ? "Trial" : tierCycle})</span>
              </h2>
              
              {(isPastDue || diffDays < 0) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                  <AlertTriangle className="h-3 w-3" /> Past Due
                </span>
              )}
              
              {isTrial && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm animate-pulse">
                  <Sparkles className="h-3 w-3" /> Free Trial
                </span>
              )}
            </div>
            
            <p className="text-sm text-slate-600">
              {isTrial ? "Your risk-free trial ends on " : "Your workspace renews on "}
              <span className="font-bold text-slate-900">{expiry.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>. 
              {isTrial ? " Upgrade to keep access." : " Update billing to ensure uninterrupted service."}
            </p>
          </div>
        </div>

        <Button className={`rounded-xl h-11 px-6 shadow-md shrink-0 transition-all active:scale-95 cursor-pointer ${isTrial ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`}>
          <ArrowUpCircle className="h-4 w-4 mr-2" /> 
          {isTrial ? "Upgrade Workspace Now" : "Change Plan & Cycle"}
        </Button>
      </div>

      {/* Bottom Section: Progress Bar */}
      <div className="space-y-2 pt-2 border-t border-slate-200/60">
        <div className="flex justify-between items-end text-xs font-bold">
          <span className={isPastDue || diffDays < 0 ? "text-rose-600" : isTrial ? "text-indigo-700" : "text-slate-500"}>
            {statusText}
          </span>
          <span className="text-slate-400">
            {isPastDue || diffDays < 0 ? `${progressPercent.toFixed(0)}% Grace Used` : isTrial ? `${progressPercent.toFixed(0)}% Trial Used` : `${progressPercent.toFixed(0)}% Cycle Used`}
          </span>
        </div>
        
        {/* The Track */}
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
          {/* The Fill */}
          <div 
            className={`h-full transition-all duration-1000 ease-in-out rounded-full ${progressColor}`} 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

    </div>
  );
}