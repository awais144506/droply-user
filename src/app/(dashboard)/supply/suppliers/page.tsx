"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { useSuppliers, Supplier } from "@/features/supply/suppliers/api/use-suppliers";
import { SupplierStats } from "@/features/supply/suppliers/components/supplier-stats";
import { SupplierTable } from "@/features/supply/suppliers/components/supplier-table";
import { Button } from "@/components/ui/button";

export default function SuppliersPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: suppliers = [], isLoading } = useSuppliers(branchId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  if (isTenantLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading procurement data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Suppliers & Vendor Accounts</h1>
          <p className="text-sm text-slate-500 mt-1">
            Vendors you purchase inventory, raw materials, and plant equipment from.
          </p>
        </div>
        <Button
          onClick={() => { setEditingSupplier(null); setIsModalOpen(true); }}
          variant="default"
        >
          <Plus className="h-4 w-4 mr-2" /> New Supplier
        </Button>
      </div>

      <SupplierStats suppliers={suppliers} />

      <SupplierTable
        suppliers={suppliers}
        onEdit={(supplier) => {
          setEditingSupplier(supplier);
          setIsModalOpen(true);
        }}
      />

      {/* Form Modal implementation goes here, hooked to isModalOpen */}
    </div>
  );
}