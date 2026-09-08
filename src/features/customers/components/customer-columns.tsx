import { MapPin, Phone, CalendarX2 } from "lucide-react";
import { CustomerDetails } from "../types/customer";
import { ColumnDef } from "@/utils/data-table";

// Helper: Format Currency
const formatCurrency = (amount: number | string) => {
    return Number(amount).toLocaleString("en-PK", { maximumFractionDigits: 0 });
};

// Helper: Calculate Last Visit (Days ago + Date)
const formatLastVisit = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    
    // Calculate difference in days
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let daysAgo = "";
    if (diffDays === 0) daysAgo = "Today";
    else if (diffDays === 1) daysAgo = "Yesterday";
    else daysAgo = `${diffDays} days ago`;
    
    // Format exact date (e.g., "12 Sep 2026")
    const formattedDate = date.toLocaleDateString("en-PK", { 
        day: "2-digit", 
        month: "short", 
        year: "numeric" 
    });

    return { daysAgo, formattedDate };
};

export const getCustomerColumns = (): ColumnDef<CustomerDetails>[] => [
    {
        header: "Code",
        className: "text-center text-xs font-bold text-slate-500 w-24",
        render: (customer) => customer.customerCode,
    },
    {
        header: "Customer & Contact",
        render: (customer) => (
            <div>
                <p className="font-bold text-slate-900 text-sm mb-1">{customer.name}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" /> 
                        {customer.phone}
                    </span>
                    <span className="flex items-center gap-1 max-w-45 truncate" title={customer.address || "No address"}>
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" /> 
                        {customer.address || "No address"}
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
                    {customer.currentReturnables}
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
                    <p className={`text-sm font-bold ${
                        lastVisit.daysAgo === "Today" ? "text-emerald-600" : "text-slate-900"
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