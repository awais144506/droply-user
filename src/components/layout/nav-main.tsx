"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { BRANCH_NAV_CONFIG, UserRole, SubscriptionTier } from "@/config/navigation.config";
import { useRole } from "@/hooks/use-role";

export function NavMain() {
  const pathname = usePathname();
  const { isOwner, userTier } = useRole();
  const isDashboardActive = pathname === "/app";
  
  const userRole: UserRole = isOwner ? "OWNER" : "MANAGER";
  const currentTier = (userTier || "SILVER").toUpperCase() as SubscriptionTier;

  return (
    <div className="space-y-3 px-3 py-2 select-none">
      {/* 1. Operations Desk (Standalone Hero Link) */}
      <Link
        href="/app"
        className={`flex items-center gap-3 w-full p-2.5 rounded-2xl border transition-all duration-200 ${isDashboardActive
          ? "bg-sky-600 text-white border-sky-600 shadow-sm"
          : "bg-card text-foreground border-border/70 hover:bg-muted/60"
          }`}
      >
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isDashboardActive
            ? "bg-white/20 text-white"
            : "bg-sky-500/10 text-sky-600 dark:text-sky-400"
            }`}
        >
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div className="flex flex-col text-left min-w-0">
          <span className="font-bold text-xs leading-none">
            Dashboard
          </span>
          <span
            className={`text-[10px] mt-1 font-normal truncate ${isDashboardActive ? "text-sky-100" : "text-muted-foreground"
              }`}
          >
            Live branch metrics & trips
          </span>
        </div>
      </Link>

      {/* 2. Grouped Category Cards */}
      {BRANCH_NAV_CONFIG.map((group) => {
        
        // 🔥 Apply DOUBLE FILTER: Must have correct Role AND correct Tier
        const visibleItems = group.items.filter((item) =>
          item.allowedRoles.includes(userRole) && 
          item.allowedTiers.includes(currentTier)
        );

        if (visibleItems.length === 0) return null;

        const isGroupActive = visibleItems.some(
          (item) =>
            pathname === item.url || pathname.startsWith(`${item.url}/`)
        );

        return (
          <div
            key={group.label}
            className="rounded-2xl border border-border/70 bg-card p-1.5 shadow-xs transition-all duration-200"
          >
            <Collapsible defaultOpen={true} className="group/collapsible w-full ">
              {/* Group Header */}
              <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between px-2.5 py-2 rounded-xl text-[11px] font-bold tracking-wider hover:bg-muted/50 transition-colors uppercase">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 transition-all ${isGroupActive
                      ? `${group.headerColor.dot} ring-2 ring-background`
                      : "bg-muted-foreground/40"
                      }`}
                  />
                  <span className={group.headerColor.text}>
                    {group.label}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-0 -rotate-90" />
              </CollapsibleTrigger>

              {/* Group Items */}
              <CollapsibleContent className="space-y-1 mt-1">
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(`${item.url}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs transition-all duration-150 ${isActive
                        ? "bg-sky-600 text-white font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70 font-medium"
                        }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-white" : "text-muted-foreground/70"
                          }`}
                      />
                      <span className="truncate">{item.title}</span>

                      {item.badge && (
                        <Badge
                          variant="outline"
                          className={`ml-auto text-[9px] px-1.5 py-0 font-medium ${isActive
                            ? "bg-white/20 text-white border-white/30"
                            : item.badge === "Admin"
                              ? "border-amber-500/30 text-amber-600 bg-amber-500/10"
                              : "border-sky-500/30 text-sky-600 bg-sky-500/10"
                            }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
}