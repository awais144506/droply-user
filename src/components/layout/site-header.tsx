"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { SubscriptionIndicator } from "./subscription-indicator";

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 z-20 sticky top-0">
      {/* Left: Navigation Trigger */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-800" />
        <SubscriptionIndicator />
      </div>
      <div className="flex items-center justify-between">
        <NavUser />
      </div>
    </header>
  );
}