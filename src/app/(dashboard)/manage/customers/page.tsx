"use client";

import PageHeader from "@/utils/page-header";
import ActivityLogsCard from "@/utils/activity-logs-card";
import { useCustomers, useCustomerLogs } from "@/features/customers/api/use-customers";
import { useRole } from "@/hooks/use-role";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import { CustomerStats } from "@/features/customers/components/customer-stats";
import { CustomersTable } from "@/features/customers/components/customer-table";

export default function CustomersPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: customers = [], isError, error, isLoading } = useCustomers(branchId);
  const { data: logs = [] } = useCustomerLogs(branchId);

  // Stats
  const activeCount = customers.filter((c) => c.status === "ACTIVE").length;
  const totalDebt = customers.reduce((sum, c) => sum + Number(c.customerCredit || 0), 0);
  const totalAssets = customers
    .flatMap((customer) => customer.returnables || [])
    .reduce((sum, item) => sum + Number(item.currentBalance || 0), 0);

  if (isTenantLoading || isLoading) return <Loading />;
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
        activeCount={activeCount}
        totalDebt={totalDebt}
        totalAssets={totalAssets}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 space-y-4">
          <CustomersTable
            customers={customers}
          />
        </div>

        <div className="lg:col-span-1">
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