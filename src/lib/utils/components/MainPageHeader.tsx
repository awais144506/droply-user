"use client";

import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus, RefreshCw, LucideIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { WhatsAppInvitePopover } from "@/components/ui/WhatsAppInvitePopover";

type Props = {
  heading: string;
  description: string;
  href?: string;
  btnText?: string;
  onActionClick?: () => void; // Optional: trigger a modal instead of a Link
  isDisabled?: boolean;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  icon?: LucideIcon; // Optional: pass a Lucide icon for visual flair
  badge?: string; // Optional: status/count pill next to heading
  // 🔥 Optional WhatsApp Customer Request Button
  showWhatsAppTemplate?: boolean;
  branchName?: string;
};

export default function MainPageHeader({
  heading,
  description,
  href,
  btnText,
  onActionClick,
  isDisabled = false,
  breadcrumbs,
  children,
  onRefresh,
  isRefreshing = false,
  icon: Icon,
  badge,
  showWhatsAppTemplate = false,
  branchName,
}: Props) {
  return (
    <div className="flex flex-col gap-3.5 pb-6">
      {/* 1. Optional Shadcn Breadcrumbs (Fixed nested <a> hydration issue) */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {!isLast && item.href ? (
                      <Link
                        href={item.href}
                        data-slot="breadcrumb-link"
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <BreadcrumbPage className="text-sky-600 font-semibold">
                        {item.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className="text-slate-400" />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* 2. Elevated Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        {/* Subtle top accent highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sky-500 via-indigo-500 to-emerald-500 opacity-85" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Optional Icon + Title & Description */}
          <div className="flex items-start gap-4 min-w-0">
            {Icon && (
              <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 border border-sky-500/20 shadow-2xs">
                <Icon className="h-6 w-6" />
              </div>
            )}

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 truncate">
                  {heading}
                </h1>
                {badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
                {description}
              </p>
            </div>
          </div>

          {/* Right: Actions Container */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
            {children}

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`group flex items-center gap-2 h-10 px-4 rounded-xl border border-amber-300 bg-amber-100 text-amber-700 shadow-sm shadow-amber-500/20 transition-all duration-200 ${isRefreshing
                    ? "opacity-70 cursor-not-allowed"
                    : "cursor-pointer hover:bg-amber-500 hover:shadow-md hover:shadow-amber-500/30 active:scale-95"
                  }`}
                title="Bypass cache and fetch fresh data"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-amber-700 transition-transform duration-300 ${isRefreshing ? "animate-spin" : "group-hover:rotate-45"
                    }`}
                />
                <span className="text-xs font-bold tracking-tight">
                  {isRefreshing ? "Syncing..." : "Refresh Data"}
                </span>
              </button>
            )}
            {showWhatsAppTemplate && (
              <WhatsAppInvitePopover branchName={branchName} />
            )}


            {/* Primary CTA: Supports either `href` Link OR `onActionClick` Modal Trigger */}
            {btnText &&
              (href || onActionClick) &&
              (href ? (
                <Link
                  href={isDisabled ? "#" : href}
                  className={`${buttonVariants({ variant: "default" })} ${isDisabled
                    ? "opacity-50 pointer-events-none cursor-not-allowed"
                    : "active:scale-[0.98]"
                    }`}
                  aria-disabled={isDisabled}
                  tabIndex={isDisabled ? -1 : undefined}
                >
                  <Plus className="h-4 w-4 mr-1.5 shrink-0 stroke-[2.5]" />
                  {btnText}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onActionClick}
                  disabled={isDisabled}
                  className={`${buttonVariants({ variant: "default" })} h-10 px-4 rounded-xl font-bold text-xs sm:text-sm bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/15 transition-all duration-150 cursor-pointer ${isDisabled
                    ? "opacity-50 pointer-events-none cursor-not-allowed"
                    : "active:scale-[0.98]"
                    }`}
                >
                  <Plus className="h-4 w-4 mr-1.5 shrink-0 stroke-[2.5]" />
                  {btnText}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}