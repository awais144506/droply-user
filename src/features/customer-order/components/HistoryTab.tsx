/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { History, Receipt, RotateCw, CalendarClock } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerOrderRequest } from "../types/customerOrder";

interface HistoryTabProps {
    history: CustomerOrderRequest[];
    onRefresh: () => Promise<any>;
}

export function HistoryTab({ history, onRefresh }: HistoryTabProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const formatScheduleDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) return `Today, ${format(date, 'MMM dd')}`;
        if (isTomorrow(date)) return `Tomorrow, ${format(date, 'MMM dd')}`;
        return format(date, 'MMM dd, yyyy');
    };

    if (history.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recent Orders</h3>
                    <button onClick={handleRefresh} className="p-1 text-slate-400 hover:text-sky-600 transition-colors">
                        <RotateCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-sky-600" : ""}`} />
                    </button>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
                    <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        <History className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="font-bold text-slate-700">No Orders yet</h4>
                    <p className="text-xs font-medium text-slate-500 mt-1">Your orders will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recent Orders</h3>
                <button onClick={handleRefresh} className="p-1 text-slate-400 hover:text-sky-600 transition-colors">
                    <RotateCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-sky-600" : ""}`} />
                </button>
            </div>
            
            {history.map((order) => {
                let badgeColor = "bg-sky-50 text-sky-700 border-sky-200";
                if (order.status === "PENDING") badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                if (order.status === "COMPLETED") badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                if (order.status === "CANCELLED") badgeColor = "bg-rose-50 text-rose-700 border-rose-200";

                return (
                    <Card key={order.id} className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-slate-50 p-3 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Receipt className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-700">{order.orderId}</span>
                                </div>
                                <Badge variant="outline" className={`${badgeColor} text-[10px] uppercase font-bold tracking-wider`}>
                                    {order.status}
                                </Badge>
                            </div>
                            <div className="p-4 space-y-3">
                                
                                <div className="flex flex-col gap-2 border-b border-slate-100 pb-3">
                                    <div className="text-[11px] font-semibold text-slate-400">
                                        Requested on: {format(new Date(order.createdAt), 'MMM dd, yyyy - p')}
                                    </div>
                                    {/* 🔥 Added Scheduled Date display here */}
                                    <div className="flex items-center gap-1.5 text-sky-700 bg-sky-50 w-fit px-2 py-1 rounded-md text-xs font-bold border border-sky-100/50">
                                        <CalendarClock className="w-3.5 h-3.5" />
                                        Delivery for: {formatScheduleDate(order.scheduleDate)}
                                    </div>
                                </div>

                                <div className="space-y-1.5 pt-1">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="font-bold text-slate-700">{item.quantity}x {item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}