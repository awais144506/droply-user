"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { useProduction } from "@/features/stock/production/api/use-production";
import { ProductionStats } from "@/features/stock/production/components/production-stats";
import { ProductionTable } from "@/features/stock/production/components/production-table";
import { toast } from "sonner";

export default function ProductionPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: batches = [], isLoading } = useProduction(branchId);

  const handleNewBatch = () => {
    toast.info("Opening New Production Batch modal...");
  };

  if (isTenantLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading production logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Production & Refill Logs</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track assembly output, raw material consumption, and daily stock conversions.
        </p>
      </div>

      <ProductionStats batches={batches} />
      <ProductionTable batches={batches} onNewBatch={handleNewBatch} />
    </div>
  );
}