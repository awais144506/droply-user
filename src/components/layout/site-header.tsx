"use client";
import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      {/* Left: Navigation & Breadcrumbs */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>

      {/* Right: Notifications Only */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>
        </Button>
      </div>
    </header>
  );
}