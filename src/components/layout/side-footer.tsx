"use client";

import { LogOut } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SideFooterProps {
  onLogout?: () => void;
}

export const SideFooter = ({ onLogout }: SideFooterProps) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip="Log out"
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-2.5 py-2 text-sm font-medium rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/30 hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-900/50 dark:hover:text-rose-300 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="truncate font-semibold">Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SideFooter;