"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import { ProductionBatch } from "../../types/production";
import { getProductionColumns } from "./production-columns";
import { useRole } from "@/lib/hooks/use-role";
import { FinalizeBatchDialog } from "./finalize-batch-dialog";

interface ProductionTableProps {
  batches?: ProductionBatch[];
}

export function ProductionTable({ batches = [] }: ProductionTableProps) {
  const router = useRouter();
  const { branchId } = useRole();

  const [finalizeBatch, setFinalizeBatch] = useState<ProductionBatch | null>(null);

  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    itemsPerPage
  } = usePagination(batches);


  const columns = useMemo(() => getProductionColumns(router, setFinalizeBatch), [router]);

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

      <FinalizeBatchDialog
        isOpen={!!finalizeBatch}
        onClose={() => setFinalizeBatch(null)}
        batch={finalizeBatch}
        branchId={branchId}
      />
    </>
  );
}