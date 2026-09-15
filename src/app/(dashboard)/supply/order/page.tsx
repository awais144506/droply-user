"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { usePurchaseOrders, PurchaseOrder } from "@/features/supply/order/api/use-purchase-orders";
import { POStats } from "@/features/supply/order/components/po-stats";
import { POTable } from "@/features/supply/order/components/po-table";
import { Button } from "@/components/ui/button";

export default function PurchaseOrdersPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: orders = [], isLoading } = usePurchaseOrders(branchId);

  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);

  if (isTenantLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading purchase orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Orders (PO)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Issue procurement orders to vendors and receive incoming inventory.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPO(null);
            setIsModalOpen(true);
          }}
          className="bg-sky-600 hover:bg-sky-700 text-white h-10 px-4 rounded-xl shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" /> Create Purchase Order
        </Button>
      </div>

      <POStats orders={orders} />

      <POTable
        orders={orders}
        onEdit={(po) => {
          setEditingPO(po);
          setIsModalOpen(true);
        }}
      />

      {/* PO Form Modal placeholder (to be built next) */}
      {/* <POFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingPO}
      /> 
      */}
    </div>
  );
}