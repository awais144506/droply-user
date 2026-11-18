/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import {
    CheckCircle2,
    XCircle,
    CalendarClock,
    MapPin,
    Phone,
    Receipt,
    ShoppingBag,
    Clock,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPhoneNumber, isPossiblePhoneNumber } from "react-phone-number-input";

interface OrderColumnActions {
    onApprove: (req: any) => void;
    onReject: (req: any) => void;
    onCreateOrder?: (req: any, customerId: string) => void;
}

const formatScheduleBadge = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isToday(d)) {
        return {
            tag: "DELIVER TODAY",
            dateLabel: format(d, "EEE, MMM dd"),
            containerStyle: "bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/20",
            tagStyle: "bg-emerald-600 text-white",
            isTodayDate: true,
        };
    }
    if (isTomorrow(d)) {
        return {
            tag: "TOMORROW — DO NOT DISPATCH YET",
            dateLabel: format(d, "EEE, MMM dd"),
            containerStyle: "bg-sky-50 border-sky-300 text-sky-900",
            tagStyle: "bg-sky-600 text-white",
            isTodayDate: false,
        };
    }
    if (isPast(d)) {
        return {
            tag: "OVERDUE DATE",
            dateLabel: format(d, "EEE, MMM dd, yyyy"),
            containerStyle: "bg-rose-50 border-rose-300 text-rose-900",
            tagStyle: "bg-rose-600 text-white",
            isTodayDate: false,
        };
    }
    return {
        tag: "UPCOMING SCHEDULE",
        dateLabel: format(d, "EEE, MMM dd, yyyy"),
        containerStyle: "bg-amber-50/80 border-amber-300 text-amber-900",
        tagStyle: "bg-amber-600 text-white",
        isTodayDate: false,
    };
};

// Extended Helper Function to Generate Detailed WhatsApp Message
const getWhatsAppLink = (req: any) => {
    const phone = req.customer?.phone;
    if (!phone || !isPossiblePhoneNumber(phone)) return null;

    const cleanPhone = phone.replace(/\D/g, "");
    const customerName = req.customer?.name || "Customer";
    const orderId = req.orderId || "N/A";
    const status = req.status || "PENDING";

    // Format items list cleanly
    const itemsList =
        req.items
            ?.map((item: any) => `• ${item.quantity}x ${item.product?.name || "Item"}`)
            .join("\n") || "No items";

    const scheduleDateStr = req.scheduleDate
        ? format(new Date(req.scheduleDate), "MMM dd, yyyy")
        : "As requested";

    const message =
`Hello ${customerName},

Here are the details for your order update:

*Status:* ${status}

*Order ID:* ${orderId}
*Scheduled For:* ${scheduleDateStr}

*Order Items:*
${itemsList}

Thank you for choosing us!`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const getOrderColumns = ({
    onApprove,
    onReject,
    onCreateOrder,
}: OrderColumnActions): ColumnDef<any>[] => [
    {
        header: "Request ID",
        render: (req) => (
            <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                    <Receipt className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{req.orderId}</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                    Created: {format(new Date(req.createdAt), "MMM dd, p")}
                </span>
            </div>
        ),
    },
    {
        header: "Customer & Zone",
        render: (req) => {
            const { customer } = req;
            return (
                <div className="flex flex-col gap-1 max-w-55">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{customer.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                        <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate">{customer.address}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-700 text-[10px] font-bold"
                        >
                            {customer.zone?.name || "Unassigned"}
                        </Badge>
                        {customer.phone && (
                            <span className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                                <Phone className="w-2.5 h-2.5" /> {formatPhoneNumber(customer.phone)}
                            </span>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        header: "Requested Items",
        render: (req) => (
            <div className="flex flex-col gap-1.5">
                {req.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs">
                        <span className="inline-flex items-center justify-center bg-sky-50 text-sky-700 font-black rounded-md px-1.5 py-0.5 text-[11px] border border-sky-100">
                            {item.quantity}x
                        </span>
                        <span className="font-semibold text-slate-700">{item.product.name}</span>
                    </div>
                ))}
            </div>
        ),
    },
    {
        header: "Requested For (Schedule)",
        render: (req) => {
            const sched = formatScheduleBadge(req.scheduleDate);
            return (
                <div className="flex flex-col gap-1.5 max-w-56">
                    {/* Prominent Schedule Callout Box */}
                    <div
                        className={`flex flex-col rounded-xl border px-2.5 py-1.5 shadow-2xs ${sched.containerStyle}`}
                    >
                        <span
                            className={`w-fit rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${sched.tagStyle}`}
                        >
                            {sched.tag}
                        </span>
                        <div className="mt-1 flex items-center gap-1.5 text-xs font-extrabold">
                            <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                            <span>{sched.dateLabel}</span>
                        </div>
                    </div>

                    {req.notes && (
                        <div className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/60 px-2 py-1 rounded-lg line-clamp-2 font-medium">
                            Note: {req.notes}
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        header: "Status",
        render: (req) => {
            let badgeStyle = "bg-sky-50 text-sky-700 border-sky-200";
            if (req.status === "PENDING")
                badgeStyle = "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
            if (req.status === "ACCEPTED" || req.status === "APPROVED")
                badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
            if (req.status === "CANCELLED")
                badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";

            return (
                <Badge
                    variant="outline"
                    className={`${badgeStyle} text-[10px] uppercase font-bold tracking-wider`}
                >
                    {req.status}
                </Badge>
            );
        },
    },
    {
        header: "Actions",
        className: "text-right",
        render: (req) => {
            const waLink = getWhatsAppLink(req);
            const customerId = req.customer?.id || req.customerId;
            const isScheduledToday = req.scheduleDate ? isToday(new Date(req.scheduleDate)) : false;
            const isAccepted = req.status === "ACCEPTED" || req.status === "APPROVED";

            // 1. IF PENDING -> Show Approve & Reject buttons
            if (req.status === "PENDING") {
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            size="sm"
                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-3 text-xs shadow-sm cursor-pointer"
                            onClick={() => onApprove(req)}
                            title="Approve Order"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Approve
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold rounded-xl px-2.5 text-xs cursor-pointer"
                            onClick={() => onReject(req)}
                            title="Reject Order"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                        </Button>

                        {waLink && (
                            <a href={waLink} target="_blank" rel="noopener noreferrer">
                                <Button
                                    size="icon-sm"
                                    variant="outline"
                                    className="h-8 w-8 border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/10 cursor-pointer"
                                    title="Message Customer on WhatsApp"
                                >
                                    <FaWhatsapp className="w-4 h-4" />
                                </Button>
                            </a>
                        )}
                    </div>
                );
            }

            // 2. IF ACCEPTED AND SCHEDULED FOR TODAY -> Show "Create Order" Button
            if (isAccepted && isScheduledToday) {
                return (
                    <div className="flex items-center justify-end gap-2 pr-2">
                        <Button
                            size="sm"
                            className="h-8 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl px-3 text-xs shadow-sm cursor-pointer"
                            onClick={() => onCreateOrder?.(req, customerId)}
                            title="Create Order for Customer"
                        >
                            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                            Create Order
                        </Button>

                        {waLink && (
                            <a href={waLink} target="_blank" rel="noopener noreferrer">
                                <Button
                                    size="icon-sm"
                                    variant="outline"
                                    className="h-8 w-8 border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/10 cursor-pointer"
                                    title="Message Customer on WhatsApp"
                                >
                                    <FaWhatsapp className="w-4 h-4" />
                                </Button>
                            </a>
                        )}
                    </div>
                );
            }

            // 3. IF ACCEPTED BUT SCHEDULED FOR ANOTHER DAY -> Prevent accidental creation
            if (isAccepted && !isScheduledToday) {
                return (
                    <div className="flex items-center justify-end gap-2 pr-2">
                        <span
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-500"
                            title="Create Order button will unlock on the scheduled date"
                        >
                            <Clock className="w-3 h-3 text-slate-400" />
                            Scheduled ({format(new Date(req.scheduleDate), "MMM dd")})
                        </span>

                        {waLink && (
                            <a href={waLink} target="_blank" rel="noopener noreferrer">
                                <Button
                                    size="icon-sm"
                                    variant="outline"
                                    className="h-8 w-8 border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/10 cursor-pointer"
                                    title="Message Customer on WhatsApp"
                                >
                                    <FaWhatsapp className="w-4 h-4" />
                                </Button>
                            </a>
                        )}
                    </div>
                );
            }

            // 4. CANCELLED OR COMPLETED
            return (
                <div className="flex items-center justify-end gap-2 pr-2">
                    {waLink && (
                        <a href={waLink} target="_blank" rel="noopener noreferrer">
                            <Button
                                size="icon-sm"
                                variant="outline"
                                className="h-8 w-8 border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/10 cursor-pointer"
                                title="Message Customer on WhatsApp"
                            >
                                <FaWhatsapp className="w-4 h-4" />
                            </Button>
                        </a>
                    )}
                    <span className="text-right text-xs font-semibold text-slate-400">
                        {req.status === "CANCELLED" ? "Cancelled" : "Processed"}
                    </span>
                </div>
            );
        },
    },
];