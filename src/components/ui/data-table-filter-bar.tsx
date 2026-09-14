"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";

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
    // Tabs (e.g., All | Manager | Rider)
    tabs?: FilterTab[];
    tabParamName?: string;
    // Dropdown (e.g., Active | Disabled)
    dropdownOptions?: FilterDropdownOption[];
    dropdownParamName?: string;
    dropdownPlaceholder?: string;
}

export function DataTableFilterBar({
    searchPlaceholder = "Search...",
    searchParamName = "search",
    tabs = [],
    tabParamName = "role", // Changed default to 'role' to separate from status
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
            if (value) {
                params.set(name, value);
            }
            else {
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

    const currentTabValue = searchParams.get(tabParamName) || "";
    const currentDropdownValue = searchParams.get(dropdownParamName) || "";

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            
            {/* Left: Search Bar */}
            <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                    placeholder={searchPlaceholder}
                />
            </div>

            {/* Right: Tabs & Dropdown Container */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                
                {/* 1. The Tabs */}
                {tabs.length > 0 && (
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {tabs.map((tab) => {
                            const isActive = currentTabValue === tab.value;
                            return (
                                <button
                                    key={tab.label}
                                    onClick={() => setQueryString(tabParamName, tab.value)}
                                    className={`cursor-pointer px-4 py-1.5 text-sm font-medium rounded-md transition-all ${isActive
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* 2. The New Dropdown */}
                {dropdownOptions.length > 0 && (
                    <select
                        value={currentDropdownValue}
                        onChange={(e) => setQueryString(dropdownParamName, e.target.value)}
                        className="block w-full sm:w-auto pl-3 pr-8 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 cursor-pointer"
                    >
                        <option value="">{dropdownPlaceholder}</option>
                        {dropdownOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
}