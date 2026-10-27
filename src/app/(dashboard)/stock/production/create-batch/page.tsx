"use client";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";
import { ProductionBatchForm } from "@/features/stock/production/components/create/ProductionBatchForm";
import { useRole } from "@/lib/hooks/use-role";

const CreateNewBatch = () => {
  const { branchId } = useRole();

  return (
    <div className="min-w-5xl mx-auto py-6">
      <CreateFormHeader
        title="Log New Production Batch"
        description="Record finished goods output and deduct raw materials from inventory."
        breadcrumbs={[
          { label: "Production Batches", href: "/stock/production" },
          { label: "Create Batch" }
        ]}
      />

      <ProductionBatchForm
        branchId={branchId}
      />
    </div>
  );
};

export default CreateNewBatch;