"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CustomerList } from "../types/customer";
import { usePagination } from "@/utils/pagination-calculation";
import DataTable from "@/utils/data-table";
import TablePagination from "@/utils/table-pagination";
import { getCustomerColumns } from "./customer-columns";

interface CustomersTableProps {
  customers: CustomerList[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const router = useRouter();
  const { currentPage, setCurrentPage, paginatedData, totalPages, totalItems, itemsPerPage } = usePagination(customers);
  const columns = useMemo(() => getCustomerColumns(), []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">

      <DataTable
        data={paginatedData}
        columns={columns}
        emptyMessage="No customers match your filters."
        onRowClick={(customer) => router.push(`/manage/customers/${customer.id}`)}
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