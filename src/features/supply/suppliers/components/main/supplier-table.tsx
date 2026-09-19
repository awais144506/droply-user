"use client";

import { useMemo } from "react";
import { SupplierList } from "../../types/supplier";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { getSupplierColumns } from "./supplier-columns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { useDeleteSupplier } from "../../api/use-mutate-supplier";
import { toast } from "sonner"

interface SupplierTableProps {
  suppliers: SupplierList[];
}

export function SupplierTable({ suppliers }: SupplierTableProps) {

  const router = useRouter();
  const [supplierToDelete, setSupplierToDelete] = useState<SupplierList | null>(null);
  const { mutate: deleteSupplier, isPending: isDeleting } = useDeleteSupplier();

  const confirmDelete = () => {
    if (!supplierToDelete) return;
    if (supplierToDelete.payableBalance > 0) {
      toast.error("Cannot Delete Supplier", {
        description: `Please settle the outstanding balance of Rs ${supplierToDelete.payableBalance} before deleting this account.`
      });
      setSupplierToDelete(null);
      return;
    }
    deleteSupplier(supplierToDelete.id, {
      onSuccess: () => {
        setSupplierToDelete(null);
      },
    });
  };

  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    itemsPerPage
  } = usePagination(suppliers);

  const columns = useMemo(() => getSupplierColumns(router, setSupplierToDelete), [router]);

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <DataTable
          data={paginatedData}
          columns={columns}
          emptyMessage="No suppliers match your current filters."
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
      <ConfirmDeleteDialog
        itemName={`Supplier "${supplierToDelete?.firmName}"`}
        isOpen={!!supplierToDelete}
        onClose={() => setSupplierToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}