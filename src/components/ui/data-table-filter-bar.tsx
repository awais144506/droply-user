"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search } from "lucide-react";
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
    const currentDropdownValue = searchParams.get(dropdownParamName) || "All";

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">

            {/* Left: Search Bar */}
            <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-9 bg-white"
                    placeholder={searchPlaceholder}
                />
            </div>

            {/* Right: Tabs & Dropdown Container */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

                {/* 1. Shadcn Tabs (Used as a Segmented Control) */}
                {tabs.length > 0 && (
                    <Tabs
                        value={currentTabValue}
                        onValueChange={(val) => setQueryString(tabParamName, val)}
                        className="w-full sm:w-auto"
                    >
                        <TabsList className="grid w-full grid-cols-3 h-10">
                            {tabs.map((tab) => (
                                <TabsTrigger key={tab.label} value={tab.value}>
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                )}

                {/* 2. Shadcn Select Dropdown */}
                {dropdownOptions.length > 0 && (
                    <Select
                        value={currentDropdownValue}
                        onValueChange={(val) => setQueryString(dropdownParamName, val || "")}
                    >
                        <SelectTrigger className="w-full sm:w-40 bg-white h-10">
                            <SelectValue placeholder={dropdownPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {/* We use "all" instead of an empty string to keep Shadcn Select happy */}
                            <SelectItem value="all">{dropdownPlaceholder}</SelectItem>
                            {dropdownOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    );
}