"use client";
import { useMemo } from "react";
import DataTable from "@/lib/utils/data-table";
import TablePagination from "@/lib/utils/table-pagination";
import { Vehicle } from "../types/fleet";
import { usePagination } from "@/lib/utils/pagination-calculation";
import { getFleetColumns } from "./fleet-columns";
import { useRouter } from "next/navigation";

interface FleetTableProps {
  vehicles: Vehicle[];
}

export function FleetTable({
  vehicles,
}: FleetTableProps) {
  const router = useRouter();
  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    itemsPerPage,
  } = usePagination(vehicles);
  const columns = useMemo(() => getFleetColumns(), []);


  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <DataTable
        data={paginatedData}
        columns={columns}
        emptyMessage="No vehicles found matching your criteria."
        onRowClick={(vehicle) => router.push(`/admin/fleet/${vehicle.id}`)}
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}