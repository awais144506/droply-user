"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/lib/utils/components/MainPageHeader";
import { useOrders } from "@/features/sales/orders/api/use-order";
import { useRole } from "@/lib/hooks/use-role";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import OrderTable from "@/features/sales/orders/components/OrderTable";

const Orders = () => {
  const { branchId } = useRole();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;
  const status = searchParams.get("status") || undefined;
  const date = searchParams.get("date") || undefined;

  const {
    data: orders = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isRefetching,
  } = useOrders(branchId, { search, category, status, date });

  // Only shows full-page loader on the initial cold load
  if (isLoading) return <Loading text="Loading orders..." />;
  if (isError)
    return (
      <ErrorBoundary
        error={(error as Error)?.message || "Failed to load orders"}
      />
    );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        heading="Sales & Dispatch Orders"
        description="Generate instant branch counter bills or schedule route deliveries for zones."
        href="/sales/orders/create-sale"
        btnText="Create New Sale"
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />
      <OrderTable orders={orders} isFetching={isFetching} />
    </div>
  );
};

export default Orders;