"use client";

import React from "react";
import ProductionBatchForm from "@/features/stock/production/components/create/ProductionBatchForm";
import { useRole } from "@/lib/hooks/use-role";

const CreateNewBatch = () => {
  const { branchId } = useRole();

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Log New Production Batch</h1>
        <p className="text-sm text-slate-500 mt-1">
          Record finished goods output and deduct raw materials from inventory.
        </p>
      </div>

      <ProductionBatchForm
        branchId={branchId}
      />
    </div>
  );
};

export default CreateNewBatch;