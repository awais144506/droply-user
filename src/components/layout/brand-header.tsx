"use client";

import Image from "next/image";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function BrandHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="w-full flex items-center gap-3.5 hover:bg-sidebar-accent/50 transition-colors cursor-default px-2.5 py-2"
        >
          {/* Logo Container */}
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-900 shadow-sm overflow-hidden p-1.5 transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="Droply Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>

          {/* Brand Name & Subtitle */}
          <div className="flex flex-col justify-center leading-none text-left overflow-hidden">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Droply
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide mt-1">
              Branch Management
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}