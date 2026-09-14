"use client";

import { Loader2 } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { useProducts } from "@/features/products/api/use-products";


export default function DashboardPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data, isLoading } = useProducts(branchId);
  const quickSaleOptions = data?.quickSaleOptions

    if(isTenantLoading || isLoading || !data) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
          <p className="text-sm font-medium">Syncing branch data...</p>
        </div>
      );
}

return (
  <div className="space-y-6 max-w-350 mx-auto p-6 print:p-0 print:m-0">
    <div className="print:hidden">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quick Sale</h1>
    </div>

    <div className="h-150 w-150">
      {/* <QuickSale items={quickSaleOptions} /> */}
    </div>
  </div>
);
}