import { Search, Filter, FileDown, X, RotateCcw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  showLowStockOnly: boolean;
  setShowLowStockOnly: (val: boolean) => void;
  showPublicOnly: boolean;
  setShowPublicOnly: (val: boolean) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  trackingFilter: string;
  setTrackingFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
  isFilterOpen: boolean;
  setIsFilterOpen: (val: boolean) => void;
  onDownloadPdf: () => void;
  isPdfDisabled?: boolean;
}

export function ProductsFilterBar(props: FilterBarProps) {
  const hasAnyActive =
    Boolean(props.searchQuery.trim()) || props.activeFiltersCount > 0;

  const handleResetAll = () => {
    props.setSearchQuery("");
    props.clearFilters();
  };

  return (
    <div className="p-3 mb-2 sm:p-3.5 bg-white border rounded-lg border-slate-500">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Prominent Search Bar */}
        <div className="relative w-full sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search
              className={`h-4 w-4 transition-colors ${
                props.searchQuery ? "text-sky-600" : "text-slate-500"
              }`}
            />
          </div>
          <input
            type="text"
            placeholder="Search by name or product code..."
            value={props.searchQuery}
            onChange={(e) => props.setSearchQuery(e.target.value)}
            className={`w-full h-11 pl-10 rounded-xl border text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 transition-all focus:outline-none ${
              props.searchQuery
                ? "pr-9 bg-sky-50/40 border-sky-500 text-slate-900 ring-2 ring-sky-500/15"
                : "pr-4 bg-slate-50/80 border-slate-300/90 text-slate-800 hover:border-slate-400 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            }`}
          />
          {props.searchQuery && (
            <button
              type="button"
              onClick={() => props.setSearchQuery("")}
              className="absolute inset-y-0 right-2.5 my-auto h-6 w-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filters Popover, Reset & PDF Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Popover open={props.isFilterOpen} onOpenChange={props.setIsFilterOpen}>
            <PopoverTrigger
              className={`h-11 px-4 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                props.activeFiltersCount > 0
                  ? "border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20"
                  : "border-slate-300/90 bg-slate-50/80 text-slate-700 hover:bg-white hover:border-slate-400"
              }`}
            >
              <Filter
                className={`h-3.5 w-3.5 shrink-0 ${
                  props.activeFiltersCount > 0 ? "text-sky-600" : "text-slate-500"
                }`}
              />
              <span>Filters</span>
              {props.activeFiltersCount > 0 && (
                <span className="ml-0.5 flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
                  {props.activeFiltersCount}
                </span>
              )}
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-80 p-4 rounded-2xl border-slate-200 shadow-xl bg-white max-h-[80vh] overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Filter Inventory
                  </h4>
                </div>

                {/* Stock Toggle */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                    Show Low Stock Only
                  </span>
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={props.showLowStockOnly}
                      onChange={(e) => props.setShowLowStockOnly(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                  </div>
                </label>

                {/* Public/Visibility Toggle */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                    Show Public Only
                  </span>
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={props.showPublicOnly}
                      onChange={(e) => props.setShowPublicOnly(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                </label>

                {/* Status Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    value={props.statusFilter}
                    onChange={(e) => props.setStatusFilter(e.target.value)}
                    className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer ${
                      props.statusFilter !== "ALL"
                        ? "border-sky-500 bg-sky-50/50 text-sky-900"
                        : "border-slate-300/90 bg-slate-50/80 text-slate-700"
                    }`}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active Only</option>
                    <option value="INACTIVE">Inactive Only</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={props.categoryFilter}
                    onChange={(e) => props.setCategoryFilter(e.target.value)}
                    className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer ${
                      props.categoryFilter !== "ALL"
                        ? "border-sky-500 bg-sky-50/50 text-sky-900"
                        : "border-slate-300/90 bg-slate-50/80 text-slate-700"
                    }`}
                  >
                    <option value="ALL">All Categories</option>
                    <option value="FINISHED_GOOD">Finished Goods</option>
                    <option value="RAW_MATERIAL">Raw Materials</option>
                    <option value="TRADE">Trade</option>
                    <option value="EQUIPMENT">Equipment</option>
                    <option value="PACKAGING">Packaging</option>
                    <option value="SERVICE">Service</option>
                  </select>
                </div>

                {/* Tracking Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Tracking Type
                  </label>
                  <select
                    value={props.trackingFilter}
                    onChange={(e) => props.setTrackingFilter(e.target.value)}
                    className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer ${
                      props.trackingFilter !== "ALL"
                        ? "border-sky-500 bg-sky-50/50 text-sky-900"
                        : "border-slate-300/90 bg-slate-50/80 text-slate-700"
                    }`}
                  >
                    <option value="ALL">All Tracking Types</option>
                    <option value="OUTRIGHT">Outright (Standard)</option>
                    <option value="RETURNABLE">Returnable (Asset Tracked)</option>
                  </select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Compact One-Click Reset */}
          {hasAnyActive && (
            <button
              type="button"
              onClick={handleResetAll}
              title="Reset all filters"
              className="h-11 px-3 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5 shrink-0" />
              <span>Reset</span>
            </button>
          )}

          {/* PDF Export Button */}
          <button
            type="button"
            onClick={props.onDownloadPdf}
            disabled={props.isPdfDisabled}
            title="Download filtered products as B&W PDF"
            className="h-11 px-3.5 bg-slate-600 hover:bg-slate-900 text-white border border-slate-200 hover:border-slate-900 rounded-xl flex items-center gap-2 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileDown className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}