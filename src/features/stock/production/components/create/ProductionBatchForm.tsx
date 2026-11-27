/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useMemo } from "react";
import { FormProvider, useWatch } from "react-hook-form";
import { Factory, Network } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { productionSchema, ProductionFormValues } from "../../schema/production-schema";
import { useMutateProduction, useUpdateProduction } from "../../api/use-mutate-production";
import { useProducts } from "@/features/manage/products/api/use-products";
import { ProductionBatch } from "../../types/production";
import { useAppForm, toDateInputString } from "@/lib/hooks/use-app-form";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";
import { buildCreateProductionPayload, buildUpdateProductionPayload } from "../../utils/production-payload";
import { RecipeProjection } from "./recipie-projection";

interface ProductionBatchFormProps {
  branchId: string;
  initialData?: ProductionBatch;
  isEdit?: boolean;
}

export const ProductionBatchForm = ({ branchId, initialData, isEdit }: ProductionBatchFormProps) => {

  const { mutateAsync: createBatch } = useMutateProduction(branchId);
  const { mutateAsync: updateBatch } = useUpdateProduction(branchId);

  const { data: productsData, isLoading: isLoadingProducts } = useProducts(branchId);
  const productionOptions = productsData?.productionOptions || [];

  const methods = useAppForm(productionSchema, {
    productId: initialData?.productId || "",
    expectedYield: initialData?.expectedYield || 1,
    supervisorName: initialData?.supervisorName || "",
    productionDate: toDateInputString(initialData?.productionDate),
  });

  // Watch values to dynamically calculate recipe deductions
  const selectedProductId = useWatch({ control: methods.control, name: "productId" });
  const expectedYield = useWatch({ control: methods.control, name: "expectedYield" }) || 0;

  const selectedProductDetails = useMemo(() => {
    return productionOptions.find(p => p.value === selectedProductId);
  }, [selectedProductId, productionOptions]);

  const onSubmit = async (data: ProductionFormValues) => {
    if (isEdit && initialData) {
      const updatePayload = buildUpdateProductionPayload(data, initialData.id);
      await updateBatch(updatePayload);
    } else {
      await createBatch(buildCreateProductionPayload(data, branchId));
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Put this right above SECTION 1 in your form */}
        {isEdit && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 sm:gap-3 text-amber-800 text-xs sm:text-sm leading-relaxed">
            <Factory className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-amber-600 mt-0.5" />
            <p className="min-w-0">
              <strong>Inventory Locked:</strong> To ensure supply chain integrity, you cannot change the Product or Expected Yield of an active batch. To correct a quantity mistake, please delete this batch and create a new one.
            </p>
          </div>
        )}

        {/* SECTION 1: BATCH DETAILS */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3.5 sm:mb-4 pb-2 border-b border-slate-100">
            <Factory className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Start Production Batch
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="min-w-0">
              <FormSelect
                name="productId"
                label="Finished Product (Output)"
                options={productionOptions}
                placeholder="Select product..."
                disabled={isEdit}
                isSearchable={true}
                isLoading={isLoadingProducts}
                formatOptionLabel={(opt) => (
                  <div className="flex items-center justify-between gap-2 w-full min-w-0 pr-1">
                    <span className="font-medium truncate min-w-0">{opt.label}</span>
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-slate-800 shadow-sm bg-gray-100 whitespace-nowrap">
                        {opt.category}
                      </span>
                      {opt.hasRecipe && (
                        <span className="shrink-0 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 flex items-center gap-1 w-fit px-1.5 sm:px-2 py-0.5 whitespace-nowrap">
                          <Network className="h-3 w-3 shrink-0" /> Recipe
                        </span>
                      )}
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="min-w-0">
              <FormInput
                name="expectedYield"
                label="Expected Yield"
                type="number"
                min={1}
                placeholder="e.g., 500"
                disabled={!selectedProductId || isEdit}
              />
            </div>

            <div className="min-w-0">
              <FormInput
                name="supervisorName"
                label="Supervisor Name"
                placeholder="e.g., Tariq Mahmood"
              />
            </div>

            <div className="min-w-0">
              <FormInput
                name="productionDate"
                label="Production Date"
                type="date"
                disableFutureDates={true}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: RECIPE PROJECTION (Auto-Calculated) */}
        <RecipeProjection
          selectedProductDetails={selectedProductDetails}
          expectedYield={expectedYield}
        />

        <FormCTAFooter
          ctaText="Start Production"
          href="/stock/production"
          isValid={methods.formState.isValid}
          isDirty={methods.formState.isDirty}
          isEditMode={isEdit}
          isPending={methods.formState.isSubmitting}
          icon={Factory}
        />
      </form>
    </FormProvider>
  );
};