"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, ReactNode } from "react";
import {
    Search,
    SlidersHorizontal,
    Check,
    CalendarIcon,
    X,
    RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import { useDebounce } from "@/lib/hooks/use-debounce";

// Shadcn Imports
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export interface FilterTab {
    label: string;
    value: string;
}

export interface FilterDropdownOption {
    label: string;
    value: string;
}

interface DataTableFilterBarProps {
    searchPlaceholder?: string;
    searchParamName?: string;
    tabs?: FilterTab[];
    tabParamName?: string;
    dropdownOptions?: FilterDropdownOption[];
    dropdownParamName?: string;
    dropdownPlaceholder?: string;
    // Date Filter Props
    showDateFilter?: boolean;
    dateParamName?: string;
    datePlaceholder?: string;
    // Optional Right Action Slot (e.g. PDF Export Button) — Safe for all other tables
    rightSlot?: ReactNode;
}

export function DataTableFilterBar({
    searchPlaceholder = "Search...",
    searchParamName = "search",
    tabs = [],
    tabParamName = "role",
    dropdownOptions = [],
    dropdownParamName = "status",
    dropdownPlaceholder = "All Statuses",
    showDateFilter = false,
    dateParamName = "date",
    datePlaceholder = "Filter by Date",
    rightSlot,
}: DataTableFilterBarProps) {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const setQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "all") {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            params.delete("page"); // Reset page when filtering
            const qs = params.toString();
            router.push(qs ? `${pathName}?${qs}` : pathName, { scroll: false });
        },
        [pathName, router, searchParams]
    );

    const currentSearchUrlValue = searchParams.get(searchParamName) || "";
    const [searchValue, setSearchValue] = useState(currentSearchUrlValue);
    const debouncedSearchValue = useDebounce(searchValue, 500);

    useEffect(() => {
        if (debouncedSearchValue !== currentSearchUrlValue) {
            setQueryString(searchParamName, debouncedSearchValue);
        }
    }, [debouncedSearchValue, currentSearchUrlValue, searchParamName, setQueryString]);

    const defaultTabValue = tabs[0]?.value ?? "";
    const currentTabValue = searchParams.get(tabParamName) ?? defaultTabValue;
    const isTabFiltered = tabs.length > 0 && currentTabValue !== defaultTabValue;

    const currentDropdownValue = searchParams.get(dropdownParamName) || "all";
    const isDropdownActive = dropdownOptions.length > 0 && currentDropdownValue !== "all";

    const selectedDropdownOption = dropdownOptions.find(
        (opt) => opt.value === currentDropdownValue
    );
    const displayDropdownLabel = selectedDropdownOption
        ? selectedDropdownOption.label
        : dropdownPlaceholder;

    // Date Filter State from URL (formatted as yyyy-MM-dd)
    const currentDateParam = searchParams.get(dateParamName) || "";
    const selectedDate = currentDateParam
        ? new Date(`${currentDateParam}T00:00:00`)
        : undefined;

    const hasActiveFilters =
        Boolean(searchValue.trim()) ||
        isTabFiltered ||
        isDropdownActive ||
        (showDateFilter && Boolean(selectedDate));

    const handleResetFilters = () => {
        setSearchValue("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete(searchParamName);
        if (tabs.length > 0) params.delete(tabParamName);
        if (dropdownOptions.length > 0) params.delete(dropdownParamName);
        if (showDateFilter) params.delete(dateParamName);
        params.delete("page");
        const qs = params.toString();
        router.push(qs ? `${pathName}?${qs}` : pathName, { scroll: false });
    };

    return (
        <div className="bg-white border border-slate-500 rounded-lg p-3 shadow-sm mb-4">
            <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3">
                {/* Left: Prominent Search Bar */}
                <div className="relative w-full xl:w-96 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search
                            className={`h-4 w-4 transition-colors ${
                                searchValue ? "text-sky-600" : "text-slate-500"
                            }`}
                        />
                    </div>
                    <Input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className={`pl-10 h-11 rounded-xl transition-all text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 ${
                            searchValue
                                ? "pr-9 bg-sky-50/40 border-sky-500 text-slate-900 ring-2 ring-sky-500/15"
                                : "pr-4 bg-slate-50/80 border-slate-300/90 text-slate-800 hover:border-slate-400 focus-visible:bg-white focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20"
                        }`}
                        placeholder={searchPlaceholder}
                    />
                    {searchValue && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchValue("");
                                setQueryString(searchParamName, "");
                            }}
                            className="absolute inset-y-0 right-2.5 my-auto h-6 w-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                            title="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Right: Tabs, Date Picker, Dropdown, Reset & Optional Action Slot */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full xl:w-auto">
                    {/* 1. Prominent Segmented Tabs */}
                    {tabs.length > 0 && (
                        <Tabs
                            value={currentTabValue}
                            onValueChange={(val) => setQueryString(tabParamName, val)}
                            className="w-full sm:w-auto overflow-x-auto no-scrollbar"
                        >
                            <TabsList className="h-11 p-1 bg-slate-100 border border-slate-300/80 rounded-xl flex w-max sm:w-auto gap-1">
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.label}
                                        value={tab.value}
                                        className="cursor-pointer px-4 h-full rounded-lg text-xs font-bold text-slate-600 transition-all hover:text-slate-900 hover:bg-white/60 data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    )}

                    {/* 2. Optional Date Filter */}
                    {showDateFilter && (
                        <div className="relative flex items-center w-full sm:w-auto">
                            <Popover>
                                <PopoverTrigger
                                    className={`w-full sm:w-48 h-11 px-3.5 border rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                                        selectedDate
                                            ? "border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 pr-8"
                                            : "border-slate-300/90 bg-slate-50/80 text-slate-700 hover:bg-white hover:border-slate-400"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <CalendarIcon
                                            className={`h-4 w-4 shrink-0 ${
                                                selectedDate ? "text-sky-600" : "text-slate-500"
                                            }`}
                                        />
                                        <span className="truncate">
                                            {selectedDate
                                                ? format(selectedDate, "dd MMM yyyy")
                                                : datePlaceholder}
                                        </span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0 rounded-xl border-slate-200 shadow-xl bg-white"
                                    align="end"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => {
                                            setQueryString(
                                                dateParamName,
                                                date ? format(date, "yyyy-MM-dd") : ""
                                            );
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>

                            {selectedDate && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setQueryString(dateParamName, "");
                                    }}
                                    className="absolute right-2.5 p-1 rounded-md text-sky-700 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Clear date filter"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* 3. Prominent Select Dropdown */}
                    {dropdownOptions.length > 0 && (
                        <Select
                            value={currentDropdownValue}
                            onValueChange={(val) =>
                                setQueryString(dropdownParamName, val || "")
                            }
                        >
                            <SelectTrigger
                                className={`w-full sm:w-52 h-11 cursor-pointer rounded-xl transition-all font-bold text-xs ${
                                    isDropdownActive
                                        ? "border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20"
                                        : "border-slate-300/90 bg-slate-50/80 text-slate-700 hover:bg-white hover:border-slate-400"
                                }`}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <SlidersHorizontal
                                        className={`h-3.5 w-3.5 shrink-0 ${
                                            isDropdownActive
                                                ? "text-sky-600"
                                                : "text-slate-500"
                                        }`}
                                    />
                                    <span className="truncate">{displayDropdownLabel}</span>
                                    {isDropdownActive && (
                                        <span className="h-2 w-2 rounded-full bg-sky-600 shrink-0" />
                                    )}
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1 bg-white">
                                <SelectItem
                                    value="all"
                                    className="cursor-pointer rounded-lg py-2.5 px-3 text-xs font-semibold text-slate-600 focus:bg-slate-50 focus:text-slate-900 data-highlighted:bg-slate-50"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span>{dropdownPlaceholder}</span>
                                        {currentDropdownValue === "all" && (
                                            <Check className="h-3.5 w-3.5 text-sky-600" />
                                        )}
                                    </div>
                                </SelectItem>
                                {dropdownOptions.map((opt) => {
                                    const isSelected = currentDropdownValue === opt.value;
                                    return (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                            className={`cursor-pointer rounded-lg py-2.5 px-3 text-xs font-semibold transition-colors my-0.5 ${
                                                isSelected
                                                    ? "bg-sky-50 text-sky-900 font-bold"
                                                    : "text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span>{opt.label}</span>
                                                {isSelected && (
                                                    <Check className="h-3.5 w-3.5 text-sky-600" />
                                                )}
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    )}

                    {/* 4. Compact One-Click Reset (only visible when a filter is active) */}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            title="Reset all filters"
                            className="h-11 px-3 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer shrink-0"
                        >
                            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                            <span>Reset</span>
                        </button>
                    )}

                    {/* 5. Optional Right Action Slot (PDF Button, etc.) */}
                    {rightSlot && (
                        <div className="shrink-0 flex items-center">{rightSlot}</div>
                    )}
                </div>
            </div>
        </div>
    );
}