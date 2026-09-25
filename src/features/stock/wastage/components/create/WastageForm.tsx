/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useWatch } from "react-hook-form"; 
import { AlertTriangle, Trash2 } from "lucide-react";

import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";

import { useAppForm } from "@/lib/hooks/use-app-form";
import { useRole } from "@/lib/hooks/use-role";
import { useCreateWastage } from "../../api/use-mutate-wastage";
import { createWastageSchema, CreateWastageFormValues } from "../../schema/create-wastage-schema";
import { useProducts } from "@/features/manage/products/api/use-products";

export default function WastageForm() {
    const router = useRouter();
    const { branchId } = useRole();
    const { mutateAsync: createWastage } = useCreateWastage(branchId);

    const { data: productsData, isLoading: isLoadingProducts } = useProducts(branchId);

    const productOptions = useMemo(() => {
        return productsData?.products?.map((p: any) => ({
            value: p.id,
            label: p.name,
            currentStock: p.currentStock,
            unitOfMeasure: p.unitOfMeasure || "Unit", 
        })) || [];
    }, [productsData]);

    const sourceOptions = [
        { value: "WAREHOUSE", label: "Warehouse (Storage Damage)" },
        { value: "TRANSIT", label: "Transit (Damaged during delivery)" },
        { value: "GENERAL", label: "General (Other)" },
    ];

    const methods = useAppForm(createWastageSchema, {
        rawMaterialId: "",
        quantityWasted: 1,
        reason: "",
        source: "WAREHOUSE",
    });

    const selectedMaterialId = useWatch({ control: methods.control, name: "rawMaterialId" });
    const quantityWasted = useWatch({ control: methods.control, name: "quantityWasted" });

    const selectedProduct = productOptions.find(p => p.value === selectedMaterialId);

    const onSubmit = async (data: CreateWastageFormValues) => {
        if (selectedProduct && selectedProduct.currentStock < data.quantityWasted) {
            methods.setError("quantityWasted", {
                type: "manual",
                message: `Exceeds available stock (${selectedProduct.currentStock})`,
            });
            return;
        }

        await createWastage(data);
        router.push("/stock/wastage");
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800 text-sm shadow-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                    <p>
                        <strong>Inventory Deduction:</strong> Submitting this form will instantly deduct the specified quantity from your active warehouse stock. Please ensure the quantities are accurate.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
                        <Trash2 className="w-5 h-5 text-rose-600" />
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                            Item & Quantity
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-1 md:col-span-2">
                            <FormSelect
                                name="rawMaterialId"
                                label="Select Item"
                                options={productOptions}
                                placeholder="Search inventory items..."
                                isSearchable={true}
                                isLoading={isLoadingProducts}
                                formatOptionLabel={(opt) => {
                                    const isSelected = opt.value === selectedMaterialId;
                                    const deduction = isSelected ? (Number(quantityWasted) || 0) : 0;
                                    const displayStock = opt.currentStock - deduction;
                                    const isNegative = displayStock < 0;

                                    return (
                                        <div className="flex justify-between items-center w-full pr-2">
                                            <span>{opt.label}</span>
                                            {opt.currentStock !== undefined && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase transition-colors ${
                                                    isNegative ? "bg-rose-100 text-rose-700" 
                                                    : isSelected ? "bg-amber-100 text-amber-700" 
                                                    : "bg-slate-100 text-slate-500"
                                                }`}>
                                                    {/* 🔥 Append UOM to the stock badge */}
                                                    Stock: {displayStock} {opt.unitOfMeasure.toLowerCase()}
                                                </span>
                                            )}
                                        </div>
                                    )
                                }}
                            />
                        </div>

                        <FormInput
                            name="quantityWasted"
                            label={selectedProduct ? `Quantity Wasted (${selectedProduct.unitOfMeasure.toLowerCase()})` : "Quantity Wasted"}
                            type="number"
                            min={0.01}
                            placeholder="e.g., 5"
                        />

                        <FormSelect
                            name="source"
                            label="Damage Source"
                            options={sourceOptions}
                            placeholder="Where did this happen?"
                        />

                        <div className="col-span-1 md:col-span-2">
                            <FormInput
                                name="reason"
                                label="Reason / Remarks"
                                type="text"
                                placeholder="e.g., Forklift accidentally crushed the box"
                            />
                        </div>
                    </div>
                </div>

                <FormCTAFooter
                    ctaText="Log Wastage"
                    href="/stock/wastage"
                    isValid={methods.formState.isValid}
                    isDirty={methods.formState.isDirty}
                    isEditMode={false}
                    isPending={methods.formState.isSubmitting}
                />
            </form>
        </FormProvider>
    );
}