"use client";

import { useRole } from "@/lib/hooks/use-role";
import { useProducts, useProductLogs } from "@/features/manage/products/api/use-products";
import { ProductStats } from "@/features/manage/products/components/main/product-stats";
import { ProductsTable } from "@/features/manage/products/components/main/products-table";
import PageHeader from "@/lib/utils/components/MainPageHeader";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import ActivityLogsCard from "@/lib/utils/components/ActivityLogsMainPage";

export default function ProductsPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading, isError, error } = useProducts(branchId);
  const { data: logs = [] } = useProductLogs(branchId);

  const products = data?.products;
  const stats = data?.stats || { totalItems: 0, lowStockCount: 0, returnablesCount: 0, recipeItemsCount: 0 };

  //LOADING & ERROR
  if (isTenantLoading || isLoading) return <Loading />
  if (isError) return <ErrorBoundary error={error.message} />

  //JSX COMPONENT
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        heading="Products Inventory"
        description="Manage your finished goods, raw materials, returnables, and pricing."
        href="/manage/products/create-item"
        btnText="Add New Item"
      />
      <ProductStats
        totalItems={stats?.totalItems}
        lowStockCount={stats?.lowStockCount}
        returnablesCount={stats?.returnablesCount}
        recipeItemsCount={stats.recipeItemsCount}
      />

      <ProductsTable
        products={products}
      />

      <div className="mt-8">
        <ActivityLogsCard
          title="Products Activity Logs"
          logs={logs}
        />
      </div>
    </div>
  );
}