"use client";

import { useState, useEffect } from "react";
import {
    Search, Droplets, Package, AlertCircle,
    Pen, Eye, Trash2, TrendingUp, Filter, X,
    Network, ChevronLeft, ChevronRight
} from "lucide-react";
import { ProductItem } from "../api/use-products";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function ProductsTable({ products }: { products: ProductItem[] }) {
    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
    const [trackingFilter, setTrackingFilter] = useState<string>("ALL");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, showLowStockOnly, categoryFilter, trackingFilter]);

    const activeFiltersCount =
        (showLowStockOnly ? 1 : 0) +
        (categoryFilter !== "ALL" ? 1 : 0) +
        (trackingFilter !== "ALL" ? 1 : 0);

    const clearFilters = () => {
        setShowLowStockOnly(false);
        setCategoryFilter("ALL");
        setTrackingFilter("ALL");
        setIsFilterOpen(false);
    };

    // 1. Apply Filters
    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLowStock = showLowStockOnly ? p.stockOnHand <= p.lowStockThreshold : true;
        const matchesCategory = categoryFilter !== "ALL" ? p.category === categoryFilter : true;
        const matchesTracking = trackingFilter !== "ALL" ? p.trackingType === trackingFilter : true;

        return matchesSearch && matchesLowStock && matchesCategory && matchesTracking;
    });

    // 2. Apply Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const calculateMargin = (sale: number, cost: number) => {
        if (sale <= 0) return 0;
        return (((sale - cost) / sale) * 100).toFixed(0);
    };

    const formatCategory = (cat: string) => cat.replace(/_/g, " ");

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">

            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by item name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                    />
                </div>

                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="h-10 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 relative pr-4">
                            <Filter className="h-4 w-4 mr-2 text-slate-500" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-80 p-4 rounded-2xl border-slate-200 shadow-xl">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h4 className="text-sm font-bold text-slate-900">Filter Inventory</h4>
                                {activeFiltersCount > 0 && (
                                    <button onClick={clearFilters} className="text-xs font-semibold text-sky-600 hover:text-sky-700">
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Stock Toggle */}
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Show Low Stock Only</span>
                                <div className="relative inline-flex items-center">
                                    <input type="checkbox" checked={showLowStockOnly} onChange={(e) => setShowLowStockOnly(e.target.checked)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                                </div>
                            </label>

                            {/* Category Filter */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
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
                                    value={trackingFilter}
                                    onChange={(e) => setTrackingFilter(e.target.value)}
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

            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-white text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-4">Sr No</th>
                            <th className="px-4 py-4 whitespace-nowrap">Item & SKU</th>
                            <th className="px-4 py-4 whitespace-nowrap">Type & Tracking</th>
                            <th className="px-4 py-4 whitespace-nowrap">Sale Price</th>
                            <th className="px-4 py-4 whitespace-nowrap">Unit Cost</th>
                            <th className="px-4 py-4 whitespace-nowrap text-center">Stock On Hand</th>
                            <th className="px-4 py-4 whitespace-nowrap text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product, index) => {
                                const isWater = product.name.toLowerCase().includes("water");
                                const isLowStock = product.stockOnHand <= product.lowStockThreshold;
                                const hasRecipe = (product as any).hasRecipe;

                                return (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-4 py-4 text-center">
                                            {index + 1}
                                        </td>

                                        {/* Item & SKU */}
                                        <td className="px-4 py-4 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                                                {isWater ? <Droplets className="h-5 w-5 text-sky-500" /> : <Package className="h-5 w-5 text-sky-500" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{product.name}</p>
                                            </div>
                                        </td>

                                        {/* Type, Tracking & Recipe */}
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {product.trackingType === "RETURNABLE" ? (
                                                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">Returnable</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">Outright</span>
                                                )}
                                                <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                                    {formatCategory(product.category)}
                                                </span>

                                                {/* RECIPE BADGE */}
                                                {hasRecipe && (
                                                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 flex items-center gap-1">
                                                        <Network className="h-3 w-3" /> Recipe
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Sale Price */}
                                        <td className="px-4 py-4 font-bold text-slate-900">
                                            Rs {product.salePrice.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                                        </td>

                                        {/* Unit Cost & Margin */}
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-medium text-slate-500">
                                                Rs {product.unitCost.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                                            </p>
                                            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
                                                <TrendingUp className="h-3 w-3" />
                                                ~{calculateMargin(product.salePrice, product.unitCost)}% margin
                                            </div>
                                        </td>

                                        {/* Stock On Hand */}
                                        <td className="px-4 py-4 text-center">
                                            <p className={`text-base font-bold ${isLowStock ? "text-rose-600" : "text-slate-900"}`}>
                                                {product.stockOnHand.toLocaleString("en-PK")}
                                            </p>
                                            {isLowStock && (
                                                <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-rose-500 mt-0.5">
                                                    <AlertCircle className="h-3 w-3" /> Low stock
                                                </div>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 transition-opacity">
                                                <Button variant="ghost" size="icon-sm" className="text-slate-400 hover:text-sky-600 h-8 w-8 rounded-lg">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" className="text-slate-400 hover:text-slate-600 h-8 w-8 rounded-lg">
                                                    <Pen className="h-4 w-4" />
                                                </Button>

                                                <Button variant="ghost" size="icon-sm" className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 rounded-lg">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-4 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <X className="h-8 w-8 text-slate-300 mb-2" />
                                        <p className="text-sm font-medium text-slate-500">No items match your filters.</p>
                                        <Button variant="link" onClick={clearFilters} className="text-sky-600 mt-1 h-auto p-0">Clear filters</Button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                    <p className="text-xs font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> of <span className="font-bold text-slate-900">{filteredProducts.length}</span> items
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 rounded-lg text-xs"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                        </Button>
                        <div className="flex items-center gap-1 px-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`h-7 w-7 rounded-md text-xs font-bold transition-colors ${currentPage === i + 1
                                        ? "bg-sky-600 text-white"
                                        : "text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 rounded-lg text-xs"
                        >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}