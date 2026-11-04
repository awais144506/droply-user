/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";

import { OrdersFilterBar } from "./OrdersFilterBar";
import { getOrderColumns, OrderActionType } from "./order-columns";
import { ApiResponse } from "../types/order";
import ViewDetails from "./view-details";
import { handleThermalPrint } from "@/lib/utils/functions/order/thermalPrint";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { useRole } from "@/lib/hooks/use-role";
import { generateGatePassPdf } from "@/lib/utils/functions/order/gatepass-pdf";
import ConfirmActionDialog from "@/lib/utils/components/ConfirmDialog";
import { useCancelOrder } from "../api/use-mutate-order";

type Props = {
  data: ApiResponse | undefined;
  isFetching?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const OrderTable = ({ data, isFetching = false, onPageChange }: Props) => {
  const router = useRouter();
  const { branchId } = useRole();
  const { data: branchData } = useBranchSettings(branchId);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder(); // 🔥 Initialize cancel mutation

  const [activeModal, setActiveModal] = useState<{
    type: OrderActionType | null;
    order: any | null;
  }>({
    type: null,
    order: null,
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  };

  const handleOrderAction = useCallback((type: OrderActionType, order: any) => {
    if (type === "GATE_PASS") {
      generateGatePassPdf(order, branchData);
      return;
    }
    
    if (type === "ADJUST_ORDER") {
      const orderId = order.id || order.orderId;
      router.push(`/sales/orders/${orderId}/adjust`);
      return;
    }

    setActiveModal({ type, order });
  }, [branchData, router]);

  // 🔥 Handle confirmed cancellation
  const handleConfirmCancel = () => {
    const orderToCancel = activeModal.order;
    if (!orderToCancel) return;

    const orderId = orderToCancel.id || orderToCancel.orderId;
    cancelOrder(orderId, {
      onSuccess: () => {
        setActiveModal({ type: null, order: null });
      },
    });
  };

  const columns = useMemo(
    () =>
      getOrderColumns({
        onAction: handleOrderAction,
      }),
    [handleOrderAction]
  );

  return (
    <div className="space-y-4">
      {/* 1. Filter Bar */}
      <OrdersFilterBar />

      {/* 2. Table Container */}
      <div className="relative rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden min-h-55">
        {isFetching && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-xl shadow-md border border-slate-200">
              <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
              <span className="text-xs font-bold text-slate-700">
                Loading Orders...
              </span>
            </div>
          </div>
        )}

        <DataTable
          columns={columns as any}
          data={orders}
          emptyMessage="No orders found matching your active filters."
        />

        {pagination.totalItems > 0 && (
          <TablePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {/* View Details Modal */}
      <ViewDetails
        order={activeModal.order}
        isOpen={activeModal.type === "VIEW_DETAILS"}
        onClose={() => setActiveModal({ type: null, order: null })}
        onPrintThermal={(order) => {
          handleThermalPrint(order, branchData);
        }}
      />

      <ConfirmActionDialog
        isOpen={activeModal.type === "CANCEL_ORDER"}
        onClose={() => setActiveModal({ type: null, order: null })}
        onConfirm={handleConfirmCancel}
        isLoading={isCancelling}
        title="Cancel Order"
        description={`Are you sure you want to cancel order #${activeModal.order?.orderCode || activeModal.order?.orderId}? This will safely restore stock and reverse related ledgers.`}
        confirmText="Yes, Cancel Order"
        confirmButtonVariant="destructive"
      />
    </div>
  );
};

export default OrderTable;