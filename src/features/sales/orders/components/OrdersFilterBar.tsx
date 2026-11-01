/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import {
  Search,
  X,
  Calendar as CalendarIcon,
  Filter,
  RotateCcw,
  ShoppingBag,
  Truck,
  Banknote,
  Undo2,
  Layers,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ORDER_CATEGORIES = [
  { label: "All Categories", value: "ALL", icon: Layers },
  { label: "Walk-In", value: "WALK_IN", icon: ShoppingBag },
  { label: "Delivery", value: "DELIVERY", icon: Truck },
  { label: "Recovery", value: "RECOVERY", icon: Banknote },
  { label: "Sale Return", value: "SALE_RETURN", icon: Undo2 },
];

export const ORDER_STATUSES = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "On Route", value: "ON_ROUTE" },
  { label: "Arrived", value: "ARRIVED" },
  { label: "Rescheduled", value: "RESCHEDULED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export const OrdersFilterBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read active parameters from URL
  const currentCategory = searchParams.get("category") || "ALL";
  const currentStatus = searchParams.get("status") || "ALL";
  const currentDateStr = searchParams.get("date") || "";
  const currentSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Sync search input with URL changes
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  // Parse URL date string safely for Shadcn Calendar
  const selectedDate = React.useMemo(() => {
    if (!currentDateStr) return undefined;
    const parsed = parseISO(currentDateStr);
    return isValid(parsed) ? parsed : undefined;
  }, [currentDateStr]);

  // Update URL search params cleanly
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "ALL" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  // Debounce search input (400ms) so backend isn't spammed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        updateUrlParams({ search: searchTerm });
      }
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateUrlParams({ date: format(date, "yyyy-MM-dd") });
    } else {
      updateUrlParams({ date: null });
    }
    setIsCalendarOpen(false);
  };

  const handleResetAll = () => {
    setSearchTerm("");
    router.replace(pathname, { scroll: false });
  };

  const hasActiveFilters =
    currentCategory !== "ALL" ||
    currentStatus !== "ALL" ||
    Boolean(currentDateStr) ||
    Boolean(currentSearch);

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
      {/* TIER 1: Category Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          {ORDER_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = currentCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => updateUrlParams({ category: cat.value })}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5",
                    isActive ? "text-white" : "text-slate-400"
                  )}
                />
                {cat.label}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="h-8 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl px-2.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Filters
          </Button>
        )}
      </div>

      {/* TIER 2: Search, Status Dropdown, and Shadcn Popover Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input (6 Cols) */}
        <div className="relative md:col-span-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order Code, Customer Name, or Phone..."
            className="pl-9 pr-8 h-10 rounded-xl border-slate-200 text-xs font-medium focus-visible:ring-sky-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                updateUrlParams({ search: null });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Select (3 Cols) */}
        <div className="md:col-span-3">
          <Select
            value={currentStatus}
            onValueChange={(val) => updateUrlParams({ status: val })}
          >
            <SelectTrigger className="h-10 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 w-full">
              <div className="flex items-center gap-2 truncate">
                <Filter className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <SelectValue placeholder="Order Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {ORDER_STATUSES.map((st) => (
                <SelectItem
                  key={st.value}
                  value={st.value}
                  className="text-xs font-medium cursor-pointer"
                >
                  {st.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Shadcn Popover + Calendar Date Picker (3 Cols) */}
        <div className="md:col-span-3 flex items-center gap-1">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger >
              <Button
                variant="outline"
                className={cn(
                  "w-full h-10 justify-start text-left text-xs font-semibold rounded-xl border-slate-200 px-3",
                  !selectedDate && "text-slate-500"
                )}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="truncate">
                  {selectedDate
                    ? format(selectedDate, "PPP")
                    : "Filter by Date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                
              />
            </PopoverContent>
          </Popover>

          {selectedDate && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => updateUrlParams({ date: null })}
              className="h-10 w-10 shrink-0 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
              title="Clear Date"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};