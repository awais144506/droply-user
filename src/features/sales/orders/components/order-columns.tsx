/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Eye,
  SlidersHorizontal,
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
  ShieldCheck,
  Clock
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
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

// 🔥 Updated Action Types (Replaced EDIT_ORDER with ADJUST_ORDER, added GATE_PASS)
export type OrderActionType =
  | "VIEW_DETAILS"
  | "ADJUST_ORDER"
  | "CANCEL_ORDER"
  | "GATE_PASS"
  | "UPDATE_STATUS";

interface OrderColumnsProps {
  onAction: (type: OrderActionType, order: any) => void;
}

// Category Badge Styling Helper
const getCategoryBadge = (category: string) => {
  switch (category) {
    case "WALK_IN":
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 font-bold text-[10px] gap-1 px-2 py-0.5"
        >
          <ShoppingBag className="w-3 h-3" /> Walk-In
        </Badge>
      );
    case "DELIVERY":
      return (
        <Badge
          variant="outline"
          className="bg-sky-50 text-sky-700 border-sky-200 font-bold text-[10px] gap-1 px-2 py-0.5"
        >
          <Truck className="w-3 h-3" /> Delivery
        </Badge>
      );
    case "RECOVERY":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[10px] gap-1 px-2 py-0.5"
        >
          <Banknote className="w-3 h-3" /> Recovery
        </Badge>
      );
    case "SALE_RETURN":
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-[10px] gap-1 px-2 py-0.5"
        >
          <Undo2 className="w-3 h-3" /> Sale Return
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="bg-slate-50 text-slate-700 border-slate-200 font-bold text-[10px]"
        >
          {category || "STANDARD"}
        </Badge>
      );
  }
};

// Status Badge Styling Helper
const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    ON_ROUTE: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    ARRIVED: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    CANCELLED: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  };

  return (
    <Badge
      variant="outline"
      className={`font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 ${styles[status] || "bg-slate-100 text-slate-600 border-slate-200"
        }`}
    >
      {status === "COMPLETED" ? "DONE / COMPLETED" : status?.replace("_", " ") || "PENDING"}
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
        const dateStr = order.createdAt;
        const scheduleDate = order.scheduledDate;
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
            {scheduleDate && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Clock className="w-3 h-3 shrink-0" />
                <span>{format(new Date(scheduleDate), "dd MMM yyyy")}</span>
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
        const thirdParty = order.externalDelivery?.driverName;

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
              {riderName ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                  <UserCheck className="w-2.5 h-2.5" />
                  {riderName}
                </span>
              ) : thirdParty ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
                  <Truck className="w-2.5 h-2.5" />
                  {thirdParty} (3rd Party)
                </span>
              ) : null}
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
              const qty =
                (item.paidQuantity ?? 0) + (item.freeQuantity ?? 0) ||
                item.quantity ||
                0;
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

    // COLUMN 6: Dynamic State-Driven Actions
    {
      header: "ACTIONS",
      className: "text-right",
      render: (order) => {
        const category = order.category || order.orderType;
        const isWalkIn = category === "WALK_IN";
        const isDelivery = category === "DELIVERY";
        const status = order.status;
        const isThirdParty = Boolean(order.externalDelivery?.driverName);

        // 🔥 RULE 1: If order is CANCELLED -> All options gone, ONLY show WhatsApp button
        if (status === "CANCELLED") {
          const handleCancelledWhatsApp = () => {
            const phone = order.customer?.phone;
            if (!phone) return;
            const code = order.orderCode || order.orderId || "";
            const msg = `Hi *${order.customer?.name}*, we are writing to inform you that your Order *#${code}* has been *CANCELLED*.\n\nIf you have any questions or wish to place a new order, please contact us.`;
            sendWhatsAppMessage(phone, msg);
          };

          return (
            <div className="flex justify-end pr-1">
              {order.customer?.phone ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelledWhatsApp}
                  title="Send Cancellation Alert via WhatsApp"
                  className="h-8 px-2.5 rounded-xl border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 font-bold text-xs gap-1.5 cursor-pointer"
                >
                  <FaWhatsapp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </Button>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 italic pr-2">
                  Cancelled
                </span>
              )}
            </div>
          );
        }

        // 🔥 Determine allowed mutations based on Category, Status & 3rd Party rules
        let canAdjust = false;
        let canCancel = false;
        let showGatePassOption = false;

        if (isWalkIn) {
          // Walk-In goes directly to COMPLETED, and can always be Adjusted or Cancelled
          canAdjust = true;
          canCancel = true;
        } else if (isDelivery) {
          if (isThirdParty) {
            // 3rd Party Delivery: Only mutable when PENDING. Once ON_ROUTE or beyond, all mutation options are gone!
            showGatePassOption = true;
            if (status === "PENDING") {
              canAdjust = true;
              canCancel = true;
            }
          } else {
            // Branch Rider Delivery Rules:
            if (status === "PENDING" || status === "ON_ROUTE") {
              canAdjust = true;
              canCancel = true;
            } else if (status === "ARRIVED") {
              canAdjust = false; // Cannot adjust anymore on ARRIVED
              canCancel = true;
            } else if (status === "COMPLETED") {
              canAdjust = true; // Can adjust ledger/bottles/payment on DONE
              canCancel = false; // Cannot cancel once DONE
            }
          }
        }

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

                <DropdownMenuGroup>
                  {/* 1. View Full Details (Always visible for active/completed orders) */}
                  <DropdownMenuItem
                    onClick={() => onAction("VIEW_DETAILS", order)}
                    className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5"
                  >
                    <Eye className="w-4 h-4 text-sky-600" />
                    <span>View Full Details</span>
                  </DropdownMenuItem>

                  {/* 2. Gate Pass Shortcut for 3rd Party Driver in PENDING */}
                  {showGatePassOption && status === "PENDING" && (
                    <DropdownMenuItem
                      onClick={() => onAction("GATE_PASS", order)}
                      className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5 text-amber-800 focus:bg-amber-50"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Gate Pass</span>
                    </DropdownMenuItem>
                  )}

                  {/* 3. Adjust Order */}
                  {canAdjust && (
                    <DropdownMenuItem
                      onClick={() => onAction("ADJUST_ORDER", order)}
                      className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5 text-slate-700 hover:text-slate-900"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                      <span>Adjust Order</span>
                    </DropdownMenuItem>
                  )}

                  {/* 4. Cancel Order */}
                  {canCancel && (
                    <>
                      <DropdownMenuSeparator className="my-1 bg-slate-100" />
                      <DropdownMenuItem
                        onClick={() => onAction("CANCEL_ORDER", order)}
                        className="rounded-xl text-xs font-semibold py-2 cursor-pointer gap-2.5 text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                      >
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <span>Cancel Order</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];