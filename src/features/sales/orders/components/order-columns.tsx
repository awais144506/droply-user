/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Eye,
  Printer,
  MessageCircle,
  RefreshCw,
  Banknote,
  Undo2,
  XCircle,
  ShoppingBag,
  Truck,
  Phone,
  MapPin,
  Package,
  CalendarClock,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sendWhatsAppMessage } from "@/lib/utils/functions/whatsapp/customerWhatsApp";

// 1. All Possible Order Actions (Centralized Type)
export type OrderActionType =
  | "VIEW_DETAILS"
  | "PRINT_INVOICE"
  | "UPDATE_STATUS"
  | "RECORD_PAYMENT"
  | "RESCHEDULE_ORDER"
  | "SALE_RETURN"
  | "CANCEL_ORDER";

interface OrderColumnsProps {
  onAction: (type: OrderActionType, order: any) => void;
}

// 2. Category Badge Styling Helper
const getCategoryBadge = (category: string) => {
  switch (category) {
    case "WALK_IN":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-bold text-[10px] gap-1 px-2 py-0.5">
          <ShoppingBag className="w-3 h-3" /> Walk-In
        </Badge>
      );
    case "DELIVERY":
      return (
        <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 font-bold text-[10px] gap-1 px-2 py-0.5">
          <Truck className="w-3 h-3" /> Delivery
        </Badge>
      );
    case "RECOVERY":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[10px] gap-1 px-2 py-0.5">
          <Banknote className="w-3 h-3" /> Recovery
        </Badge>
      );
    case "SALE_RETURN":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-[10px] gap-1 px-2 py-0.5">
          <Undo2 className="w-3 h-3" /> Sale Return
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-bold text-[10px]">
          {category || "STANDARD"}
        </Badge>
      );
  }
};

// 3. Status Badge Styling Helper
const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    ACCEPTED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    ASSIGNED: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    ON_ROUTE: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    ARRIVED: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    RESCHEDULED: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    CANCELLED: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  };

  return (
    <Badge
      variant="outline"
      className={`font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 ${
        styles[status] || "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {status?.replace("_", " ") || "PENDING"}
    </Badge>
  );
};

export const getOrderColumns = ({
  onAction,
}: OrderColumnsProps): ColumnDef<any>[] => [
  // COLUMN 1: Order Code, Category & Date
  {
    header: "ORDER DETAILS",
    render: (order) => {
      const code = order.orderCode || order.orderId || "N/A";
      const dateStr = order.createdAt || order.scheduleDate;

      return (
        <div className="space-y-1.5 min-w-32.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-xs tracking-tight">
              #{code}
            </span>
          </div>
          <div>{getCategoryBadge(order.category || order.orderType)}</div>
          {dateStr && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <CalendarClock className="w-3 h-3 shrink-0" />
              <span>{format(new Date(dateStr), "dd MMM, hh:mm a")}</span>
            </div>
          )}
        </div>
      );
    },
  },

  // COLUMN 2: Customer, Zone & Rider Info
  {
    header: "CUSTOMER & ROUTE",
    render: (order) => {
      const customer = order.customer;
      const riderName = order.rider?.name || order.assignedTo?.name;

      if (!customer) {
        return (
          <div className="text-xs font-bold text-slate-500">
            Counter Walk-In Customer
          </div>
        );
      }

      return (
        <div className="space-y-1 min-w-42.5">
          <div className="font-bold text-slate-800 text-xs leading-none">
            {customer.name}
          </div>
          {customer.phone && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{customer.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
            {customer.zone?.name && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                <MapPin className="w-2.5 h-2.5 text-sky-600" />
                {customer.zone.name}
              </span>
            )}
            {riderName && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                <UserCheck className="w-2.5 h-2.5" />
                {riderName}
              </span>
            )}
          </div>
        </div>
      );
    },
  },

  // COLUMN 3: Ordered Items Summary
  {
    header: "ITEMS",
    render: (order) => {
      const items = order.lineItems || order.items || [];

      if (items.length === 0) {
        return <span className="text-xs text-slate-400 italic">No items</span>;
      }

      return (
        <div className="space-y-1 min-w-37.5 max-w-55">
          {items.slice(0, 2).map((item: any, idx: number) => {
            const qty = (item.paidQuantity ?? 0) + (item.freeQuantity ?? 0) || item.quantity || 0;
            return (
              <div
                key={item.id || idx}
                className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"
              >
                <span className="font-semibold text-slate-700 truncate mr-2 flex items-center gap-1.5">
                  <Package className="w-3 h-3 text-sky-600 shrink-0" />
                  {item.product?.name || item.name || "Product"}
                </span>
                <span className="font-black text-slate-900 shrink-0">
                  x{qty}
                </span>
              </div>
            );
          })}
          {items.length > 2 && (
            <div className="text-[10px] font-bold text-sky-600 pl-1">
              +{items.length - 2} more items...
            </div>
          )}
        </div>
      );
    },
  },

  // COLUMN 4: Financials (Total, Paid, Balance/Credit)
  {
    header: "BILLING",
    render: (order) => {
      const total = Number(order.totalAmount ?? order.total ?? 0);
      const paid = Number(order.amountPaid ?? order.receivedAmount ?? 0);
      const balance = total - paid;

      return (
        <div className="space-y-1 min-w-30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Total:</span>
            <span className="font-black text-slate-900">
              Rs. {total.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Paid:</span>
            <span className="font-bold text-emerald-600">
              Rs. {paid.toLocaleString()}
            </span>
          </div>
          {balance > 0 && (
            <div className="flex items-center justify-between text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">
              <span>Credit:</span>
              <span>Rs. {balance.toLocaleString()}</span>
            </div>
          )}
        </div>
      );
    },
  },

  // COLUMN 5: Order Status
  {
    header: "STATUS",
    render: (order) => {
      return <div>{getStatusBadge(order.status)}</div>;
    },
  },

  // COLUMN 6: Clean Popover / Dropdown Actions Menu
  {
    header: "ACTIONS",
    className: "text-right",
    render: (order) => {
      const isCancelled = order.status === "CANCELLED";
      const isCompleted = order.status === "COMPLETED";

      const handleWhatsApp = () => {
        const phone = order.customer?.phone;
        if (!phone) return;
        const code = order.orderCode || order.orderId || "";
        const total = Number(order.totalAmount ?? order.total ?? 0);
        const msg = `Hi *${order.customer?.name}*, here is the update for your Order *#${code}*.\n\n*Status:* ${order.status}\n*Total Bill:* Rs. ${total.toLocaleString()}\n\nThank you for choosing us!`;
        sendWhatsAppMessage(phone, msg);
      };

      return (
        <div className="flex justify-end pr-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 rounded-xl border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>Manage</span>
                <MoreHorizontal className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-52 rounded-2xl p-1.5 shadow-xl border-slate-200/90"
            >
              <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Order #{order.orderCode || order.orderId}
              </DropdownMenuLabel>

              {/* GROUP 1: View, Print & WhatsApp */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => onAction("VIEW_DETAILS", order)}
                  className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5"
                >
                  <Eye className="w-4 h-4 text-sky-600" />
                  <span>View Full Details</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onAction("PRINT_INVOICE", order)}
                  className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print Thermal Bill</span>
                </DropdownMenuItem>

                {order.customer?.phone && (
                  <DropdownMenuItem
                    onClick={handleWhatsApp}
                    className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Send WhatsApp Update</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1 bg-slate-100" />

              {/* GROUP 2: Operational Actions */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  disabled={isCancelled}
                  onClick={() => onAction("UPDATE_STATUS", order)}
                  className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5"
                >
                  <RefreshCw className="w-4 h-4 text-indigo-600" />
                  <span>Change Order Status</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  disabled={isCancelled}
                  onClick={() => onAction("RECORD_PAYMENT", order)}
                  className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5"
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Record / Adjust Payment</span>
                </DropdownMenuItem>

                {!isCompleted && !isCancelled && (
                  <DropdownMenuItem
                    onClick={() => onAction("RESCHEDULE_ORDER", order)}
                    className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5"
                  >
                    <CalendarClock className="w-4 h-4 text-amber-600" />
                    <span>Reschedule Date</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1 bg-slate-100" />

              {/* GROUP 3: Returns & Cancellation */}
              <DropdownMenuGroup>
                {isCompleted && (
                  <DropdownMenuItem
                    onClick={() => onAction("SALE_RETURN", order)}
                    className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5 text-amber-700 focus:text-amber-800 focus:bg-amber-50"
                  >
                    <Undo2 className="w-4 h-4 text-amber-600" />
                    <span>Process Sale Return</span>
                  </DropdownMenuItem>
                )}

                {!isCancelled && !isCompleted && (
                  <DropdownMenuItem
                    onClick={() => onAction("CANCEL_ORDER", order)}
                    className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5 text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Cancel Order</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];