"use client";
import { useMemo } from "react";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import { useRouter } from "next/navigation";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { getStaffColumns } from "./staff-columns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StaffTable({ staff }: { staff?: any[] }) {
  const router = useRouter();
  const { currentPage, setCurrentPage, paginatedData, totalPages, totalItems, itemsPerPage } = usePagination(staff);
  const columns = useMemo(() => getStaffColumns(), []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <DataTable
        data={paginatedData}
        columns={columns}
        emptyMessage="No staff records match your search criteria."
        onRowClick={(user) => router.push(`/admin/staff/${user.id}`)}
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