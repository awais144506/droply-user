import { MapPin, Phone, CalendarX2 } from "lucide-react";
import { CustomerDetails } from "@/features/customers/types/customer";
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
        header: "Customer & Contact",
        render: (customer) => (
            <div>
                <p className="font-bold text-slate-900 text-sm mb-1">{customer.name}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {customer.phone}
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
];