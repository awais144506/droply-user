"use client";

import { Droplets } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function BrandHeader() {
  const { user, isLoaded } = useUser();

  const userName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Admin User";

  const rawRole = (user?.publicMetadata?.role as string) || "SUPER_ADMIN";
  const formattedRole = rawRole
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="w-full flex items-center gap-3 hover:bg-transparent cursor-default"
        >
          {/* Brand Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-700 text-white dark:bg-white dark:text-black shadow-xs">
            <Droplets className="h-5 w-5" />
          </div>

          {/* User & Role Details */}
          <div className="flex flex-col gap-1 leading-none text-left overflow-hidden">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-medium text-muted-foreground truncate max-w-35">
                {isLoaded ? userName : "Loading..."}
              </span>
              <Badge
                variant="outline"
                className="h-4 border-blue-600/30 bg-blue-500/10 px-1.5 py-0 text-[9px] font-semibold text-blue-700 dark:text-blue-400 uppercase"
              >
                {isLoaded ? formattedRole : "..."}
              </Badge>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}