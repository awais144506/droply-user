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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Category Breakdown */}
            <Card className="rounded-2xl border-slate-200 shadow-xs">
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
                                <p className="text-xs text-slate-500">{walkIn.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-sm font-black text-slate-900">Rs. {walkIn.amount.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Deliveries</p>
                                <p className="text-xs text-slate-500">{delivery.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-sm font-black text-slate-900">Rs. {delivery.amount.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                                <RefreshCw className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Sale Returns (Defective)</p>
                                <p className="text-xs text-slate-500">{saleReturn.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-sm font-black text-rose-600">-Rs. {saleReturn.amount.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recovery (Ledger / Assets)</p>
                                <p className="text-xs text-slate-500">{recovery.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-sm font-black text-indigo-600">Rs. {recovery.amount.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Sales (POS Unregistered)</p>
                                <p className="text-xs text-slate-500">{quickSale.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-sm font-black text-amber-600">Rs. {quickSale.amount.toLocaleString()}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Right: Stock-Out & Inventory Alert Monitor */}
            <Card className="rounded-2xl border-slate-200 shadow-xs">
                <CardHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-600" /> Stock-Out & Low Inventory Alerts
                    </CardTitle>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        (alerts?.criticalCount || 0) > 0 
                            ? "bg-rose-50 text-rose-600 border-rose-200" 
                            : "bg-emerald-50 text-emerald-600 border-emerald-200"
                    }`}>
                        {alerts?.criticalCount || 0} Critical Items
                    </span>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <p className="text-xs text-slate-500">
                            The following items have reached zero stock or fallen below their safety threshold due to dispatch volume:
                        </p>

                        {alerts?.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                                <p className="text-xs font-bold text-slate-700">All Stock Levels Normal</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">No products are currently breaching their low stock threshold.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {alerts?.items.map((alert) => (
                                    <div key={alert.id} className="flex items-center justify-between p-4 rounded-xl bg-rose-50/40 border border-rose-100">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-slate-900">{alert.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{alert.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black ${
                                                alert.status === "OUT_OF_STOCK" ? "bg-rose-600 text-white" : "bg-amber-100 text-amber-800"
                                            }`}>
                                                {alert.status === "OUT_OF_STOCK" ? "OUT OF STOCK" : `${alert.remaining} left`}
                                            </span>
                                            <p className="text-[10px] text-slate-400 mt-1">Threshold: {alert.threshold}</p>
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