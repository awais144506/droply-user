"use client";
import { useState } from "react";
import { History, Receipt, ChevronLeft, ChevronRight } from "lucide-react";
import { CustomerOrderHistory as CustomerOrderHistoryType } from "../../types/customer";

type Props = {
    orders: CustomerOrderHistoryType[];
}

const ITEMS_PER_PAGE = 10;

const CustomerOrderHistory = ({ orders }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);

    const getStatusColor = (status?: string) => {
        switch (status?.toUpperCase()) {
            case "COMPLETED":
                return "bg-emerald-50 text-emerald-600 border-emerald-200";
            case "PENDING":
            case "ASSIGNED":
            case "ON_ROUTE":
            case "ARRIVED":
                return "bg-amber-50 text-amber-600 border-amber-200";
            case "CANCELLED":
                return "bg-rose-50 text-rose-600 border-rose-200";
            default:
                return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    // Pagination calculations
    const totalItems = orders?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentOrders = orders?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    return (
        <div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <History className="h-5 w-5 text-amber-600" />
                        Recent Orders
                    </h3>
                    {totalItems > 0 && (
                        <span className="text-xs font-semibold text-slate-400">
                            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}
                        </span>
                    )}
                </div>

                {currentOrders.length > 0 ? (
                    <div className="space-y-4">
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
                                    {currentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                                            <td className="px-4 py-3 font-medium text-sky-600">{order.orderCode}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${order.type === 'WALK_IN' ? "bg-sky-100 text-sky-800 border-sky-200" : "bg-purple-100 text-purple-800 border-purple-200"}`}>
                                                    {order.type ? order.type.replace('_', ' ') : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 text-xs">
                                                {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(order.createdAt))}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900">Rs. {order.totalAmount}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-slate-500 font-medium">
                                    Page <span className="font-bold text-slate-800">{currentPage}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handlePrevious}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
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
    );
}

export default CustomerOrderHistory;