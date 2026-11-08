/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { formatCurrency } from "@/lib/utils/functions/setFormat";
import { Button } from "@/components/ui/button";
import { Expense, ExpenseType, ExpensePaymentType } from "../types/expenses";
import { format } from "date-fns";
import {
    Trash2,
    Coffee,
    Zap,
    Wrench,
    Paperclip,
    Truck,
    Wallet,
    Landmark
} from "lucide-react";

interface ExpenseActionHandlers {
    onDelete: (expense: Expense) => void;
}

export const getExpenseColumns = (
    handlers: ExpenseActionHandlers,
    isOwner: boolean,
): ColumnDef<Expense>[] => [
        {
            header: "DATE",
            render: (exp) => (
                <span className="text-sm font-medium text-slate-900">
                    {/* Assumes a createdAt field from Prisma; fallbacks to current date for type safety if missing */}
                    {format(new Date((exp as any).createdAt || Date.now()), "MMM d, yyyy")}
                </span>
            ),
        },
        {
            header: "CATEGORY",
            render: (exp) => {
                const categoryConfig = {
                    [ExpenseType.REFRESHMENT]: { style: "bg-orange-50 text-orange-700 border-orange-100", icon: Coffee, label: "Refreshments" },
                    [ExpenseType.UTILITY]: { style: "bg-amber-50 text-amber-700 border-amber-100", icon: Zap, label: "Utilities" },
                    [ExpenseType.MAINTENANCE]: { style: "bg-slate-100 text-slate-700 border-slate-200", icon: Wrench, label: "Maintenance" },
                    [ExpenseType.BRANCH]: { style: "bg-sky-50 text-sky-700 border-sky-100", icon: Paperclip, label: "Office Supplies" },
                    [ExpenseType.LOGISTIC]: { style: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: Truck, label: "Logistics & Tolls" },
                };

                const config = categoryConfig[exp.type];
                const Icon = config.icon;

                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${config.style}`}>
                        <Icon className="h-3 w-3" />
                        {config.label}
                    </span>
                );
            },
        },
        {
            header: "DESCRIPTION",
            render: (exp) => (
                <span className="text-sm text-slate-600 font-medium">
                    {exp.description}
                </span>
            ),
        },
        {
            header: "PAYMENT / LOGGER",
            render: (exp) => {
                const isCash = exp.paymentType === ExpensePaymentType.CASH;
                const PaymentIcon = isCash ? Wallet : Landmark;
                return (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs mb-0.5">
                            <PaymentIcon className={`h-3.5 w-3.5 ${isCash ? "text-amber-600" : "text-sky-600"}`} />
                            {isCash ? "CASH" : "BANK TRANSFER"}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                            By: {exp.givenBy}
                        </span>
                    </div>
                );
            },
        },
        {
            header: "AMOUNT",
            render: (exp) => (
                <span className="font-bold text-rose-600 text-sm">
                    Rs {formatCurrency(exp.amount)}
                </span>
            ),
        },
        {
            header: "ACTIONS",
            className: "text-right",
            render: (exp) => {
                return (
                    <div className="flex justify-end items-center">
                        {/* Only allow owners to delete logs to maintain strict financial tracking */}
                        {isOwner && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); handlers.onDelete(exp); }}
                                className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];