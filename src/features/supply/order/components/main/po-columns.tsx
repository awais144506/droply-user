import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { formatCurrency, displayPakistaniPhone } from "@/lib/utils/functions/setFormat";
import { Button } from "@/components/ui/button";
import { PurchaseOrder } from "../../types/po";
import { Printer, MessageCircle, Edit2, PackagePlus, RotateCcw, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface POActionHandlers {
    onReceive: (po: PurchaseOrder) => void;
    onUndo: (po: PurchaseOrder) => void;
    onPrint: (po: PurchaseOrder) => void;
    onWhatsApp: (po: PurchaseOrder) => void;
    onEdit: (po: PurchaseOrder) => void;
}

export const getPOColumns = (
    router: AppRouterInstance,
    handlers: POActionHandlers,
    isOwner: boolean,
    isManager: boolean,
): ColumnDef<PurchaseOrder>[] => [
        {
            header: "PO # & Date",
            render: (po) => (
                <div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{po.poNumber}</p>
                    <p className="text-xs text-slate-500 font-medium">
                        {format(new Date(po.orderDate), "MMM d, yyyy")}
                    </p>
                </div>
            ),
        },
        {
            header: "Supplier Firm",
            render: (po) => (
                <div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{po.supplier?.firmName || "Unknown"}</p>
                    <p className="text-xs text-slate-500 font-medium">
                        {po.supplier?.phone ? displayPakistaniPhone(po.supplier.phone) : "N/A"}
                    </p>
                </div>
            ),
        },
        {
            header: "Ordered Items",
            render: (po) => (
                <div className="space-y-1">
                    {po.items?.map((item, idx) => (
                        <p key={item.id || idx} className="text-xs text-slate-600 font-medium">
                            <span className="font-bold text-slate-900">{item.quantity}x</span> {item.supplierItemName}
                        </p>
                    ))}
                </div>
            ),
        },
        {
            header: "Total Amount",
            render: (po) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-sm">Rs {formatCurrency(po.totalAmount)}</span>
                    <span className=" text-emerald-600 text-[10px] font-bold">Advance: Rs {formatCurrency(po.advancePaid)}</span>
                </div>
            ),
        },
        {
            header: "Balance",
            render: (po) => (
                <div>
                    <span className=" text-rose-600 font-bold">Rs {formatCurrency(po.balanceDue)}</span>
                </div>
            ),
        },
        {
            header: "Status",
            render: (po) => {
                const statusStyles = {
                    ORDERED: "bg-sky-50 text-sky-700 border-sky-200",
                    PENDING_RESTOCK: "bg-amber-50 text-amber-700 border-amber-200",
                    RECEIVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                };

                const StatusIcon =
                    po.status === "ORDERED" ? Clock :
                        po.status === "PENDING_RESTOCK" ? AlertCircle : CheckCircle2;

                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyles[po.status]}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {po.status.replace("_", " ")}
                    </span>
                );
            },
        },
        {
            header: "Actions",
            className: "text-right",
            render: (po) => {
                ;

                return (
                    <div className="flex justify-end items-center gap-1">

                        {/* MANAGER FLOW: Can only transition ORDERED -> PENDING_RESTOCK */}
                        {po.status === "ORDERED" && isManager && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handlers.onReceive(po); }}
                                className="h-8 text-sky-600 border-sky-200 hover:bg-sky-50 mr-2"
                            >
                                <PackagePlus className="h-4 w-4 mr-1.5" /> Mark Arrived
                            </Button>
                        )}

                        {po.status === "PENDING_RESTOCK" && isManager && (
                            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded mr-2">
                                Awaiting Owner
                            </span>
                        )}

                        {/* OWNER FLOW: Can directly restock ORDERED, or confirm PENDING_RESTOCK */}
                        {po.status === "ORDERED" && isOwner && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handlers.onReceive(po); }}
                                className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 mr-2"
                            >
                                <PackagePlus className="h-4 w-4 mr-1.5" /> Receive & Restock
                            </Button>
                        )}

                        {po.status === "PENDING_RESTOCK" && isOwner && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handlers.onReceive(po); }}
                                className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 mr-2 shadow-sm shadow-emerald-100"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-1.5" /> Confirm Stock
                            </Button>
                        )}

                        {/* UNDO LOGIC: Exclusively for Owners */}
                        {po.status === "RECEIVED" && isOwner && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handlers.onUndo(po); }}
                                className="h-8 text-amber-600 hover:text-rose-600 hover:bg-rose-50 mr-2"
                            >
                                <RotateCcw className="h-4 w-4 mr-1.5" /> Undo
                            </Button>
                        )}

                        {/* Standard Utilities */}
                        {po.status == "ORDERED" && (
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handlers.onEdit(po); }} className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        )}

                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handlers.onPrint(po); }} className="h-8 w-8 text-slate-400 hover:text-slate-600">
                            <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handlers.onWhatsApp(po); }} className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                            <MessageCircle className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        }
    ];