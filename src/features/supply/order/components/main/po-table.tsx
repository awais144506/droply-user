"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";

import { PurchaseOrder } from "../../types/po";
import { getPOColumns } from "./po-columns";
import { useRole } from "@/lib/hooks/use-role"; // 🔥 Import your role hook

interface POTableProps {
  orders?: PurchaseOrder[];
}

export function POTable({ orders = [] }: POTableProps) {
  const router = useRouter();
  const { isManager, isOwner } = useRole();

  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    itemsPerPage
  } = usePagination(orders);

  const handlers = useMemo(() => ({
    onReceive: (po: PurchaseOrder) => {
      console.log("Receiving PO", po.id);
      toast.info(`Processing receipt for ${po.poNumber}...`);
    },
    onUndo: (po: PurchaseOrder) => {
      console.log("Undoing PO", po.id);
      toast.info(`Reversing stock for ${po.poNumber}...`);
    },
    onPrint: (po: PurchaseOrder) => {
      console.log("Printing PO", po.id);
      toast.info("Generating PDF...");
    },
    onWhatsApp: (po: PurchaseOrder) => {
      const cleanPhone = po.supplier.phone.replace(/[^0-9]/g, '');
      const message = encodeURIComponent(`Hello *${po.supplier.firmName}*,\n\nPlease process our new order: *${po.poNumber}*.\nTotal: Rs ${po.totalAmount.toLocaleString()}`);
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    },
    onEdit: (po: PurchaseOrder) => {
      router.push(`/supply/order/${po.id}`);
    }
  }), [router]);


  const columns = useMemo(() => getPOColumns(router, handlers, isOwner, isManager), [router, handlers, isOwner, isManager]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <DataTable
        data={paginatedData}
        columns={columns}
        emptyMessage="No purchase orders match your current filters."
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
  );
}