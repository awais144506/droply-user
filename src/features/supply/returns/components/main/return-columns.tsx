// return-columns.tsx
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { formatCurrency } from "@/lib/utils/functions/setFormat";
import { Button } from "@/components/ui/button";
import { PurchaseReturn } from "../../types/returns";
import { format } from "date-fns";
import {
    Clock,
    CheckCircle2,
    Package,
    Printer,
    Trash2
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface ReturnActionHandlers {
    onResolve: (returnRecord: PurchaseReturn) => void;
    onPrint: (returnRecord: PurchaseReturn) => void;
    onWhatsApp: (returnRecord: PurchaseReturn) => void;
    onDelete: (returnRecord: PurchaseReturn) => void;
}

export const getReturnColumns = (
    router: AppRouterInstance,
    handlers: ReturnActionHandlers
): ColumnDef<PurchaseReturn>[] => [
        {
            header: "DEBIT NOTE #",
            render: (record) => (
                <div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{record.debitNoteNumber}</p>
                    <p className="text-xs text-slate-500 font-medium">
                        {format(new Date(record.returnDate), "MMM d, yyyy")}
                    </p>
                </div>
            ),
        },
        {
            header: "SUPPLIER FIRM",
            render: (record) => (
                <div>
                    <p className="font-bold text-slate-900 text-sm mb-1">
                        {record.supplier?.firmName || "Unknown Supplier"}
                    </p>
                    <p className="text-xs text-slate-400 font-medium truncate max-w-50">
                        Ref: {record.purchaseOrder?.poNumber || "N/A"}
                    </p>
                </div>
            ),
        },
        {
            header: "RETURNED ITEMS",
            render: (record) => {
                if (!record.items || record.items.length === 0) return <span className="text-slate-400">-</span>;

                const firstItem = record.items[0];
                const extraCount = record.items.length - 1;

                return (
                    <div className="text-sm font-medium text-slate-600 truncate max-w-62.5">
                        <span className="text-rose-600 font-bold mr-1">-{firstItem.quantityReturned}x</span>
                        {firstItem.supplierItemName}
                        {extraCount > 0 && (
                            <span className="text-xs text-slate-400 ml-1 italic">
                                (+{extraCount} more)
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "TOTAL VALUE",
            render: (record) => (
                <span className="font-bold text-slate-900 text-sm">
                    Rs {formatCurrency(record.totalValue)}
                </span>
            ),
        },
        {
            header: "STATUS",
            render: (record) => {
                if (record.status === "PENDING_RESOLUTION") {
                    return (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200">
                            <Clock className="h-3.5 w-3.5" />
                            Pending Resolution
                        </span>
                    );
                }
                if (record.status === "CREDIT_APPLIED") {
                    return (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Credit Applied
                        </span>
                    );
                }
                if (record.status === "REPLACED") {
                    return (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-sky-50 text-sky-700 border-sky-200">
                            <Package className="h-3.5 w-3.5" />
                            Replaced
                        </span>
                    );
                }

                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Mixed Resolution
                    </span>
                );
            },
        },
        {
            header: "ACTIONS",
            className: "text-right",
            render: (record) => (
                <div className="flex justify-end items-center gap-1">
                    {record.status === "PENDING_RESOLUTION" && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handlers.onResolve(record); }}
                            className="h-8 text-sky-700 border-sky-200 bg-sky-50 hover:bg-sky-100 hover:text-sky-800 mr-2"
                        >
                            Resolve Case
                        </Button>
                    )}

                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handlers.onPrint(record); }} className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <Printer className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handlers.onWhatsApp(record); }} className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                        <FaWhatsapp className="h-4 w-4 text-green-600" />
                    </Button>

                    {/* Safety Lock: Only allow deletion if the return is still pending resolution */}
                    {record.status === "PENDING_RESOLUTION" && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); handlers.onDelete(record); }}
                            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ),
        }
    ];