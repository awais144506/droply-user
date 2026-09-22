import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { formatCurrency } from "@/lib/utils/functions/setFormat";
import { Button } from "@/components/ui/button";
import { SupplierPayment } from "../../types/payments";
import { format } from "date-fns";
import { 
    Landmark, 
    Banknote, 
    Receipt, 
    CheckCircle2, 
    Clock, 
    Edit2, 
    Trash2, 
    Printer, 
    MessageCircle 
} from "lucide-react";

interface PaymentActionHandlers {
    onEdit: (payment: SupplierPayment) => void;
    onDelete: (payment: SupplierPayment) => void;
    onPrint: (payment: SupplierPayment) => void;
    onWhatsApp: (payment: SupplierPayment) => void;
}

export const getPaymentColumns = (
    router: AppRouterInstance,
    handlers: PaymentActionHandlers
): ColumnDef<SupplierPayment>[] => [
        {
            header: "Voucher # & Date",
            render: (payment) => (
                <div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{payment.voucherNumber}</p>
                    <p className="text-xs text-slate-500 font-medium">
                        {format(new Date(payment.paymentDate), "MMM d, yyyy")}
                    </p>
                </div>
            ),
        },
        {
            header: "Supplier Firm",
            render: (payment) => (
                <div>
                    <p className="font-bold text-slate-900 text-sm mb-1">
                        {payment.supplier?.firmName || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-37.5">
                        {payment.supplier?.supplierName}
                    </p>
                </div>
            ),
        },
        {
            header: "Payment Method",
            render: (payment) => {
                const MethodIcon = payment.paymentMethod === "BANK_TRANSFER" ? Landmark 
                                 : payment.paymentMethod === "CASH" ? Banknote 
                                 : Receipt;
                
                const methodLabel = payment.paymentMethod.replace("_", " ");

                return (
                    <div>
                        <p className="flex items-center gap-1.5 font-bold text-slate-700 text-sm mb-1 capitalize">
                            <MethodIcon className="h-3.5 w-3.5 text-sky-600" />
                            {methodLabel.toLowerCase()}
                        </p>
                        {payment.referenceNote && (
                            <p className="text-xs text-slate-500 font-medium truncate max-w-45">
                                {payment.referenceNote}
                            </p>
                        )}
                    </div>
                );
            },
        },
        {
            header: "PO Ref",
            render: (payment) => (
                <button 
                    onClick={() => router.push(`/supply/order/${payment.poId}`)}
                    className="font-bold text-sky-600 text-sm hover:underline text-left"
                >
                    {payment.purchaseOrder?.poNumber || "N/A"}
                </button>
            ),
        },
        {
            header: "Total Amount",
            render: (payment) => (
                <span className="font-bold text-slate-900 text-sm">
                    Rs {formatCurrency(payment.purchaseOrder?.totalAmount || 0)}
                </span>
            ),
        },
        {
            header: "Amount Paid",
            render: (payment) => (
                <span className="font-bold text-emerald-600 text-sm">
                    Rs {formatCurrency(payment.amountPaid)}
                </span>
            ),
        },
        {
            header: "Remaining",
            render: (payment) => {
                const remaining = payment.purchaseOrder?.balanceDue || 0;
                return (
                    <span className={`font-bold text-sm ${remaining > 0 ? "text-rose-600" : "text-slate-400"}`}>
                        Rs {formatCurrency(remaining)}
                    </span>
                );
            },
        },
        {
            header: "Status",
            render: (payment) => {
                const isCleared = payment.status === "CLEARED";
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        isCleared 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                        {isCleared ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                        {payment.status === "CLEARED" ? "Cleared" : "Partial"}
                    </span>
                );
            },
        },
        {
            header: "Actions",
            className: "text-right",
            render: (payment) => (
                <div className="flex justify-end items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handlers.onEdit(payment); }} className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handlers.onPrint(payment); }} className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handlers.onWhatsApp(payment); }} className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                        <MessageCircle className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }
    ];