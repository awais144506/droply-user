import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterBarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    showLowStockOnly: boolean;
    setShowLowStockOnly: (val: boolean) => void;
    categoryFilter: string;
    setCategoryFilter: (val: string) => void;
    trackingFilter: string;
    setTrackingFilter: (val: string) => void;
    clearFilters: () => void;
    activeFiltersCount: number;
    isFilterOpen: boolean;
    setIsFilterOpen: (val: boolean) => void;
}

export function ProductsFilterBar(props: FilterBarProps) {
    return (
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by item name..."
                    value={props.searchQuery}
                    onChange={(e) => props.setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                />
            </div>

            <Popover open={props.isFilterOpen} onOpenChange={props.setIsFilterOpen}>
                <PopoverTrigger>
                    <Button variant="outline" className="h-10 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 relative pr-4">
                        <Filter className="h-4 w-4 mr-2 text-slate-500" />
                        Filters
                        {props.activeFiltersCount > 0 && (
                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
                                {props.activeFiltersCount}
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-4 rounded-2xl border-slate-200 shadow-xl">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h4 className="text-sm font-bold text-slate-900">Filter Inventory</h4>
                            {props.activeFiltersCount > 0 && (
                                <button onClick={props.clearFilters} className="text-xs font-semibold text-sky-600 hover:text-sky-700">
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Stock Toggle */}
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Show Low Stock Only</span>
                            <div className="relative inline-flex items-center">
                                <input type="checkbox" checked={props.showLowStockOnly} onChange={(e) => props.setShowLowStockOnly(e.target.checked)} className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                            </div>
                        </label>

                        {/* Category Filter */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
                            <select
                                value={props.categoryFilter}
                                onChange={(e) => props.setCategoryFilter(e.target.value)}
                                className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                            >
                                <option value="ALL">All Categories</option>
                                <option value="FINISHED_GOOD">Finished Goods</option>
                                <option value="RAW_MATERIAL">Raw Materials</option>
                                <option value="RETURNABLE_CONTAINER">Returnable Containers</option>
                                <option value="EQUIPMENT">Equipment</option>
                            </select>
                        </div>

                        {/* Tracking Filter */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tracking Type</label>
                            <select
                                value={props.trackingFilter}
                                onChange={(e) => props.setTrackingFilter(e.target.value)}
                                className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                            >
                                <option value="ALL">All Tracking Types</option>
                                <option value="OUTRIGHT">Outright (Standard)</option>
                                <option value="RETURNABLE">Returnable (Asset Tracked)</option>
                            </select>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}