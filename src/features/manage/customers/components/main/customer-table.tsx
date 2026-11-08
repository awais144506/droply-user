"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CustomerDetails } from "../../types/customer";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { getCustomerColumns } from "./customer-columns";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { FilterTabs } from "@/features/manage/customers/components/data/dropdownOptions";
import { BranchSettingData } from "@/features/admin/settings/types/settings";

interface CustomersTableProps {
  customers: CustomerDetails[];
  branchSettings?: BranchSettingData;
}

export function CustomersTable({ customers, branchSettings }: CustomersTableProps) {
  const router = useRouter();
  const { currentPage, setCurrentPage, paginatedData, totalPages, totalItems, itemsPerPage } = usePagination(customers);
  const columns = useMemo(() => getCustomerColumns({ branchSettings }), [branchSettings]);

  return (
    <div>
      <DataTableFilterBar
        searchPlaceholder="Search by customer name / phone..."
        searchParamName="search"
        tabParamName="debt"
        tabs={FilterTabs}
        dropdownOptions={[
          { label: "Everyday", value: "EVERYDAY" },
          { label: "Custom Days", value: "CUSTOM_DAYS" },
          { label: "On-Demand", value: "ON_DEMAND" },
        ]}
        dropdownParamName="schedule"
        dropdownPlaceholder="All Schedules"
      />
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
    </div>
  );
}