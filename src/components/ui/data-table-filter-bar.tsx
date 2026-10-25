"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, SlidersHorizontal, Check } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";

// Shadcn Imports
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}

export function DataTableFilterBar({
    searchPlaceholder = "Search...",
    searchParamName = "search",
    tabs = [],
    tabParamName = "role",
    dropdownOptions = [],
    dropdownParamName = "status",
    dropdownPlaceholder = "All Statuses"
}: DataTableFilterBarProps) {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const setQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            // If value is empty or "all", we delete the param to keep the URL clean
            if (value && value !== "all") {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            params.delete("page"); // Reset page when filtering
            router.push(`${pathName}?${params.toString()}`, { scroll: false });
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

    const currentTabValue = searchParams.get(tabParamName) || tabs[0]?.value || "";
    const currentDropdownValue = searchParams.get(dropdownParamName) || "all";
    const isDropdownActive = currentDropdownValue !== "all";

    // Find the matching label for the currently selected dropdown value
    const selectedDropdownOption = dropdownOptions.find(opt => opt.value === currentDropdownValue);
    const displayDropdownLabel = selectedDropdownOption ? selectedDropdownOption.label : dropdownPlaceholder;

    return (
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4">

            {/* Left: Search Bar */}
            <div className="relative w-full xl:w-96 shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-10 h-11 bg-white border-slate-200 shadow-xs rounded-xl focus-visible:ring-sky-500 transition-all text-sm font-medium"
                    placeholder={searchPlaceholder}
                />
            </div>

            {/* Right: Tabs & Dropdown Container */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto overflow-hidden">

                {/* 1. Shadcn Tabs */}
                {tabs.length > 0 && (
                    <Tabs
                        value={currentTabValue}
                        onValueChange={(val) => setQueryString(tabParamName, val)}
                        className="w-full sm:w-auto overflow-x-auto no-scrollbar"
                    >
                        <TabsList className="h-11 p-1 bg-slate-100/70 border border-slate-200/60 rounded-xl flex w-max sm:w-auto">
                            {tabs.map((tab) => (
                                <TabsTrigger 
                                    key={tab.label} 
                                    value={tab.value}
                                    className="cursor-pointer px-4 h-full rounded-lg text-xs font-bold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-xs hover:text-slate-900"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                )}

                {/* 2. Redesigned Shadcn Select Dropdown */}
                {dropdownOptions.length > 0 && (
                    <Select
                        value={currentDropdownValue}
                        onValueChange={(val) => setQueryString(dropdownParamName, val || "")}
                    >
                        <SelectTrigger className={`w-full sm:w-52 bg-white h-11 cursor-pointer rounded-xl transition-all font-semibold text-xs shadow-xs ${
                            isDropdownActive 
                                ? "border-sky-400 bg-sky-50/40 text-sky-900 ring-1 ring-sky-400/30" 
                                : "border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}>
                            <div className="flex items-center gap-2 truncate">
                                <SlidersHorizontal className={`h-3.5 w-3.5 shrink-0 ${isDropdownActive ? "text-sky-600" : "text-slate-400"}`} />
                                <span className="truncate">{displayDropdownLabel}</span>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1 bg-white">
                            <SelectItem 
                                value="all" 
                                className="cursor-pointer rounded-lg py-2.5 px-3 text-xs font-semibold text-slate-600 focus:bg-slate-50 focus:text-slate-900 data-[highlighted]:bg-slate-50"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>{dropdownPlaceholder}</span>
                                    {currentDropdownValue === "all" && <Check className="h-3.5 w-3.5 text-sky-600" />}
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
                                            {isSelected && <Check className="h-3.5 w-3.5 text-sky-600" />}
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    );
}