
"use client";

import { Check, Clock, XCircle, Eye, MessageSquareText } from "lucide-react";
import { SubscriptionPayment } from "../../types/subscription";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Mini component to safely handle hook states (like Dialogs) inside table cells
const ActionCell = ({
    row,
}: {
    row: SubscriptionPayment;
}) => {
    return (
        <div className="flex items-center gap-1.5">

            {/* 1. View Remarks (ONLY for Rejected Payments with remarks) */}
            {row.status === "REJECTED" && row.remarks && (
                <Dialog>
                    <DialogTrigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="View Rejection Reason"
                        >
                            <MessageSquareText className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-rose-600">
                                <XCircle className="h-5 w-5" /> Payment Rejected
                            </DialogTitle>
                            <DialogDescription>
                                The admin provided the following reason for rejecting this payment slip:
                            </DialogDescription>
                        </DialogHeader>
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm font-medium text-rose-800 mt-2">
                            {row.remarks}
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* 2. View Receipt Modal (Available for all statuses) */}
            {row.receiptUrl && (
                <Dialog>
                    <DialogTrigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="View Receipt"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl p-6 bg-white rounded-2xl shadow-2xl border border-slate-100">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-base font-bold text-slate-900">Payment Receipt</DialogTitle>
                            <DialogDescription>
                                Uploaded receipt proof for transaction verification.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="relative flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                            {row.receiptUrl.endsWith(".pdf") ? (
                                <iframe src={row.receiptUrl} className="w-full h-125 rounded-lg bg-white" />
                            ) : (
                                <img
                                    src={row.receiptUrl}
                                    alt="Payment Receipt"
                                    className="w-full max-h-[70vh] object-contain rounded-lg shadow-sm bg-white"
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

// Column Generator no longer requires onDelete
export const getBillingColumns = (): ColumnDef<SubscriptionPayment>[] => [
    {
        header: "Billing Month",
        render: (row) => {
            const date = new Date(row.createdAt);
            const month = date.toLocaleDateString("en-US", { month: "long" });
            const year = date.getFullYear();
            return (
                <div>
                    <p className="font-bold text-slate-900">{month}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase">{year}</p>
                </div>
            );
        },
    },
    {
        header: "Amount Paid",
        render: (row) => (
            <span className="font-bold text-slate-900">
                Rs {row.amountPaid.toLocaleString("en-PK")}
            </span>
        ),
    },
    {
        header: "Tier / Cycle",
        render: (row) => (
            <div>
                <p className="text-xs font-bold text-slate-900 uppercase">{row.tier}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase">{row.cycle}</p>
            </div>
        ),
    },
    {
        header: "Status",
        render: (row) => {
            if (row.status === "REJECTED") {
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-100">
                        <XCircle className="h-3 w-3" /> Rejected
                    </span>
                );
            }
            if (row.status === "PENDING") {
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100">
                        <Clock className="h-3 w-3" /> Verifying...
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                    <Check className="h-3 w-3" /> Approved
                </span>
            );
        },
    },
    {
        header: "Type",
        render: (row) => (
            <span className="text-xs font-bold text-slate-600">
                {row.paymentMethod}
            </span>
        ),
    },
    {
        header: "Transaction ID",
        render: (row) => (
            row.transactionId ? (
                <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                    {row.transactionId}
                </span>
            ) : (
                <span className="text-slate-300">—</span>
            )
        ),
    },
    {
        header: "Actions",
        render: (row) => <ActionCell row={row} />,
    },
];