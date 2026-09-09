/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import DataTable from "@/utils/data-table";
import TablePagination from "@/utils/table-pagination";
import { getStaffColumns } from "./staff-columns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StaffTable({ staff }: { staff: any[] }) {
  const router = useRouter();

  // 1. State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 2. Filter Logic (Remove OWNERs and Apply Search)
  const filteredStaff = useMemo(() => {
    // Note: Prisma schema uses `designation`, so we check both just in case
    let filtered = staff.filter(s => s.designation !== "OWNER" && s.role !== "OWNER");

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.phone.includes(query) ||
        s.staffCode?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [staff, searchQuery]);

  // 3. Pagination Math
  const totalItems = filteredStaff.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStaff.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStaff, currentPage]);

  // Reset to page 1 if search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const columns = getStaffColumns();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">

      {/* Search Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff by name, phone, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>
      </div>

      {/* Main Data Table */}
      <DataTable
        data={paginatedData}
        columns={columns}
        emptyMessage="No staff records match your search criteria."
        onRowClick={(user) => router.push(`/admin/staff/${user.id}`)}
      />

      {/* Pagination Footer */}
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