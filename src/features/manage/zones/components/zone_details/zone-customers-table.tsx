"use client";

import { useMemo } from "react";
import { ZoneDetails } from "../../types";
import { useRouter } from "next/navigation";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import { getCustomerColumns } from "./zone-customer-columns";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import TablePagination from "@/lib/utils/components/TablePagination";
import { CustomerDetails } from "@/features/manage/customers/types/customer";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";


interface ZoneCustomersTableProps {
  customers: ZoneDetails["customers"];
}

export function ZoneCustomersTable({ customers }: ZoneCustomersTableProps) {
  const router = useRouter();
  const { currentPage, setCurrentPage, paginatedData, totalPages, totalItems, itemsPerPage } = usePagination(customers);
  const columns = useMemo(() => getCustomerColumns(), []);

  return (
    <div>
      {/* Table Header & Search */}
      <div className=" pr-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <DataTableFilterBar
          searchParamName="search"
          searchPlaceholder="Search by customer name..."
        />
        <h3 className="text-sm font-bold text-slate-800">
          Total Customers : {customers.length}
        </h3>
      </div>

      {/* Responsive Table Wrapper */}
      <DataTable
        data={paginatedData as unknown as CustomerDetails[]}
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