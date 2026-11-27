"use client";

import React from "react";
import { Store, Truck, RefreshCw, ShieldCheck, ShoppingBag, AlertTriangle, CheckCircle2, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailySalesResponse } from "../types/daily";

type Props = {
    categories: DailySalesResponse["categories"];
    alerts: DailySalesResponse["alerts"];
};

export const DailySalesBreakdown = ({ categories, alerts }: Props) => {
    const getCategory = (type: string) => {
        return categories?.find((c) => c.type === type) || {
            count: 0,
            amount: 0,
            subtitle: "0 records",
        };
    };

    const walkIn = getCategory("WALK_IN");
    const delivery = getCategory("DELIVERY");
    const saleReturn = getCategory("RETURN");
    const recovery = getCategory("RECOVERY");
    const quickSale = getCategory("QUICK_SALE");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Left: Category Breakdown */}
            <Card className="rounded-2xl border-slate-200 shadow-xs overflow-hidden">
                <CardHeader className="p-4 sm:p-6 border-b border-slate-100">
                    <CardTitle className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 shrink-0" />
                        <span>Order Category Breakdown</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider leading-snug">Walk-In Counter</p>
                                <p className="text-[11px] sm:text-xs text-slate-500 truncate">{walkIn.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm font-black text-slate-900 shrink-0 whitespace-nowrap">
                            Rs. {walkIn.amount.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider leading-snug">Deliveries</p>
                                <p className="text-[11px] sm:text-xs text-slate-500 truncate">{delivery.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm font-black text-slate-900 shrink-0 whitespace-nowrap">
                            Rs. {delivery.amount.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider leading-snug">Sale Returns (Defective)</p>
                                <p className="text-[11px] sm:text-xs text-slate-500 truncate">{saleReturn.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm font-black text-rose-600 shrink-0 whitespace-nowrap">
                            -Rs. {saleReturn.amount.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider leading-snug">Recovery (Ledger / Assets)</p>
                                <p className="text-[11px] sm:text-xs text-slate-500 truncate">{recovery.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm font-black text-indigo-600 shrink-0 whitespace-nowrap">
                            Rs. {recovery.amount.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider leading-snug">Quick Sales (POS Unregistered)</p>
                                <p className="text-[11px] sm:text-xs text-slate-500 truncate">{quickSale.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm font-black text-amber-600 shrink-0 whitespace-nowrap">
                            Rs. {quickSale.amount.toLocaleString()}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Right: Stock-Out & Inventory Alert Monitor */}
            <Card className="rounded-2xl border-slate-200 shadow-xs overflow-hidden">
                <CardHeader className="p-4 sm:p-6 border-b border-slate-100 flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
                    <CardTitle className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
                        <span>Stock-Out &amp; Low Inventory Alerts</span>
                    </CardTitle>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 whitespace-nowrap ${
                        (alerts?.criticalCount || 0) > 0 
                            ? "bg-rose-50 text-rose-600 border-rose-200" 
                            : "bg-emerald-50 text-emerald-600 border-emerald-200"
                    }`}>
                        {alerts?.criticalCount || 0} Critical Items
                    </span>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <p className="text-xs text-slate-500 leading-relaxed">
                            The following items have reached zero stock or fallen below their safety threshold due to dispatch volume:
                        </p>

                        {alerts?.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                                <p className="text-xs font-bold text-slate-700">All Stock Levels Normal</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">No products are currently breaching their low stock threshold.</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5 sm:space-y-3">
                                {alerts?.items.map((alert) => (
                                    <div key={alert.id} className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-rose-50/40 border border-rose-100">
                                        <div className="space-y-0.5 min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-900 truncate">{alert.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate">{alert.category}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-black whitespace-nowrap ${
                                                alert.status === "OUT_OF_STOCK" ? "bg-rose-600 text-white" : "bg-amber-100 text-amber-800"
                                            }`}>
                                                {alert.status === "OUT_OF_STOCK" ? "OUT OF STOCK" : `${alert.remaining} left`}
                                            </span>
                                            <p className="text-[10px] text-slate-400 mt-1 whitespace-nowrap">Threshold: {alert.threshold}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};