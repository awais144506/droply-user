"use client";

import { useRole } from "@/hooks/use-role";
import { useProducts, useProductLogs } from "@/features/products/api/use-products";
import { ProductStats } from "@/features/products/components/product-stats";
import { ProductsTable } from "@/features/products/components/products-table";
import PageHeader from "@/utils/page-header";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import ActivityLogsCard from "@/utils/activity-logs-card";

export default function ProductsPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: products = [], isLoading, isError, error } = useProducts(branchId);
  const { data: logs = [] } = useProductLogs(branchId);
  const totalItems = products.length;
  const lowStockCount = products.filter(p => p.stockOnHand <= p.lowStockThreshold).length;
  const returnablesCount = products.filter(p => p.trackingType === "RETURNABLE").length;
  const recipeItemsCount = products.filter(p => p.hasRecipe).length;

  //LOADING & ERROR
  if (isTenantLoading || isLoading) return <Loading />
  if (isError) return <ErrorBoundary error={error.message} />

  //JSX COMPONENT
  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">
      <PageHeader
        heading="Products Inventory"
        description="Manage your finished goods, raw materials, returnables, and pricing."
        href="/manage/products/create-item"
        btnText="Add New Item"
      />
      <ProductStats
        totalItems={totalItems}
        lowStockCount={lowStockCount}
        returnablesCount={returnablesCount}
        recipeItemsCount={recipeItemsCount}
      />
      <ProductsTable products={products} />

      <div className="mt-8">
        <ActivityLogsCard
          title="Inventory Activity Logs"
          logs={logs}
        />
      </div>
    </div>
  );
}