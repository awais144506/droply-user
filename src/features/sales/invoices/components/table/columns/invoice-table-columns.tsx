
"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { 
    FileText, 
    FileCheck2, 
    Lock, 
    ArrowRightLeft, 
    RotateCcw, 
    Download, 
    Edit, 
    Trash2, 
    Building2, 
    Phone, 
    Calendar,
} from "lucide-react";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { BillingDocument } from "../../../types/quotation";
import { formatCurrency } from "@/lib/utils/functions/setFormat";
import { formatPhoneNumber } from "react-phone-number-input";
import { Button } from "@/components/ui/button";

interface InvoiceColumnActions {
    onToggleType: (doc: BillingDocument) => void;
    onDelete: (doc: BillingDocument) => void;
    onDownloadPdf: (doc: BillingDocument) => void;
}

export const getInvoiceColumns = ({
    onToggleType,
    onDelete,
    onDownloadPdf,
}: InvoiceColumnActions): ColumnDef<BillingDocument>[] => [
    {
        header: "Doc # & Date",
        render: (doc) => {
            const isInvoice = doc.type === "INVOICE";
            return (
                <div className="flex items-start gap-2.5 py-1">
                    <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                            isInvoice
                                ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                : "bg-sky-50 text-sky-600 border-sky-100"
                        }`}
                    >
                        {isInvoice ? (
                            <FileCheck2 className="h-4 w-4" />
                        ) : (
                            <FileText className="h-4 w-4" />
                        )}
                    </div>
                    <div>
                        <span className="font-black text-slate-900 text-sm block">
                            {doc.documentNumber}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {doc.issueDate ? format(new Date(doc.issueDate), "dd MMM yyyy") : "N/A"}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        header: "Type & State",
        render: (doc) => {
            const isInvoice = doc.type === "INVOICE";
            return (
                <div className="flex flex-col items-start gap-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${
                        isInvoice
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                            : "bg-sky-50 text-sky-700 border border-sky-100"
                    }`}>
                        {isInvoice ? "Invoice" : "Quotation"}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        {isInvoice ? (
                            <>
                                <Lock className="h-2.5 w-2.5 text-amber-500" /> Locked
                            </>
                        ) : (
                            "Draft (Editable)"
                        )}
                    </span>
                </div>
            );
        },
    },
    {
        header: "Customer & Contact",
        render: (doc) => (
            <div className="max-w-55">
                <p className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5 mb-1">
                    <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.partyName}</span>
                </p>
                {doc.partyPhone ? (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{formatPhoneNumber(doc.partyPhone) || doc.partyPhone}</span>
                    </div>
                ) : (
                    <span className="text-[11px] text-slate-400 italic">No phone provided</span>
                )}
            </div>
        ),
    },
    {
        header: "Total Amount",
        render: (doc) => {
            const total = Number(doc.totalAmount || 0);
            return (
                <div className="font-bold text-slate-900 text-sm">
                    Rs {formatCurrency(total)}
                </div>
            );
        },
    },
    {
        header: "Balance Due",
        render: (doc) => {
            const balance = Number(doc.balanceDue ?? doc.totalAmount);
            const hasBalance = balance > 0;
            return (
                <div className="font-bold">
                    {hasBalance ? (
                        <span className="text-rose-600">Rs {formatCurrency(balance)}</span>
                    ) : (
                        <span className="text-emerald-600">
                            Rs 0 <span className="font-medium text-xs opacity-80">(Clear)</span>
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        header: "Actions",
        className: "text-right",
        render: (doc) => {
            const isInvoice = doc.type === "INVOICE";

            return (
                <div className="flex items-center justify-end gap-1.5">
                    {/* Toggle Type Button */}
                    {isInvoice ? (
                        <Button
                            type="button"
                            variant="warning"
                            size="xs"
                            onClick={() => onToggleType(doc)}
                            title="Revert to Quotation to unlock editing or deletion"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Revert
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="indigo"
                            size="xs"
                            onClick={() => onToggleType(doc)}
                            title="Convert to Official Tax Invoice (Locks editing)"
                        >
                            <ArrowRightLeft className="h-3.5 w-3.5" />
                            To Invoice
                        </Button>
                    )}

                    {/* Download PDF */}
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onDownloadPdf(doc)}
                        title="Download PDF"
                    >
                        <Download className="h-3.5 w-3.5" />
                    </Button>

                    {/* Edit */}
                    {isInvoice ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            disabled
                            title="Locked! Revert to Quotation first to edit."
                        >
                            <Edit className="h-3.5 w-3.5 opacity-40" />
                        </Button>
                    ) : (
                        <Link href={`/sales/invoices/${doc.id}`}>
                            <Button
                                type="button"
                                variant="default"
                                size="icon-sm"
                                title="Edit Quotation"
                            >
                                <Edit className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    )}

                    {/* Delete */}
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        disabled={isInvoice}
                        onClick={() => onDelete(doc)}
                        title={isInvoice ? "Locked! Revert to Quotation first to delete." : "Delete"}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            );
        },
    },
];