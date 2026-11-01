/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import TablePagination from "@/lib/utils/components/TablePagination";

import { OrdersFilterBar } from "./OrdersFilterBar";
import { getOrderColumns, OrderActionType } from "./order-columns";

type Props = {
  orders: any[] | undefined;
  isFetching?: boolean; // 🔥 New prop for filter loading state
};

const OrderTable = ({ orders = [], isFetching = false }: Props) => {
  const [activeModal, setActiveModal] = useState<{
    type: OrderActionType | null;
    order: any | null;
  }>({
    type: null,
    order: null,
  });

  const handleOrderAction = useCallback((type: OrderActionType, order: any) => {
    setActiveModal({ type, order });
  }, []);

  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    itemsPerPage,
  } = usePagination(orders);

  useEffect(() => {
    setCurrentPage(1);
  }, [orders, setCurrentPage]);

  const columns = useMemo(
    () =>
      getOrderColumns({
        onAction: handleOrderAction,
      }),
    [handleOrderAction]
  );

  return (
    <div className="space-y-4">
      {/* 1. Filter Bar stays mounted and never loses focus */}
      <OrdersFilterBar />

      {/* 2. Table Container with Localized Spinner Overlay */}
      <div className="relative rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden min-h-[220px]">
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
          data={paginatedData}
          emptyMessage="No orders found matching your active filters."
        />

        {(totalItems || 0) > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default OrderTable;