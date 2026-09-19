import { MapPin, Phone, CalendarX2, Edit2, Trash2, Building2 } from "lucide-react";
import { SupplierList } from "../../types/supplier";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { formatLastVisit, formatCurrency, displayPakistaniPhone } from "@/lib/utils/functions/setFormat";
import { Button } from "@/components/ui/button";
export const getSupplierColumns = (
    router: AppRouterInstance,
    setSupplierToDelete: (supplier: SupplierList) => void
): ColumnDef<SupplierList>[] => [
        {
            header: "Supplier",
            render: (supplier) => (
                <div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{supplier.firmName}</p>
                    <p className="text-xs text-slate-500 font-medium">
                        Attn: {supplier.supplierName}
                    </p>
                </div>
            ),
        },

        {
            header: "Contact Details",
            render: (supplier) => (
                <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {displayPakistaniPhone(supplier.phone)}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {supplier.address}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {supplier.city}
                    </span>
                </div>
            ),
        },
        {
            header: "Payable Balance",
            render: (supplier) => {
                const hasDebt = supplier.payableBalance > 0;
                return (
                    <div className="font-bold">
                        {hasDebt ? (
                            <span className="text-rose-600 text-sm">Rs {formatCurrency(supplier.payableBalance)}</span>
                        ) : (
                            <span className="text-emerald-600 text-sm flex items-center gap-1">
                                Rs 0 <span className="font-medium text-[10px] opacity-80 uppercase tracking-wider">(Clear)</span>
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Total Purchases",
            render: (supplier) => (
                <span className="text-slate-600 font-medium text-sm">
                    Rs {formatCurrency(supplier.totalPurchases)}
                </span>
            ),
        },
        {
            header: "Last Purchase",
            render: (supplier) => {
                const lastVisit = formatLastVisit(supplier.lastPurchaseDate);

                if (!lastVisit) {
                    return (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 italic">
                            <CalendarX2 className="h-3.5 w-3.5" />
                            No purchases
                        </div>
                    );
                }

                return (
                    <span className="text-sm text-slate-600 font-medium">
                        {lastVisit.formattedDate}
                    </span>
                );
            },
        },
        {
            header: "Actions",
            className: "text-right",
            render: (supplier) => (
                <div className="flex justify-end items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/supply/suppliers/${supplier.id}`);
                        }}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSupplierToDelete(supplier)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }
    ];