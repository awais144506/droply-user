"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { useProducts } from "@/features/products/api/use-products";
import { ProductStats } from "@/features/products/components/product-stats";
import { ProductsTable } from "@/features/products/components/products-table";
import { buttonVariants } from "@/components/ui/button";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";

export default function ProductsPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: products = [], isLoading, isError, error } = useProducts(branchId);

  if (isTenantLoading || isLoading) return <Loading />
  if (isError) return <ErrorBoundary error={error.message} />

  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Catalog & Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your finished goods, raw materials, returnables, and pricing.
          </p>
        </div>

        <Link
          href="/manage/products/create-item"
          className={buttonVariants({ variant: "create" })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Link>
      </div>

      {/* Analytics Summary */}
      <ProductStats products={products} />

      {/* Main Inventory Table */}
      <ProductsTable products={products} />

    </div>
  );
}