"use client";

import React from "react";
import { DollarSign, ShoppingBag, Truck, TrendingUp, Layers, PackageOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DailySalesResponse } from "../types/daily";

type Props = {
    kpis?: DailySalesResponse["kpis"];
};

export const DailySalesKpiCards = ({ kpis }: Props) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="rounded-2xl border-slate-200 shadow-xs bg-linear-to-br from-emerald-50/60 via-white to-white">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cash Inflow</p>
                        <p className="text-3xl font-black text-emerald-600 mt-1">
                            Rs. {(kpis?.totalCashInflow || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> Collected across all channels
                        </p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <DollarSign className="w-7 h-7" />
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-xs bg-linear-to-br from-sky-50/60 via-white to-white">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders Handled</p>
                        <p className="text-3xl font-black text-sky-600 mt-1">
                            {kpis?.totalOrdersHandled || 0} <span className="text-sm font-normal text-slate-500">ops</span>
                        </p>
                        <p className="text-xs text-sky-700 font-semibold mt-2 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" /> Walk-ins, Deliveries & Returns
                        </p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                        <ShoppingBag className="w-7 h-7" />
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-xs bg-linear-to-br from-indigo-50/60 via-white to-white">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Stock Out (Volume)</p>
                        <p className="text-3xl font-black text-indigo-600 mt-1">
                            {kpis?.netStockOut || 0} <span className="text-sm font-normal text-slate-500">units</span>
                        </p>
                        <p className="text-xs text-indigo-700 font-semibold mt-2 flex items-center gap-1">
                            <PackageOpen className="w-3.5 h-3.5" /> {kpis?.stockSentOut || 0} sent out vs {kpis?.stockReturned || 0} returned
                        </p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Truck className="w-7 h-7" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};