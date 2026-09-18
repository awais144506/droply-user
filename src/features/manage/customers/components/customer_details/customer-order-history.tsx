import { History, Receipt } from "lucide-react";
import { CustomerOrderHistory as CustomerOrderHistoryType } from "../../types/customer";

// Make sure your CustomerOrderHistoryType in types/customer.ts includes: type: string;
type Props = {
    orders: CustomerOrderHistoryType[];
}

const CustomerOrderHistory = ({ orders }: Props) => {
    const getStatusColor = (status?: string) => {
        switch (status?.toUpperCase()) {
            case "COMPLETED":
                return "bg-emerald-50 text-emerald-600 border-emerald-200";
            case "PENDING":
                return "bg-amber-50 text-amber-600 border-amber-200";
            case "VOIDED":
            case "CANCELLED":
                return "bg-rose-50 text-rose-600 border-rose-200";
            default:
                return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };
    return (
        <div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <History className="h-5 w-5 text-amber-600" />
                        Recent Orders
                    </h3>
                </div>

                {orders && orders.length > 0 ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3">Order No</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                                        <td className="px-4 py-3 font-medium text-sky-600">{order.orderCode}</td>

                                        {/* 🔥 Added Type Data */}
                                        <td className={`px-4 py-3 `}>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${order.type === 'WALK_IN' ? "bg-sky-100 text-sky-800" : "bg-purple-100 text-purple-800"}`}>
                                            {order.type ? order.type.replace('_', ' ') : 'N/A'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-slate-500">
                                            {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(order.createdAt))}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-900">Rs. {order.totalAmount}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status || 'COMPLETED')}`}>
                                                {order.status || 'COMPLETED'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center flex flex-col items-center">
                        <Receipt className="h-8 w-8 text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-600">No order history found</p>
                        <p className="text-xs text-slate-400 mt-1">Orders placed by this customer will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomerOrderHistory;