"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileDown } from "lucide-react";
import { CustomerDetails } from "../../types/customer";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { getCustomerColumns } from "./customer-columns";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { FilterTabs } from "@/features/manage/customers/components/data/dropdownOptions";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { exportCustomersToBwPdf } from "@/lib/utils/functions/generatePdfs/export-customers-pdf";

interface CustomersTableProps {
  customers: CustomerDetails[];
  branchSettings?: BranchSettingData;
}

export function CustomersTable({ customers, branchSettings }: CustomersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    itemsPerPage,
  } = usePagination(customers);

  const columns = useMemo(
    () => getCustomerColumns({ branchSettings }),
    [branchSettings]
  );

  const handleDownloadPdf = () => {
    exportCustomersToBwPdf({
      customers, // Exports ALL currently filtered customers (not just current page)
      branchSettings,
      filters: {
        search: searchParams.get("search") || undefined,
        debt: searchParams.get("debt") || undefined,
        schedule: searchParams.get("schedule") || undefined,
      },
    });
  };

  return (
    <div>
      <DataTableFilterBar
        searchPlaceholder="Search by customer name / phone..."
        searchParamName="search"
        tabParamName="debt"
        tabs={FilterTabs}
        dropdownOptions={[
          { label: "Everyday", value: "EVERYDAY" },
          { label: "Monday", value: "MONDAY" },
          { label: "Tuesday", value: "TUESDAY" },
          { label: "Wednesday", value: "WEDNESDAY" },
          { label: "Thursday", value: "THURSDAY" },
          { label: "Friday", value: "FRIDAY" },
          { label: "Saturday", value: "SATURDAY" },
          { label: "Sunday", value: "SUNDAY" },
          { label: "On-Demand", value: "ON_DEMAND" },
        ]}
        dropdownParamName="schedule"
        dropdownPlaceholder="All Schedules"
        rightSlot={
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={customers.length === 0}
            title="Download filtered customers as B&W PDF"
            className="h-11 px-3.5 bg-white hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-200 hover:border-slate-900 rounded-xl flex items-center gap-2 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileDown className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        }
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