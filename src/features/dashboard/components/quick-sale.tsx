"use client";
import { useState } from "react";
import ThermalReceiptDialog, {
  ReceiptOrderData,
} from "./thermal-receipt-dialog";
import NavigationHeader from "./navigation-header";
import ProductSelection, { QuickSaleProduct } from "./product-selection-checkout";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { useRole } from "@/lib/hooks/use-role";
import ErrorBoundary from "@/app/error";
import QuickSaleHistory from "./history-orders-table";

const QuickSale = () => {
  const { branchId } = useRole();
  const { data, isLoading: isLoadingProducts, isError, error } = useProducts(branchId);
  const { fetchBranchSettings } = useBranchSettings(branchId);

  const products: QuickSaleProduct[] = data?.quickSaleOptions || [];
  const branchDetails = fetchBranchSettings.data;

  // Thermal Receipt Modal State
  const [completedOrder, setCompletedOrder] = useState<ReceiptOrderData | null>(null);

  if (isError) {
    return <ErrorBoundary error={error?.message || "Failed to load products for quick sale"} />;
  }

  return (
    <div className="space-y-6">
      <NavigationHeader />

      <ProductSelection
        products={products}
        isLoading={isLoadingProducts}
        onOrderComplete={(orderSnapshot) => setCompletedOrder(orderSnapshot)}
      />
      <QuickSaleHistory 
      />
      <ThermalReceiptDialog
        isOpen={Boolean(completedOrder)}
        onClose={() => setCompletedOrder(null)}
        order={completedOrder}
        branchDetails={branchDetails}
      />
    </div>
  );
};

export default QuickSale;