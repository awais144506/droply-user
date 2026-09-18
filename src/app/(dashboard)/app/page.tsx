"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Loader2, Calendar as CalendarIcon, DollarSign, Truck, AlertTriangle,
  Store, Clock, ArrowRight, Fuel, Receipt, ShoppingCart, UserPlus, Zap
} from "lucide-react";

import { useRole } from "@/lib/hooks/use-role";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Loading from "@/app/loading";
import WalkInSaleDialog from "@/features/dashboard/components/walk-in-sale-dialog";

export default function DashboardPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);

  // MOCK DATA: To be replaced with actual API calls
  const isLoading = false;
  const metrics = {
    todaySales: 45200,
    walkInOrders: 18,
    deliveryOrders: 42,
    pendingDeliveries: 5,
    cashToCollect: 12500,
    expenses: {
      fuel: 4500,
      pettyCash: 1200,
    },
    purchaseOrders: {
      total: 12,
      pending: 4,
      completed: 8,
    }
  };

  const lowStockItems = [
    { id: 1, name: "19L Mineral Water Bottle", currentStock: 12, threshold: 20 },
    { id: 2, name: "500ml Water (Pack of 24)", currentStock: 5, threshold: 15 },
  ];

  if (isTenantLoading || isLoading) return <Loading />
  return (
    <>
      <div className="space-y-6 pb-12">
        {/* 1. Header & Date Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Operations Desk</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time overview of today&apos;s activities.</p>
          </div>

          {/* Actual Interactive Date Picker */}
          <Popover>
            <PopoverTrigger>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-medium bg-white border-slate-200",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-sky-600" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 2. Key Actionable Metrics (3-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Revenue */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Today&lsquo;s Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Rs {metrics.todaySales.toLocaleString()}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          {/* Orders Breakdown */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Orders</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.walkInOrders + metrics.deliveryOrders}</h3>
                <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">
                  <span className="text-sky-600">{metrics.walkInOrders} Walk-in</span> • {metrics.deliveryOrders} Delivery
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                <Store className="h-5 w-5 text-sky-600" />
              </div>
            </CardContent>
          </Card>

          {/* Expenses (Combined Fuel & Petty Cash) */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Daily Expenses</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    Rs {(metrics.expenses.fuel + metrics.expenses.pettyCash).toLocaleString()}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <Receipt className="h-5 w-5 text-rose-600" />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <Fuel className="h-3.5 w-3.5 text-slate-400" /> Fuel: {metrics.expenses.fuel}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <Receipt className="h-3.5 w-3.5 text-slate-400" /> Petty: {metrics.expenses.pettyCash}
                </div>
              </div>
            </CardContent>
          </Card>



          {/* Recovery */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Sales Return & Recovery</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Rs {metrics.cashToCollect.toLocaleString()}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Purchase Orders</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.purchaseOrders.total}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-[11px] font-semibold uppercase tracking-wide">
                <span className="text-amber-600">{metrics.purchaseOrders.pending} Pending</span>
                <span className="text-emerald-600">{metrics.purchaseOrders.completed} Completed</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* 3. Operational Grid (Actions + Alerts) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-sky-200 bg-sky-50 shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-sky-100 bg-white">
                <CardTitle className="text-sm font-bold text-sky-900">Over-the-Counter</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Button
                  onClick={() => setIsQuickSaleOpen(true)}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white h-14 text-lg shadow-sm"
                >
                  <Zap className="mr-2 h-5 w-5" /> Quick Sale
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 bg-white border-sky-200 text-sky-700 hover:bg-sky-100 px-2 text-xs">
                    <UserPlus className="mr-1.5 h-4 w-4" /> New Customer
                  </Button>
                  <Button variant="outline" className="h-12 bg-white border-sky-200 text-sky-700 hover:bg-sky-100 px-2 text-xs">
                    <Truck className="mr-1.5 h-4 w-4" /> Dispatch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Alerts */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200 h-full">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                    Low Stock Alerts
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500">
                    View Inventory <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {lowStockItems.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {lowStockItems.map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Threshold: {item.threshold} units</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black bg-rose-100 text-rose-700 border border-rose-200">
                            {item.currentStock} left
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <p className="text-sm">All products are sufficiently stocked.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <WalkInSaleDialog
        isOpen={isQuickSaleOpen}
        onClose={() => setIsQuickSaleOpen(false)}
      />
    </>
  );
}