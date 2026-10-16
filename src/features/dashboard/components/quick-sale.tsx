"use client";
import { useState } from "react";
import ThermalReceiptDialog, {
  ReceiptOrderData,
} from "./thermal-receipt-dialog";
import NavigationHeader from "./navigation-header";
import ProductSelection from "./product-selection-checkout";
import QuickSaleHistory from "./history-orders-table";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { useRole } from "@/lib/hooks/use-role";
import { QuickSaleProduct, QuickSaleRecord } from "../types/quicksale";
import ErrorBoundary from "@/app/error";

const QuickSale = () => {
  const { branchId, userId } = useRole(); // Adjust if your staffId is named differently in useRole()
  const { data, isLoading: isLoadingProducts, isError, error } = useProducts(branchId);
  const { fetchBranchSettings } = useBranchSettings(branchId);

  const products: QuickSaleProduct[] = data?.quickSaleOptions || [];
  const branchDetails = fetchBranchSettings.data;

  const [completedOrder, setCompletedOrder] = useState<ReceiptOrderData | null>(null);
  const [editingSale, setEditingSale] = useState<QuickSaleRecord | null>(null);

  if (isError) {
    return (
      <ErrorBoundary
        error={error?.message || "Failed to load products for quick sale"}
      />
    );
  }

  const handleStartEdit = (sale: QuickSaleRecord) => {
    setEditingSale(sale);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <NavigationHeader />

      <ProductSelection
        branchId={branchId || ""}
        staffId={userId || ""}
        products={products}
        isLoading={isLoadingProducts}
        onOrderComplete={(orderSnapshot) => setCompletedOrder(orderSnapshot)}
        editingSale={editingSale}
        onCancelEdit={() => setEditingSale(null)}
      />

      {/* Live Paginated & Filtered Quick Sale History Table */}
      <QuickSaleHistory
        branchId={branchId || ""}
        branchDetails={branchDetails}
        onEditSale={handleStartEdit}
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