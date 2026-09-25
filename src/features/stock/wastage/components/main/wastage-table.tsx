"use client";

import { useMemo, useState } from "react";
import { WastageRecord } from "../../types/wastage";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import TablePagination from "@/lib/utils/components/TablePagination";
import ConfirmActionDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { getWastageColumns } from "./wastage-columns";
import { useDeleteWastage } from "../../api/use-mutate-wastage";
import { useRole } from "@/lib/hooks/use-role";

type Props = {
  wastageLogs: WastageRecord[] | undefined;
}

const WastageTable = ({ wastageLogs = [] }: Props) => {
  const { branchId } = useRole();
  const { mutateAsync: deleteWastage, isPending } = useDeleteWastage(branchId);

  const [deleteLog, setDeleteLog] = useState<WastageRecord | null>(null);

  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    itemsPerPage
  } = usePagination(wastageLogs);
  const columns = useMemo(() => getWastageColumns(setDeleteLog), []);

  const handleDelete = async () => {
    if (!deleteLog) return;

    await deleteWastage(deleteLog.id);
    setDeleteLog(null);
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <DataTable
          data={paginatedData}
          columns={columns}
          emptyMessage="No wastage records found."
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

      {/* The Confirmation Dialog for Deletions */}
      <ConfirmActionDialog
        isOpen={!!deleteLog}
        onClose={() => setDeleteLog(null)}
        onConfirm={handleDelete}
        isLoading={isPending}
        title="Delete Wastage Record"
        description={`Are you sure you want to delete this wastage record for ${deleteLog?.rawMaterial?.name}? This will instantly refund ${deleteLog?.quantityWasted} units back to your active warehouse inventory.`}
        confirmText="Delete & Refund Stock"
        confirmButtonClass="bg-rose-600 hover:bg-rose-700 text-white"
      />
    </>
  );
}

export default WastageTable;