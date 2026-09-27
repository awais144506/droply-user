"use client";
import { useRole } from "@/lib/hooks/use-role";
import Loading from "@/app/loading";
import QuickSale from "@/features/dashboard/components/quick-sale";
import LowStockAlerts from "@/features/dashboard/components/lowstock-alerts";
import DashboardHeader from "@/features/dashboard/components/header";
import DashboardStats from "@/features/dashboard/components/dashboard-stats";
import { useProducts } from "@/features/manage/products/api/use-products";

export default function DashboardPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading } = useProducts(branchId);
  const lowStockItems = data?.lowStockProducts;

  if (isTenantLoading || isLoading) return <Loading text="Loading dashboard..." />
  return (
    <>
      <div className="space-y-6 pb-12">
        <DashboardHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardStats />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <QuickSale />
          <LowStockAlerts
            lowStockItems={lowStockItems}
          />
        </div>
      </div>
    </>
  );
}