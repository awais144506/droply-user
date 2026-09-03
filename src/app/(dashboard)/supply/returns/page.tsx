"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { usePurchaseReturns, PurchaseReturn } from "@/features/returns/api/use-purchase-returns";
import { ReturnStats } from "@/features/returns/components/return-stats";
import { ReturnTable } from "@/features/returns/components/return-table";
import { Button } from "@/components/ui/button";

export default function PurchaseReturnsPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: returns = [], isLoading } = usePurchaseReturns(branchId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReturn, setEditingReturn] = useState<PurchaseReturn | null>(null);

  if (isTenantLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading return ledgers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Returns</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage debit notes for damaged or rejected vendor shipments.
          </p>
        </div>
        <Button 
          onClick={() => { setEditingReturn(null); setIsModalOpen(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white h-10 px-4 rounded-xl shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" /> Create Debit Note
        </Button>
      </div>

      <ReturnStats returns={returns} />
      
      <ReturnTable 
        returns={returns} 
        onEdit={(ret) => {
          setEditingReturn(ret);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}