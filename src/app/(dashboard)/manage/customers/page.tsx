"use client";
import PageHeader from "@/lib/utils/components/MainPageHeader";
import ActivityLogsCard from "@/lib/utils/components/ActivityLogsMainPage";
import { useCustomers } from "@/features/manage/customers/api/use-customer";
import { useRole } from "@/lib/hooks/use-role";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import { CustomerStats } from "@/features/manage/customers/components/main/customer-stats";
import { CustomersTable } from "@/features/manage/customers/components/main/customer-table";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { useSearchParams } from "next/navigation";
import { FilterTabs } from "@/features/manage/customers/components/data/dropdownOptions";
import { CustomerRequestsList } from "@/features/manage/customers/components/main/customer-requests-list";

export default function CustomersPage() {
  const { branchId } = useRole();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const debt = searchParams.get("debt") || undefined;

  const { data, isError, error, isLoading } = useCustomers(branchId, debt, search);

  const customers = data?.customers || [];
  const stats = data?.stats || { activeCount: 0, totalLedger: "0", totalAssets: 0 };
  const logs = data?.logs || [];
  const requests = data?.newCustomerRequest || [];

  if (isLoading) return <Loading text="Loading Customers..." />;
  if (isError) return <ErrorBoundary error={error.message} />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        heading="Customer Management"
        description="Manage customer accounts, sector routes, outstanding balances, and returnable asset liabilities."
        href="/manage/customers/create-customer"
        btnText="Add Customer"
      />

      <CustomerStats
        totalCustomers={customers.length}
        activeCount={stats.activeCount}
        totalDebt={stats.totalLedger}
        totalAssets={stats.totalAssets}
      />

      {/* Main Data Table - Full Width */}
      <div className="w-full">
        <DataTableFilterBar
          searchPlaceholder="Search by customer name / phone..."
          searchParamName="search"
          tabParamName="debt"
          tabs={FilterTabs}
        />
        <CustomersTable customers={customers} />
      </div>

      {/* Bottom Section: Requests & Logs side-by-side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <CustomerRequestsList
          requests={requests}
          isLoading={isLoading}
        />
        <ActivityLogsCard
          title="Customer Activity Logs"
          logs={logs}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}