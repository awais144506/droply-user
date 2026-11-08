"use client";

import React, { useMemo } from "react";
import { Store, Truck, Clock, Navigation, CheckCircle2, XCircle, MapPin } from "lucide-react";
import { OrderResponse } from "../types/order";

type Props = {
    orders?: OrderResponse[] | undefined;
};

const OrderStats = ({ orders = [] }: Props) => {
    const stats = useMemo(() => {
        let walkInCount = 0;
        const walkInStatuses = {
            COMPLETED: 0,
            CANCELLED: 0,
        };

        let deliveryCount = 0;
        const deliveryStatuses = {
            PENDING: 0,
            ON_ROUTE: 0,
            ARRIVED: 0,
            COMPLETED: 0,
            CANCELLED: 0,
        };

        orders.forEach((order) => {
            if (order.category === "WALK_IN") {
                walkInCount++;
                if (order.status in walkInStatuses) {
                    walkInStatuses[order.status as keyof typeof walkInStatuses]++;
                }
            } else if (order.category === "DELIVERY") {
                deliveryCount++;
                if (order.status in deliveryStatuses) {
                    deliveryStatuses[order.status as keyof typeof deliveryStatuses]++;
                }
            }
        });

        return {
            walkInCount,
            walkInStatuses,
            deliveryCount,
            deliveryStatuses,
        };
    }, [orders]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 1. Walk-In Orders Card */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Walk-In Sales
                        </p>
                        <h3 className="text-3xl font-black text-slate-900">
                            {stats.walkInCount}
                        </h3>
                    </div>
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Store className="w-6 h-6" />
                    </div>
                </div>

                {/* Walk-In Sub-Status Grid */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                    <div className="text-center p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-700 uppercase mb-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                        </div>
                        <span className="text-sm font-extrabold text-emerald-900">
                            {stats.walkInStatuses.COMPLETED}
                        </span>
                    </div>

                    <div className="text-center p-2 rounded-xl bg-rose-50/60 border border-rose-100">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-rose-700 uppercase mb-0.5">
                            <XCircle className="w-3 h-3" /> Cancelled
                        </div>
                        <span className="text-sm font-extrabold text-rose-900">
                            {stats.walkInStatuses.CANCELLED}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. Delivery Orders Card (With Status Breakdown, excluding Assigned) */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Route Deliveries
                        </p>
                        <h3 className="text-3xl font-black text-slate-900">
                            {stats.deliveryCount}
                        </h3>
                    </div>
                    <div className="p-4 bg-sky-50 text-sky-600 rounded-xl">
                        <Truck className="w-6 h-6" />
                    </div>
                </div>

                {/* Sub-Status Grid (5 columns since Assigned was removed) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-slate-100">
                    <div className="text-center p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-700 uppercase mb-0.5">
                            <Clock className="w-3 h-3" /> Pending
                        </div>
                        <span className="text-sm font-extrabold text-amber-900">
                            {stats.deliveryStatuses.PENDING}
                        </span>
                    </div>

                    <div className="text-center p-2 rounded-xl bg-sky-50/60 border border-sky-100">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-sky-700 uppercase mb-0.5">
                            <Navigation className="w-3 h-3" /> Route
                        </div>
                        <span className="text-sm font-extrabold text-sky-900">
                            {stats.deliveryStatuses.ON_ROUTE}
                        </span>
                    </div>

                    <div className="text-center p-2 rounded-xl bg-purple-50/60 border border-purple-100">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-purple-700 uppercase mb-0.5">
                            <MapPin className="w-3 h-3" /> Arrived
                        </div>
                        <span className="text-sm font-extrabold text-purple-900">
                            {stats.deliveryStatuses.ARRIVED}
                        </span>
                    </div>

                    <div className="text-center p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-700 uppercase mb-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Done
                        </div>
                        <span className="text-sm font-extrabold text-emerald-900">
                            {stats.deliveryStatuses.COMPLETED}
                        </span>
                    </div>

                    <div className="text-center p-2 rounded-xl bg-rose-50/60 border border-rose-100 col-span-2 sm:col-span-1">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-rose-700 uppercase mb-0.5">
                            <XCircle className="w-3 h-3" /> Cancel
                        </div>
                        <span className="text-sm font-extrabold text-rose-900">
                            {stats.deliveryStatuses.CANCELLED}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStats;