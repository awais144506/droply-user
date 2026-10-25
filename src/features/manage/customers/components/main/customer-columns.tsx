/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Home, MapPin, Phone, CalendarX2, PhoneCall } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { CustomerDetails } from "../../types/customer";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { formatLastVisit, formatCurrency } from "@/lib/utils/functions/setFormat";
import { formatPhoneNumber } from "react-phone-number-input";
import { sendCustomerCreatedMessage } from "@/lib/utils/functions/whatsapp/customerWhatsApp";
import { BranchSettingData } from "@/features/admin/settings/types/settings";

interface CustomerColumnsProps {
    branchSettings?: BranchSettingData;
}

// Helper to get today's day enum string matching backend (e.g. "MONDAY")
const getTodayEnumString = (): string => {
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    return days[new Date().getDay()];
};

export const getCustomerColumns = ({
    branchSettings,
}: CustomerColumnsProps = {}): ColumnDef<CustomerDetails>[] => [
    {
        header: "Code",
        render: (customer) => (
            <span className="text-xs font-bold"> {customer.customerCode}</span>
        ),
    },
    {
        header: "Customer & Contact",
        render: (customer) => (
            <div>
                <div className="flex flex-row items-center gap-1.5">
                    <p className="font-bold text-slate-900 text-sm mb-0.5">{customer.name}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-bold ${
                        customer.status === 'ACTIVE'
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}>
                        {customer.status}
                    </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-700">
                    <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {formatPhoneNumber(customer.phone)} • ({customer.category.toLowerCase()})
                    </span>
                </div>
            </div>
        ),
    },
    {
        header: "Address & Zone",
        render: (customer) => (
            <div>
                <span className="flex items-center text-xs gap-1 max-w-60 min-w-0">
                    <Home className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">
                        {customer.address || "No address"}
                    </span>
                </span>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 max-w-45 truncate" title={customer.zone?.name || "Unassigned"}>
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        {customer.zone?.name || "Unassigned"}
                    </span>
                </div>
            </div>
        ),
    },
    {
        header: "Delivery Schedule",
        render: (customer) => {
            const scheduleType = customer.deliveryScheduleType || "ON_DEMAND";
            const days = customer.deliveryDays || [];
            const todayEnum = getTodayEnumString();
            const isDeliveryToday = days.includes(todayEnum as any);

            if (scheduleType === "EVERYDAY") {
                return (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span>Everyday</span>
                    </div>
                );
            }

            if (scheduleType === "ON_DEMAND") {
                return (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <PhoneCall className="h-3.5 w-3.5 text-sky-500" />
                        <span>On-Demand</span>
                    </div>
                );
            }

            // CUSTOM_DAYS
            return (
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        {isDeliveryToday && (
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        )}
                        <span>Selected Days</span>
                    </div>
                    <div className="flex flex-wrap gap-0.5">
                        {days.map((d) => {
                            const isTodayMatch = d === todayEnum;
                            return (
                                <span
                                    key={d}
                                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                        isTodayMatch
                                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs"
                                            : "bg-slate-100 text-slate-600"
                                    }`}
                                    title={isTodayMatch ? "Scheduled for today!" : d}
                                >
                                    {d.slice(0, 3)}
                                </span>
                            );
                        })}
                    </div>
                </div>
            );
        },
    },
    {
        header: "Outstanding Balance",
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
                    <p className={`text-sm font-bold ${lastVisit.daysAgo === "Today" ? "text-emerald-600" : "text-slate-900"}`}>
                        {lastVisit.daysAgo}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {lastVisit.formattedDate}
                    </p>
                </div>
            );
        },
    },
    {
        header: "WhatsApp",
        className: "text-center",
        render: (customer) => (
            <div className="text-center">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        sendCustomerCreatedMessage(customer, branchSettings);
                    }}
                    title="Send Account Details via WhatsApp"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                >
                    <FaWhatsapp className="h-4 w-4" />
                </button>
            </div>
        ),
    },
];