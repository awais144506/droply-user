"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import ConfirmActionDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { ProductionBatch } from "../../types/production";
import { getProductionColumns } from "./production-columns";
import { useRole } from "@/lib/hooks/use-role";

// Assuming you have this hook, otherwise adjust import
// import { useUndoProduction } from "../../api/use-mutate-production";

interface ProductionTableProps {
  batches?: ProductionBatch[];
}

type DialogState = {
  isOpen: boolean;
  type: "undo" | null;
  batch: ProductionBatch | null;
};

export function ProductionTable({ batches = [] }: ProductionTableProps) {
  const router = useRouter();
  const { isOwner } = useRole();

  // Uncomment when backend undo route is ready
  // const { mutate: undoBatch, isPending: isUndoing } = useUndoProduction();
  const isUndoing = false;

  const [dialog, setDialog] = useState<DialogState>({ isOpen: false, type: null, batch: null });

  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    itemsPerPage
  } = usePagination(batches);

  const handlers = useMemo(() => ({
    onUndo: (batch: ProductionBatch) => {
      setDialog({ isOpen: true, type: "undo", batch });
    },
    onPrint: async (batch: ProductionBatch) => {
      // Implement your PDF generation here
      toast.info(`Generating PDF for ${batch.batchCode}...`);
    },
  }), []);

  const columns = useMemo(() => getProductionColumns(router, handlers, isOwner), [router, handlers, isOwner]);

  const executeAction = () => {
    if (!dialog.batch || dialog.type !== "undo") return;
    toast.success("Batch undone (Placeholder)");
    setDialog({ isOpen: false, type: null, batch: null });
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <DataTable
          data={paginatedData}
          columns={columns}
          emptyMessage="No production batches logged yet."
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

      <ConfirmActionDialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ isOpen: false, type: null, batch: null })}
        onConfirm={executeAction}
        isLoading={isUndoing}
        title="Undo Production Batch"
        description={
          <span>
            Are you sure you want to reverse the production batch <span className="font-bold text-slate-900">{dialog.batch?.batchCode}</span>?
            This will deduct the yield from finished goods and restore the consumed raw materials to inventory.
          </span>
        }
        confirmText="Reverse Batch"
        confirmButtonClass="bg-amber-500 hover:bg-amber-600 text-white"
      />
    </>
  );
}