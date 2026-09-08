"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation"; // 👈 1. Import useRouter
import { CustomerDetails } from "../types/customer";
import { usePagination } from "@/utils/pagination-calculation";
import DataTable from "@/utils/data-table";
import TablePagination from "@/utils/table-pagination";
import { getCustomerColumns } from "./customer-columns";
import { CustomersFilterBar } from "./customers-filter-bar";

interface CustomersTableProps {
  customers: CustomerDetails[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const router = useRouter();

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDebt, setFilterDebt] = useState<"ALL" | "DEBT" | "CLEAR">("ALL");

  // Filtering Logic
  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.customerCode.toLowerCase().includes(query) ||
      (c.address?.toLowerCase() || "").includes(query);

    if (!matchesSearch) return false;
    if (filterDebt === "DEBT") return Number(c.customerCredit) > 0;
    if (filterDebt === "CLEAR") return Number(c.customerCredit) <= 0;

    return true;
  });

  const { currentPage, setCurrentPage, paginatedData, totalPages, totalItems, itemsPerPage } = usePagination(filteredCustomers);
  const columns = useMemo(() => getCustomerColumns(), []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <CustomersFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterDebt={filterDebt}
        setFilterDebt={setFilterDebt}
      />

      <DataTable
        data={paginatedData}
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