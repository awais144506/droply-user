/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
    Calendar, 
    DollarSign, 
    ShoppingBag, 
    Truck, 
    RefreshCw, 
    ShieldCheck, 
    Store, 
    PackageOpen, 
    AlertTriangle, 
    TrendingUp, 
    ArrowUpRight, 
    Layers 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DailySales() {
    const [selectedDate, setSelectedDate] = useState("2026-10-14");

    // --- MOCK SUMMARY DATA ---
    const summaryData = {
        totalCashCollected: 45650,
        totalOrdersCount: 42,
        categories: {
            walkIn: { count: 18, revenue: 19500 },
            delivery: { count: 15, revenue: 23500 },
            saleReturn: { count: 4, value: -2500, affectedItems: 6 },
            recovery: { count: 5, recoveredAmount: 2000 },
            quickSale: { count: 12, revenue: 650 }
        },
        stockOutStats: {
            totalItemsDispatched: 240,
            totalItemsReturnedOrCollected: 165,
            netStockOut: 75
        },
        outOfStockAlerts: [
            { productName: "19L Mineral Water Bottle", currentStock: 0, threshold: 15, category: "Finished Good" },
            { productName: "Disposable Cup Sleeves (Pack of 100)", currentStock: 2, threshold: 10, category: "Packaging" },
            { productName: "Chilled 500ml Bottles", currentStock: 0, threshold: 30, category: "Trade" }
        ]
    };

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            
            {/* Header & Date Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daily Operations & Summary</h1>
                    <p className="text-sm text-slate-500 mt-1">High-level financial totals, category order counts, and active stock-out telemetry for the day.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex items-center">
                        <Calendar className="absolute left-3 w-4 h-4 text-slate-400" />
                        <Input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-9 h-10 w-full sm:w-48 bg-slate-50 border-slate-200 font-semibold text-slate-700 rounded-xl"
                        />
                    </div>
                </div>
            </div>

            {/* Top Financial & Volume KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <Card className="rounded-2xl border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50/60 via-white to-white">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cash Inflow</p>
                            <p className="text-3xl font-black text-emerald-600 mt-1">Rs. {summaryData.totalCashCollected.toLocaleString()}</p>
                            <p className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5" /> Collected across all channels
                            </p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <DollarSign className="w-7 h-7" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200 shadow-sm bg-gradient-to-br from-sky-50/60 via-white to-white">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders Handled</p>
                            <p className="text-3xl font-black text-sky-600 mt-1">{summaryData.totalOrdersCount} <span className="text-sm font-normal text-slate-500">ops</span></p>
                            <p className="text-xs text-sky-700 font-semibold mt-2 flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5" /> Walk-ins, Deliveries & Returns
                            </p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                            <ShoppingBag className="w-7 h-7" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50/60 via-white to-white">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Stock Out (Volume)</p>
                            <p className="text-3xl font-black text-indigo-600 mt-1">{summaryData.stockOutStats.netStockOut} <span className="text-sm font-normal text-slate-500">units</span></p>
                            <p className="text-xs text-indigo-700 font-semibold mt-2 flex items-center gap-1">
                                <PackageOpen className="w-3.5 h-3.5" /> {summaryData.stockOutStats.totalItemsDispatched} sent out vs {summaryData.stockOutStats.totalItemsReturnedOrCollected} returned
                            </p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Truck className="w-7 h-7" />
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Category Breakdown & Stock-Out Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left: Category Volume & Revenue Breakdown */}
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="p-6 border-b border-slate-100">
                        <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-indigo-600" /> Order Category Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                    <Store className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Walk-In Counter</p>
                                    <p className="text-xs text-slate-500">{summaryData.categories.walkIn.count} orders registered</p>
                                </div>
                            </div>
                            <p className="text-sm font-black text-slate-900">Rs. {summaryData.categories.walkIn.revenue.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Deliveries</p>
                                    <p className="text-xs text-slate-500">{summaryData.categories.delivery.count} orders completed</p>
                                </div>
                            </div>
                            <p className="text-sm font-black text-slate-900">Rs. {summaryData.categories.delivery.revenue.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                                    <RefreshCw className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Sale Returns (Defective)</p>
                                    <p className="text-xs text-slate-500">{summaryData.categories.saleReturn.count} returns processed ({summaryData.categories.saleReturn.affectedItems} items)</p>
                                </div>
                            </div>
                            <p className="text-sm font-black text-rose-600">-Rs. {Math.abs(summaryData.categories.saleReturn.value).toLocaleString()}</p>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recovery (Ledger / Assets)</p>
                                    <p className="text-xs text-slate-500">{summaryData.categories.recovery.count} recovery logs settled</p>
                                </div>
                            </div>
                            <p className="text-sm font-black text-indigo-600">Rs. {summaryData.categories.recovery.recoveredAmount.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Sales (POS Unregistered)</p>
                                    <p className="text-xs text-slate-500">{summaryData.categories.quickSale.count} walk-up sales</p>
                                </div>
                            </div>
                            <p className="text-sm font-black text-amber-600">Rs. {summaryData.categories.quickSale.revenue.toLocaleString()}</p>
                        </div>

                    </CardContent>
                </Card>

                {/* Right: Stock-Out & Inventory Alert Monitor */}
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-rose-600" /> Stock-Out & Low Inventory Alerts
                        </CardTitle>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                            {summaryData.outOfStockAlerts.length} Critical Items
                        </span>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <p className="text-xs text-slate-500">
                                The following items have reached zero stock or fallen below their safety threshold due to today&apos;s dispatch volume:
                            </p>

                            <div className="space-y-3">
                                {summaryData.outOfStockAlerts.map((alert, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-rose-50/40 border border-rose-100">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-slate-900">{alert.productName}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{alert.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black ${
                                                alert.currentStock === 0 ? "bg-rose-600 text-white" : "bg-amber-100 text-amber-800"
                                            }`}>
                                                {alert.currentStock === 0 ? "OUT OF STOCK" : `${alert.currentStock} left`}
                                            </span>
                                            <p className="text-[10px] text-slate-400 mt-1">Threshold: {alert.threshold}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

        </div>
    );
}