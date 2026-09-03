"use client";

import { useState, useEffect } from "react";
import { Search, Printer, PackagePlus, RotateCcw, CheckCircle2, Clock, Pencil } from "lucide-react";
import { toast } from "sonner";

import { PurchaseOrder, POStatus } from "../api/use-purchase-orders";
import { generatePOPdf } from "@/utils/generate-po-pdf";
import { Button } from "@/components/ui/button";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FilterType = "ALL" | POStatus;

export function POTable({ orders, onEdit }: { orders: PurchaseOrder[], onEdit: (po: PurchaseOrder) => void }) {
    const [localOrders, setLocalOrders] = useState<PurchaseOrder[]>([]);

    useEffect(() => {
        setLocalOrders(orders);
    }, [orders]);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<FilterType>("ALL");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

    const filteredOrders = localOrders.filter((o) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            o.poNumber.toLowerCase().includes(searchLower) ||
            o.supplierName.toLowerCase().includes(searchLower) ||
            o.items.some(i => i.description.toLowerCase().includes(searchLower));

        if (statusFilter !== "ALL") return matchesSearch && o.status === statusFilter;
        return matchesSearch;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const handleReceiveClick = (po: PurchaseOrder) => {
        setSelectedPO(po);
        setConfirmModalOpen(true);
    };

    const confirmReceive = () => {
        if (!selectedPO) return;
        setLocalOrders(prev => prev.map(o => o.id === selectedPO.id ? { ...o, status: "RECEIVED" } : o));
        toast.success(`Inventory for ${selectedPO.poNumber} has been updated.`);
        setConfirmModalOpen(false);
    };

    const handleUndoReceive = (po: PurchaseOrder) => {
        setLocalOrders(prev => prev.map(o => o.id === po.id ? { ...o, status: "ORDERED" } : o));
        toast.info(`Stock-in for ${po.poNumber} reversed back to Ordered.`);
    };

    const handlePrint = (po: PurchaseOrder) => {
        toast.success(`Generating PDF for ${po.poNumber}...`);
        generatePOPdf(po);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by PO #, supplier, or item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {(["ALL", "ORDERED", "RECEIVED"] as FilterType[]).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${statusFilter === filter ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {filter === "ALL" ? "All POs" : filter.toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 whitespace-nowrap">PO # & Date</th>
                            <th className="px-6 py-4 whitespace-nowrap">Supplier Firm</th>
                            <th className="px-6 py-4 whitespace-nowrap">Ordered Items</th>
                            <th className="px-6 py-4 whitespace-nowrap">Total Amount</th>
                            <th className="px-6 py-4 whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedOrders.length > 0 ? (
                            paginatedOrders.map((po) => (
                                <tr key={po.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">{po.poNumber}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(po.orderDate)}</p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">{po.supplierName}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">{po.supplierPhone}</p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {po.items.map((item, idx) => (
                                                <p key={idx} className="text-xs text-slate-600">
                                                    <span className="font-bold text-slate-900">{item.quantity}x</span> {item.description}
                                                </p>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        {formatCurrency(po.totalAmount)}
                                    </td>

                                    <td className="px-6 py-4">
                                        {po.status === "ORDERED" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-100">
                                                <Clock className="h-3 w-3" /> Ordered
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                                                <CheckCircle2 className="h-3 w-3" /> Received
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {po.status === "ORDERED" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleReceiveClick(po)}
                                                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200 h-8 text-xs font-bold shadow-none cursor-pointer"
                                                    >
                                                        <PackagePlus className="h-3.5 w-3.5 mr-1.5" /> Receive
                                                    </Button>
                                                </>
                                            )}

                                            {po.status === "RECEIVED" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleUndoReceive(po)}
                                                    className="text-slate-400 hover:text-amber-600 h-8 px-2 text-xs font-semibold cursor-pointer"
                                                >
                                                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Undo
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onEdit(po)}
                                                className="text-slate-400 hover:text-sky-600 h-8 w-8 rounded-lg cursor-pointer"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => handlePrint(po)}
                                                className="text-slate-400 hover:text-slate-700 h-8 w-8 rounded-lg cursor-pointer ml-2"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                                    No purchase orders match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-4">
                    <p className="text-xs font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{Math.min(startIndex + itemsPerPage, filteredOrders.length)}</span> of <span className="font-bold text-slate-900">{filteredOrders.length}</span> POs
                    </p>

                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline" size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 rounded-lg text-xs text-slate-700 bg-white"
                        >
                            Prev
                        </Button>

                        {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            const isActive = currentPage === pageNum;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${isActive ? "bg-sky-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <Button
                            variant="outline" size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 rounded-lg text-xs text-slate-700 bg-white"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Receive Confirmation Dialog */}
            <AlertDialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
                <AlertDialogContent className="rounded-3xl max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl">Receive Inventory?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600">
                            Are you sure you want to mark <span className="font-bold text-slate-900">{selectedPO?.poNumber}</span> as received?
                            This will immediately add the items to your plant&apos;s live stock.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="rounded-xl border-slate-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmReceive} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md">
                            Yes, Receive Items
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}