/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Printer,
    User,
    Phone,
    MapPin,
    Truck,
    Package,
    CreditCard,
    Navigation,
    CheckCircle2,
    Clock,
    RefreshCw,
    ChevronDown,
} from "lucide-react";
import { OrderStatus } from "../types/order";
import { FaWhatsapp } from "react-icons/fa6";
import { sendOrderStatusWhatsApp } from "@/lib/utils/functions/order/message";
import { useRole } from "@/lib/hooks/use-role";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { useUpdateOrderStatus } from "../api/use-mutate-order";

type Props = {
    order: any | null;
    isOpen: boolean;
    onClose: () => void;
    onPrintThermal: (order: any) => void;
    onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
    isUpdatingStatus?: boolean;
};

const ViewDetails = ({
    order,
    isOpen,
    onClose,
    onPrintThermal,
    onUpdateStatus,
}: Props) => {
    const { branchId } = useRole();
    const { data: branchData } = useBranchSettings(branchId);
    
    // 🔥 Initialize the status update mutation hook
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus();

    if (!order) return null;
    const customer = order.customer;
    const items = order.lineItems || order.items || [];
    const assetExchanges = order.assetExchanges || [];
    const externalDelivery = order.externalDelivery;
    const isDelivery = (order.category || order.orderType) === "DELIVERY";
    const isThirdParty = Boolean(externalDelivery) || (isDelivery && !order.riderId && !order.rider);
    const status: OrderStatus = order.status;

    const total = Number(order.totalAmount ?? order.total ?? 0);
    const paid = Number(order.amountPaid ?? order.receivedAmount ?? 0);
    const balance = total - paid;

    const handleWhatsApp = () => {
        sendOrderStatusWhatsApp(order, branchData);
    };

    const thirdPartyStatuses: { key: OrderStatus; label: string; icon: any; color: string }[] = [
        { key: "PENDING", label: "Pending", icon: Clock, color: "text-amber-600" },
        { key: "ON_ROUTE", label: "On Route", icon: Navigation, color: "text-sky-600" },
        { key: "ARRIVED", label: "Arrived", icon: MapPin, color: "text-purple-600" },
        { key: "COMPLETED", label: "Completed (Done)", icon: CheckCircle2, color: "text-emerald-600" },
    ];

    const handleStatusSelect = (newStatus: OrderStatus) => {
        if (onUpdateStatus) {
            onUpdateStatus(order.id, newStatus);
        } else {
            // 🔥 Automatically execute mutation and close dialog on success
            updateStatus(
                { id: order.id, status: newStatus },
                {
                    onSuccess: () => {
                        onClose(); // Close the modal once status updates successfully
                    },
                }
            );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
                <DialogHeader>
                    <div className="flex items-center justify-between pr-4">
                        <div>
                            <DialogTitle className="text-lg font-black text-slate-900">
                                Order Details #{order.orderCode || order.orderId}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 font-medium">
                                Created on{" "}
                                {order.createdAt
                                    ? format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")
                                    : "N/A"}
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-bold text-xs px-3 py-1 uppercase">
                                {order.category || order.orderType}
                            </Badge>
                            <Badge
                                variant="outline"
                                className="font-bold text-xs px-3 py-1 uppercase bg-slate-100 text-slate-800 border-slate-200"
                            >
                                {status === "COMPLETED" ? "DONE" : status?.replace("_", " ")}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    {/* Customer & Delivery Route Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Customer Information
                            </span>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                <User className="w-3.5 h-3.5 text-sky-600" />
                                {customer?.name || "Walk-In Customer"}
                            </div>
                            {customer?.phone && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    {customer.phone}
                                </div>
                            )}
                            {customer?.address && (
                                <div className="flex items-start gap-2 text-xs text-slate-600">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                    <span>
                                        {customer.address} ({customer.zone?.name || "N/A"})
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Delivery & Assignment
                            </span>
                            {order.rider ? (
                                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                                    <Truck className="w-3.5 h-3.5" />
                                    Rider: {order.rider.name} ({order.rider.phone})
                                </div>
                            ) : isThirdParty ? (
                                <div className="space-y-1 text-xs">
                                    <div className="font-bold text-amber-700 flex items-center gap-1.5">
                                        <Truck className="w-3.5 h-3.5" /> 3rd Party Delivery
                                    </div>
                                    <p className="text-slate-600 font-medium">
                                        Driver: {externalDelivery?.driverName || "External Driver"}
                                    </p>
                                    {externalDelivery?.driverPhone && (
                                        <p className="text-slate-600 font-medium">
                                            Phone: {externalDelivery.driverPhone}
                                        </p>
                                    )}
                                    {externalDelivery?.vehiclePlate && (
                                        <p className="text-slate-500 text-[11px]">
                                            Vehicle: {externalDelivery.vehiclePlate}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-xs font-medium text-slate-500 italic">
                                    Counter Walk-In Sale (No Delivery Route)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ordered Items Table */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Line Items & Products
                        </span>
                        <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500">
                                    <tr>
                                        <th className="p-3 font-bold">Product</th>
                                        <th className="p-3 font-bold text-center">Paid Qty</th>
                                        <th className="p-3 font-bold text-center">Free (FOC)</th>
                                        <th className="p-3 font-bold text-right">Price</th>
                                        <th className="p-3 font-bold text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((item: any, idx: number) => {
                                        const paidQty = item.paidQuantity ?? item.quantity ?? 0;
                                        const freeQty = item.freeQuantity ?? 0;
                                        return (
                                            <tr key={item.id || idx}>
                                                <td className="p-3 font-semibold text-slate-800 flex items-center gap-2">
                                                    <Package className="w-3.5 h-3.5 text-sky-600" />
                                                    {item.product?.name || item.name || "Product"}
                                                </td>
                                                <td className="p-3 text-center font-bold text-slate-900">
                                                    x{paidQty}
                                                </td>
                                                <td className="p-3 text-center font-bold text-emerald-600">
                                                    {freeQty > 0 ? `+${freeQty}` : "-"}
                                                </td>
                                                <td className="p-3 text-right text-slate-600">
                                                    Rs. {Number(item.unitPrice || 0).toLocaleString()}
                                                </td>
                                                <td className="p-3 text-right font-bold text-slate-900">
                                                    Rs. {Number(item.subtotal || 0).toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Asset Exchanges / Containers */}
                    {assetExchanges.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Container & Asset Exchanges
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {assetExchanges.map((ex: any, i: number) => (
                                    <div
                                        key={ex.id || i}
                                        className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-xs space-y-1"
                                    >
                                        <div className="font-bold text-purple-900">
                                            Container Asset Exchange
                                        </div>
                                        <div className="text-slate-600 flex justify-between">
                                            <span>
                                                Outbound:{" "}
                                                <strong className="text-slate-900">
                                                    {ex.outboundQuantity}
                                                </strong>
                                            </span>
                                            <span>
                                                Inbound (Empties In):{" "}
                                                <strong className="text-slate-900">
                                                    {ex.inboundQuantity}
                                                </strong>
                                            </span>
                                        </div>
                                        {ex.depositCharged > 0 && (
                                            <div className="text-amber-700 font-semibold text-[11px]">
                                                Deposit Charged: Rs. {ex.depositCharged.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Financial Summary */}
                    <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Payment Method
                            </span>
                            <p className="text-sm font-extrabold flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-emerald-400" />{" "}
                                {order.paymentMethod || "CASH"}
                            </p>
                        </div>
                        <div className="text-right space-y-0.5">
                            <div className="text-xs text-slate-300">
                                Total: <strong className="text-white">Rs. {total.toLocaleString()}</strong>{" "}
                                | Paid:{" "}
                                <strong className="text-emerald-400">Rs. {paid.toLocaleString()}</strong>
                            </div>
                            {balance > 0 && (
                                <div className="text-xs text-amber-300 font-bold">
                                    Credit / Balance Due: Rs. {balance.toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onPrintThermal(order)}
                                className="rounded-xl text-xs font-bold gap-1.5 cursor-pointer"
                            >
                                <Printer className="w-3.5 h-3.5 text-slate-600" /> Thermal Print
                            </Button>

                            {isThirdParty && status !== "CANCELLED" && status !== "COMPLETED" && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={isUpdatingStatus}
                                            className="rounded-xl text-xs font-bold gap-1.5 border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 cursor-pointer"
                                        >
                                            <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isUpdatingStatus ? "animate-spin" : ""}`} />
                                            <span>Change Status</span>
                                            <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="start" className="w-48 rounded-2xl p-1.5 shadow-xl z-999">
                                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                                            Update 3rd Party Status
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="my-1" />
                                        {thirdPartyStatuses.map((step) => {
                                            const Icon = step.icon;
                                            const isCurrent = status === step.key;
                                            return (
                                                <DropdownMenuItem
                                                    key={step.key}
                                                    disabled={isCurrent || isUpdatingStatus}
                                                    onClick={() => handleStatusSelect(step.key)}
                                                    className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5"
                                                >
                                                    <Icon className={`w-4 h-4 ${step.color}`} />
                                                    <span>{step.label}</span>
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {customer?.phone && (
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleWhatsApp}
                                variant="success"
                            >
                                <FaWhatsapp className="w-3.5 h-3.5" /> WhatsApp
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};


export default ViewDetails;