"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { ZoneDetails } from "../types";
import { useRouter } from "next/navigation";
import DataTable from "@/utils/data-table";
import { getCustomerColumns } from "./customer-columns";
import { usePagination } from "@/utils/pagination-calculation";
import TablePagination from "@/utils/table-pagination";
import { CustomerDetails } from "@/features/customers/types/customer";

interface ZoneCustomersTableProps {
  customers: ZoneDetails["customers"];
}

export function ZoneCustomersTable({ customers }: ZoneCustomersTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const { currentPage, setCurrentPage, paginatedData, totalPages, totalItems, itemsPerPage } = usePagination(filteredCustomers);
  const columns = useMemo(() => getCustomerColumns(), []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Table Header & Search */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-800">
          Enrolled Customers ({customers.length})
        </h3>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <DataTable
        data={paginatedData as unknown as CustomerDetails[]}
        columns={columns}
        emptyMessage="No customers match your filters."
        onRowClick={(customer) => router.push(`/manage/customers/${customer.id}`)}
      />

      {totalItems > 0 && (
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