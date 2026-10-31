/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { format, isToday, isTomorrow } from "date-fns";
import {
    CheckCircle2,
    XCircle,
    CalendarClock,
    MapPin,
    Phone,
    Receipt,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPhoneNumber, isPossiblePhoneNumber } from "react-phone-number-input";

interface OrderColumnActions {
    onApprove: (req: any) => void;
    onReject: (req: any) => void;
}

const formatScheduleBadge = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isToday(d)) return { label: `Today, ${format(d, "MMM dd")}`, color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (isTomorrow(d)) return { label: `Tomorrow, ${format(d, "MMM dd")}`, color: "bg-sky-50 text-sky-700 border-sky-200" };
    return { label: format(d, "MMM dd, yyyy"), color: "bg-slate-100 text-slate-700 border-slate-200" };
};

// Helper function to generate the WhatsApp link
const getWhatsAppLink = (phone: string, customerName: string, orderId: string) => {
    if (!phone || !isPossiblePhoneNumber(phone)) return null;

    // Remove all non-numeric characters for the wa.me link
    const cleanPhone = phone.replace(/\D/g, "");

    const message = `Hi ${customerName}, we received your order request (${orderId}). `;
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const getOrderColumns = ({
    onApprove,
    onReject,
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
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] font-bold">
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
            header: "Requested For",
            render: (req) => {
                const sched = formatScheduleBadge(req.scheduleDate);
                return (
                    <div className="flex flex-col gap-1.5 max-w-50">
                        <Badge variant="outline" className={`${sched.color} w-fit text-[11px] font-bold flex items-center gap-1`}>
                            <CalendarClock className="w-3 h-3" />
                            {sched.label}
                        </Badge>
                        {req.notes && (
                            <div className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/60 px-2 py-1 rounded-lg line-clamp-2 font-medium mt-1">
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
                if (req.status === "PENDING") badgeStyle = "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
                if (req.status === "COMPLETED") badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
                if (req.status === "CANCELLED") badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";

                return (
                    <Badge variant="outline" className={`${badgeStyle} text-[10px] uppercase font-bold tracking-wider`}>
                        {req.status}
                    </Badge>
                );
            },
        },
        {
            header: "Actions",
            className: "text-right",
            render: (req) => {
                const waLink = getWhatsAppLink(req.customer.phone, req.customer.name, req.orderId);

                if (req.status !== "PENDING") {
                    return (
                        <div className="flex items-center justify-end gap-2 pr-2">
                            {waLink && (
                                <a href={waLink} target="_blank" rel="noopener noreferrer">
                                    <Button
                                        size="icon-sm"
                                        variant="outline"
                                        className="h-8 w-8 border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/10"
                                        title="Message Customer on WhatsApp"
                                    >
                                        <FaWhatsapp className="w-4 h-4" />
                                    </Button>
                                </a>
                            )}
                            <span className="text-right text-xs font-semibold text-slate-400">
                                Processed
                            </span>
                        </div>
                    );
                }

                return (
                    <div className="flex items-center justify-end gap-2">


                        <Button
                            size="sm"
                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-3 text-xs shadow-sm"
                            onClick={() => onApprove(req)}
                            title="Approve Order"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Approve
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold rounded-xl px-2.5 text-xs"
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
                                    className="h-8 w-8 border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/10"
                                    title="Message Customer on WhatsApp"
                                >
                                    <FaWhatsapp className="w-4 h-4" />
                                </Button>
                            </a>
                        )}
                    </div>
                );
            },
        },
    ];