import { MapPin, Phone, CalendarX2 } from "lucide-react";
import { CustomerList } from "../types/customer";
import { ColumnDef } from "@/lib/utils/data-table";
import { formatLastVisit, formatCurrency, displayPakistaniPhone } from "@/lib/utils/setFormat";


export const getCustomerColumns = (): ColumnDef<CustomerList>[] => [
    {
        header: "Code",
        className: "text-center text-xs font-bold text-slate-500 w-24",
        render: (customer) => customer.customerCode,
    },
    {
        header: "Customer & Contact",
        render: (customer) => (

            <div>
                <div className="flex flex-row">
                    <p className="font-bold text-slate-900 text-sm mb-1 mr-1">{customer.name}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-bold ${customer.status === 'ACTIVE'
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}>
                        {customer.status}
                    </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {displayPakistaniPhone(customer.phone)}
                    </span>
                    <span className="flex items-center gap-1 max-w-45 truncate" title={customer.zone?.name || "No address"}>
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        {customer.zone?.name || "No address"}
                    </span>
                </div>
            </div>
        ),
    },
    {
        header: "Khata Balance",
        render: (customer) => {
            const debtAmount = Number(customer.customerCredit);
            const hasDebt = debtAmount > 0;
            return (
                <div className="font-bold">
                    {hasDebt ? (
                        <span className="text-amber-600">Rs {formatCurrency(debtAmount)}</span>
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
        header: "Assets Held",
        className: "text-center",
        render: (customer) => (
            <div className="text-center">
                <span className="inline-flex items-center justify-center h-6 min-w-7 px-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                    {customer.returnablesLength || 0}
                </span>
            </div>
        ),
    },
    {
        header: "Last Order",
        render: (customer) => {
            const lastVisit = formatLastVisit(customer.lastVisitDate);

            if (!lastVisit) {
                return (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 italic">
                        <CalendarX2 className="h-3.5 w-3.5" />
                        No orders yet
                    </div>
                );
            }

            return (
                <div>
                    <p className={`text-sm font-bold ${lastVisit.daysAgo === "Today" ? "text-emerald-600" : "text-slate-900"
                        }`}>
                        {lastVisit.daysAgo}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {lastVisit.formattedDate}
                    </p>
                </div>
            );
        },
    },
];