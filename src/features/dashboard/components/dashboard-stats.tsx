
import {
    DollarSign,
    Store, Clock, Fuel, Receipt, ShoppingCart
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

const DashboardStats = () => {
    return (
        <>   {/* Revenue */}
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
        </>
    )
}

export default DashboardStats