"use client";

import { FileText, Clock, PackageCheck, Banknote } from "lucide-react";
import { PurchaseOrder } from "../api/use-purchase-orders";

export function POStats({ orders }: { orders: PurchaseOrder[] }) {
    const totalVolume = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const activeOrders = orders.filter(o => o.status === "ORDERED").length;
    const completedOrders = orders.filter(o => o.status === "RECEIVED").length;
    const pendingValue = orders.filter(o => o.status === "ORDERED").reduce((acc, o) => acc + o.totalAmount, 0);

    const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total PO Volume</p>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                            <FileText className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalVolume)}</p>
                </div>
                <p className="text-[11px] font-medium text-slate-400 mt-4">Across all logged orders</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending PO Value</p>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                            <Banknote className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{formatCurrency(pendingValue)}</p>
                </div>
                <p className="text-[11px] font-medium text-amber-600 mt-4">Value of incoming shipments</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Orders</p>
                        <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
                            <Clock className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-sky-600">{activeOrders} <span className="text-sm font-medium text-slate-400">POs</span></p>
                </div>
                <p className="text-[11px] font-medium text-sky-600 mt-4">Awaiting plant gate arrival</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Stock-Ins</p>
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <PackageCheck className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{completedOrders} <span className="text-sm font-medium text-slate-400">Shipments</span></p>
                </div>
                <p className="text-[11px] font-medium text-emerald-600 mt-4">Inventory successfully synced</p>
            </div>


        </div>
    );
}