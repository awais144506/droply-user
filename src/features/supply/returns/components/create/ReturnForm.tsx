/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2, Info, AlertTriangle } from "lucide-react";

import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";

import { useRole } from "@/lib/hooks/use-role";
import { createReturnSchema, CreateReturnFormValues } from "../../schema/returns-schema";
import { PurchaseReturn } from "../../types/returns";
import { useCreateReturn } from "../../api/use-mutate-returns";

import { useSuppliers } from "@/features/supply/suppliers/api/use-suppliers";
import { usePurchaseOrders } from "@/features/supply/order/api/use-po";

interface ReturnFormProps {
    initialData?: PurchaseReturn;
}

export default function ReturnForm({ initialData }: ReturnFormProps) {
    const router = useRouter();
    const { branchId } = useRole();

    const isEditing = !!initialData;
    const { mutate: createReturn, isPending: isCreating } = useCreateReturn();

    // 1. Fetch Related Data
    const { data: supplierData, isLoading: isLoadingSuppliers } = useSuppliers(branchId);
    const { data: poData, isLoading: isLoadingPOs } = usePurchaseOrders(branchId);

    // 2. Setup Form
    const methods = useForm<CreateReturnFormValues>({
        resolver: yupResolver(createReturnSchema),
        mode: "onChange",
        defaultValues: {
            supplierId: initialData?.supplierId || "",
            poId: initialData?.poId || "",
            notes: initialData?.notes || "",
            items: initialData?.items.map(item => ({
                branchProductId: item.branchProductId,
                supplierItemName: item.supplierItemName,
                unitCost: item.unitCost,
                quantityReturned: item.quantityReturned,
            })) || [
                    { branchProductId: "", supplierItemName: "", unitCost: 0, quantityReturned: 1 }
                ],
        },
    });

    const { handleSubmit, watch, setValue, control } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    // 3. Dynamic Dropdown Logic & Live Calculations
    const selectedSupplierId = watch("supplierId");
    const selectedPOId = watch("poId");
    const watchedItems = useWatch({ control, name: "items" }) || [];

    // Calculate live financial total
    const liveTotalValue = watchedItems.reduce((sum, item) => sum + ((item?.quantityReturned || 0) * (item?.unitCost || 0)), 0);

    // Extract already selected products to prevent duplicates
    const selectedProductIds = watchedItems.map(item => item?.branchProductId).filter(Boolean);

    // Filter POs: Only show POs for this supplier that have actually been RECEIVED into stock
    const poOptions = useMemo(() => {
        if (!poData?.orders) return [];
        return poData.orders
            .filter(po => po.supplierId === selectedSupplierId && po.status === "RECEIVED")
            .map(po => ({
                label: po.poNumber,
                value: po.id,
                balanceDue: po.balanceDue,
            }));
    }, [poData?.orders, selectedSupplierId]);

    // Extract exact products from the selected PO's JSON structure
    const productOptions = useMemo(() => {
        if (!poData?.orders || !selectedPOId) return [];

        const selectedPO = poData.orders.find(po => po.id === selectedPOId);

        if (selectedPO && selectedPO.items) {
            return selectedPO.items.map(item => ({
                label: item.branchProduct?.name || 'Unknown',
                value: item.branchProduct?.id,
                unitCost: item.unitCost,
                supplierItemName: item.supplierItemName,
                currentStock: item.branchProduct.currentStock
            }));
        }

        return [];
    }, [poData?.orders, selectedPOId]);

    // 🔥 Safety Net: Ensure they aren't trying to return more than they physically have
    const isStockError = watchedItems.some(item => {
        if (!item.branchProductId) return false;
        const product = productOptions.find(p => p.value === item.branchProductId);
        return product ? (product.currentStock < (item.quantityReturned || 0)) : false;
    });

    // 4. Auto-Fill Side Effects
    // Reset PO and items if the user changes the Supplier
    useEffect(() => {
        if (!isEditing) {
            setValue("poId", "");
            setValue("items", [{ branchProductId: "", supplierItemName: "", unitCost: 0, quantityReturned: 1 }]);
        }
    }, [selectedSupplierId, setValue, isEditing]);

    // Auto-fill Unit Cost and Description when a product is selected
    useEffect(() => {
        watchedItems.forEach((item, index) => {
            if (item.branchProductId) {
                const matchedProduct = productOptions.find(p => p.value === item.branchProductId);
                if (matchedProduct) {
                    // Only update if it doesn't match to avoid infinite re-render loops
                    if (item.unitCost !== matchedProduct.unitCost) {
                        setValue(`items.${index}.unitCost`, matchedProduct.unitCost, { shouldValidate: true });
                    }
                    if (item.supplierItemName !== matchedProduct.supplierItemName) {
                        setValue(`items.${index}.supplierItemName`, matchedProduct.supplierItemName, { shouldValidate: true });
                    }
                }
            }
        });
    }, [watchedItems, productOptions, setValue]);

    // 5. Form Submission
    const onSubmit = (values: CreateReturnFormValues) => {
        const payload = {
            ...values,
            branchId
        }
        if (isEditing && initialData) {
            // Edit logic here if applicable
        } else {
            createReturn(payload, {
                onSuccess: () => router.push("/supply/returns")
            });
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-5xl mx-auto">
            <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">
                    {isEditing ? "Edit Debit Note" : "Log Purchase Return"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    {isEditing ? "Modify the pending return details." : "Create a debit note for defective or rejected shipments."}
                </p>

                {!isEditing && (
                    <div className="mt-4 flex items-start gap-2 bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-200 text-sm">
                        <Info className="h-5 w-5 text-amber-600 shrink-0" />
                        <p>
                            <strong>Inventory Notice:</strong> Physical items will be deducted immediately from your inventory upon logging this record. Stock will only be restored if replacements are issued during case resolution.
                        </p>
                    </div>
                )}
            </div>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Header References */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <FormSelect
                            name="supplierId"
                            label="Supplier Firm"
                            options={supplierData?.supplierOptions || []}
                            placeholder={isLoadingSuppliers ? "Loading..." : "Select Supplier"}
                            disabled={isEditing || isLoadingSuppliers}
                        />

                        <FormSelect
                            name="poId"
                            label="Purchase Order Ref"
                            options={poOptions}
                            placeholder={!selectedSupplierId ? "Select a supplier first" : isLoadingPOs ? "Loading POs..." : "Select Received PO"}
                            disabled={isEditing || !selectedSupplierId || isLoadingPOs}
                            formatOptionLabel={(opt) => (
                                <div className="flex items-center justify-between w-full pr-1">
                                    <span className="font-medium mr-2">{opt.label}</span>
                                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-rose-600 shadow-sm bg-rose-50">
                                        Remaining: Rs {opt.balanceDue?.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        />
                    </div>

                    {/* Dynamic Items Table */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Returned Items</h3>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Value to Resolve</p>
                                <p className="text-xl font-bold text-rose-600">Rs {liveTotalValue.toLocaleString()}</p>
                            </div>
                        </div>

                        {fields.map((field, index) => {
                            // Filter options so users cannot select the same product twice
                            const currentProductId = watchedItems[index]?.branchProductId;
                            const currentQty = watchedItems[index]?.quantityReturned || 0;

                            const availableProductOptions = productOptions.filter(opt =>
                                opt.value === currentProductId || !selectedProductIds.includes(opt.value as string)
                            );

                            return (
                                <div key={field.id} className="flex flex-col md:flex-row gap-4 items-start p-4 border border-slate-100 rounded-xl relative bg-white hover:border-rose-100 transition-colors">
                                    <div className="flex-1 min-w-62.5">
                                        <FormSelect
                                            name={`items.${index}.branchProductId`}
                                            label="Inventory Product"
                                            options={availableProductOptions}
                                            placeholder={!selectedPOId ? "Select PO first" : "Select Product"}
                                            disabled={isEditing || !selectedPOId}
                                            formatOptionLabel={(opt) => {
                                                // 🔥 Live stock calculation for the dropdown
                                                const isSelected = opt.value === currentProductId;
                                                const deduction = isSelected ? Number(currentQty) : 0;
                                                const displayStock = (opt.currentStock || 0) - deduction;
                                                const isNegative = displayStock < 0;

                                                return (
                                                    <div className="flex items-center justify-between w-full pr-1">
                                                        <div className="flex flex-col items-start">
                                                            <span className="font-medium text-slate-900">{opt.label}</span>
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 transition-colors ${isNegative ? "text-rose-600"
                                                                    : isSelected ? "text-amber-600"
                                                                        : "text-slate-500"
                                                                }`}>
                                                                Stock: {displayStock}
                                                            </span>
                                                        </div>
                                                        <span className="shrink-0 ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm bg-sky-600">
                                                            Rs {opt.unitCost?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                )
                                            }}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <FormInput
                                            name={`items.${index}.supplierItemName`}
                                            label="Supplier Item Ref"
                                            type="text"
                                            placeholder="Auto-filled..."
                                            disabled // This should match exactly what was on the PO
                                        />
                                    </div>

                                    <div className="w-full md:w-28">
                                        <FormInput
                                            name={`items.${index}.unitCost`}
                                            label="Unit Cost (Rs)"
                                            type="number"
                                            placeholder="0.00"
                                            disabled // Prevents manipulation of the financial return ledger
                                        />
                                    </div>

                                    <div className="w-full md:w-28">
                                        <FormInput
                                            name={`items.${index}.quantityReturned`}
                                            label="Return Qty"
                                            type="number"
                                            min={1}
                                            placeholder="1"
                                            disabled={isEditing}
                                        />
                                    </div>

                                    {!isEditing && fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="mt-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}

                        {isStockError && (
                            <div className="flex justify-end">
                                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-2 rounded-lg text-sm font-medium border border-rose-100">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Return quantity exceeds currently available stock.</span>
                                </div>
                            </div>
                        )}

                        {!isEditing && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ branchProductId: "", supplierItemName: "", unitCost: 0, quantityReturned: 1 })}
                                className="w-full border-dashed border-2 text-slate-500 hover:text-sky-600 border-slate-200 hover:border-sky-200 hover:bg-sky-50 mt-2"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add Another Item
                            </Button>
                        )}
                    </div>

                    <div className="pt-2">
                        <FormInput
                            name="notes"
                            label="Internal Notes / Reason for Return"
                            type="text"
                            placeholder="e.g. Entire batch of 55mm caps arrived melted. Awaiting replacement."
                        />
                    </div>

                    <FormCTAFooter
                        ctaText="Create Return"
                        isPending={isCreating}
                        isDirty={methods.formState.isDirty}
                        isValid={methods.formState.isValid && !isStockError}
                        isEditMode={isEditing}
                        href="/supply/returns"
                    />
                </form>
            </FormProvider>
        </div>
    );
}