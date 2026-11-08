import { Phone, MapPin } from "lucide-react";
import { CustomerDetails } from "@/features/manage/customers/types/customer";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { formatCurrency } from "@/lib/utils/functions/setFormat";



export const getCustomerColumns = (): ColumnDef<CustomerDetails>[] => [
    {
        header: "Customer & Contact",
        render: (customer) => (
            <div>
                <p className="font-bold text-slate-900 text-sm mb-1">{customer.name}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />{customer.phone} . <MapPin className="h-3 w-3 text-slate-400" />{customer.address}
                    </span>
                </div>
            </div>
        ),
    },
    {
        header: "Status",
        render: (customer) => {
            const isActive = customer.status?.toLowerCase() === "active";
            return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${isActive
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}>
                    {customer.status}
                </span>
            );
        }
    },
    {
        header: "Oustanding Balance",
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
        header: "Items Held",
        className: "text-center",
        render: (customer) => (
            <div className="text-center">
                <span className="inline-flex items-center justify-center h-6 min-w-7 px-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                    {customer.returnablesLength || 0}
                </span>
            </div>
        ),
    },
];