/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2, Loader2, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";

// Adjust these imports based on your actual project structure
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { productionSchema, ProductionFormValues } from "../../schema/production-schema";
import { useMutateProduction } from "../../api/use-mutate-production";
// Assuming you have a standard hook to fetch your branch's products/inventory
import { useProducts } from "@/features/manage/products/api/use-products";
import { ProductionBatch } from "../../types/production";

interface ProductionBatchFormProps {
  branchId: string;
  initialData?: ProductionBatch;
  onSuccess?: () => void;
}

const ProductionBatchForm = ({ branchId, initialData, onSuccess }: ProductionBatchFormProps) => {
  const isEdit = !!initialData;
  const { mutateAsync: createBatch } = useMutateProduction(branchId);

  // Fetch available products to populate dropdowns
  const { data: productsData, isLoading: isLoadingProducts } = useProducts(branchId);
  const products = productsData?.products || [];

  // Map products to select options
  const productOptions = products.map((p: any) => ({
    label: `${p.name} (Stock: ${p.currentStock})`,
    value: p.id,
  }));

  const methods = useForm<ProductionFormValues>({
    resolver: yupResolver(productionSchema),
    defaultValues: {
      productId: initialData?.productId || "",
      yieldQuantity: initialData?.yieldQuantity || 1,
      supervisorName: initialData?.supervisorName || "",
      productionDate: initialData?.productionDate
        ? new Date(initialData.productionDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      consumedItems: initialData?.consumedItems?.map(item => ({
        rawMaterialId: item.rawMaterialId,
        quantityUsed: item.quantityUsed,
      })) || [{ rawMaterialId: "", quantityUsed: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "consumedItems",
  });

  const onSubmit = async (data: ProductionFormValues) => {
    try {
      const payload = {
        ...data,
        branchId
      }
      if (isEdit) {
        // TODO: Call your update mutation here if you build one
        // await updateBatch({ id: initialData.id, ...data });
      } else {
        await createBatch(payload);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is handled in the mutation hook via Sonner
    }
  };

  if (isLoadingProducts) {
    return <div className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-2xl border border-slate-200">

        {/* SECTION 1: FINISHED GOOD YIELD */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Factory className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Batch Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              name="productId"
              label="Finished Product (Output)"
              options={productOptions}
              placeholder="Select what you produced..."
              disabled={isEdit} // Usually, you shouldn't change the core product on an edit
            />
            <FormInput
              name="yieldQuantity"
              label="Yield Quantity"
              type="number"
              placeholder="e.g., 500"
            />
            <FormInput
              name="supervisorName"
              label="Supervisor Name"
              placeholder="e.g., Tariq Mahmood"
            />
            <FormInput
              name="productionDate"
              label="Production Date"
              type="date"
            />
          </div>
        </div>

        {/* SECTION 2: RAW MATERIALS CONSUMED */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Raw Materials Consumed</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ rawMaterialId: "", quantityUsed: 1 })}
              className="text-xs text-sky-600 border-sky-200 hover:bg-sky-50"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Material
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl relative group">
                <div className="flex-1">
                  <FormSelect
                    name={`consumedItems.${index}.rawMaterialId`}
                    label={index === 0 ? "Raw Material" : undefined}
                    options={productOptions}
                    placeholder="Select raw material..."
                  />
                </div>
                <div className="w-32">
                  <FormInput
                    name={`consumedItems.${index}.quantityUsed`}
                    label={index === 0 ? "Qty Used" : undefined}
                    type="number"
                  />
                </div>

                {/* Only show delete button if there's more than 1 item */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className={`p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ${index === 0 ? 'mt-7' : 'mt-0'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            className="text-slate-600 border-slate-200"
            onClick={() => { /* Handle Cancel / Close Modal */ }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={methods.formState.isSubmitting || !methods.formState.isValid}
            className="bg-sky-600 hover:bg-sky-700 text-white min-w-35"
          >
            {methods.formState.isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : isEdit ? (
              "Update Batch"
            ) : (
              "Log Batch"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductionBatchForm;