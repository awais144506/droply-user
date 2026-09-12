"use client";
import PageHeader from "@/utils/page-header";
import ActivityLogsCard from "@/utils/activity-logs-card";
import { useCustomers, useCustomerLogs } from "@/features/customers/api/use-customer";
import { useRole } from "@/hooks/use-role";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import { CustomerStats } from "@/features/customers/components/customer-stats";
import { CustomersTable } from "@/features/customers/components/customer-table";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { useSearchParams } from "next/navigation";

export default function CustomersPage() {
  const { branchId } = useRole();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const debt = searchParams.get("debt")  || undefined

  const { data, isError, error, isLoading } = useCustomers(branchId, debt, search);
  const { data: logs = [] } = useCustomerLogs(branchId);
  const customers = data?.customers || [];
  const stats = data?.stats || { activeCount: 0, totalLedger: "0", totalAssets: 0 };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorBoundary error={error.message} />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        heading="Customer Management"
        description="Manage customer accounts, sector routes, outstanding balances, and returnable asset liabilities."
        href="/manage/customers/create-customer"
        btnText="Add New Customer"
      />

      <CustomerStats
        totalCustomers={customers.length}
        activeCount={stats.activeCount}
        totalDebt={stats.totalLedger}
        totalAssets={stats.totalAssets}
      />

      <div>
        <div className="lg:col-span-2">
          <DataTableFilterBar
            searchPlaceholder="Search by customer name/code"
            searchParamName="search"
            tabParamName="debt"
            tabs={[
              { label: "All", value: "" },
              { label: "Has Debt", value: "DEBT" },
              { label: "Clear", value: "CLEAR" },
            ]}
          />
          <CustomersTable
            customers={customers}
          />
        </div>

        <div className="mt-5">
          <div className="sticky top-6">
            <ActivityLogsCard
              title="Customer Activity Logs"
              logs={logs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}