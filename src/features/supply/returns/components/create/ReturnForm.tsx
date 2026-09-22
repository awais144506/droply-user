/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2, Info } from "lucide-react";

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

    // 3. Dynamic Dropdown Logic
    const selectedSupplierId = watch("supplierId");
    const selectedPOId = watch("poId");

    const poOptions = useMemo(() => {
        if (!poData?.orders) return [];
        return poData.orders
            .filter(po => po.supplierId === selectedSupplierId)
            .map(po => ({
                label: `${po.poNumber} (Remaining Balance: Rs ${po.balanceDue.toLocaleString()})`,
                value: po.id,
            }));
    }, [poData?.orders, selectedSupplierId]);

    // Extract exact products from the selected PO's JSON structure
    const productOptions = useMemo(() => {
        if (!poData?.orders || !selectedPOId) return [];

        const selectedPO = poData.orders.find(po => po.id === selectedPOId);

        if (selectedPO && selectedPO.items) {
            return selectedPO.items.map(item => ({
                label: `${item.branchProduct?.name || 'Unknown'} - ${item.supplierItemName} (Rs ${item.unitCost})`,
                value: item.branchProduct.id,
            }));
        }

        return [];
    }, [poData?.orders, selectedPOId]);

    // Auto-reset PO and items if the user changes the Supplier
    useEffect(() => {
        if (!isEditing) {
            setValue("poId", "");
        }
    }, [selectedSupplierId, setValue, isEditing]);

    // 4. Form Submission
    const onSubmit = (values: CreateReturnFormValues) => {
        const payload = {
            ...values,
            branchId
        }
        if (isEditing && initialData) {
            console.log("Update flow triggered");
        } else {
            createReturn(payload, {
                onSuccess: () => router.push("/supply/returns")
            });
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-5xl">
            <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">
                    {isEditing ? "Edit Debit Note" : "Log Purchase Return"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    {isEditing ? "Modify the pending return details." : "Create a debit note for defective or rejected shipments."}
                </p>

                {/* INVENTORY BEHAVIOR NOTE */}
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
                            placeholder={!selectedSupplierId ? "Select a supplier first" : isLoadingPOs ? "Loading POs..." : "Select PO"}
                            disabled={isEditing || !selectedSupplierId || isLoadingPOs}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Returned Items</h3>
                            {!isEditing && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ branchProductId: "", supplierItemName: "", unitCost: 0, quantityReturned: 1 })}
                                    className="h-8 text-sky-600 border-sky-200 hover:bg-sky-50"
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add Item
                                </Button>
                            )}
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-col md:flex-row gap-4 items-start p-4 border border-slate-100 rounded-xl relative hover:border-sky-100 transition-colors">

                                <div className="flex-1 min-w-62.5">
                                    <FormSelect
                                        name={`items.${index}.branchProductId`}
                                        label="Inventory Product"
                                        options={productOptions}
                                        placeholder={!selectedPOId ? "Select PO first" : "Select Product"}
                                        disabled={isEditing || !selectedPOId}
                                    />
                                </div>

                                <div className="flex-1">
                                    <FormInput
                                        name={`items.${index}.supplierItemName`}
                                        label="Description / Defect Note"
                                        type="text"
                                        placeholder="e.g. Defective Shrink Seals (Melted)"
                                        disabled={isEditing}
                                    />
                                </div>

                                <div className="w-full md:w-32">
                                    <FormInput
                                        name={`items.${index}.unitCost`}
                                        label="Unit Cost (Rs)"
                                        type="number"
                                        placeholder="0.00"
                                        disabled={isEditing}
                                    />
                                </div>

                                <div className="w-full md:w-32">
                                    <FormInput
                                        name={`items.${index}.quantityReturned`}
                                        label="Return Qty"
                                        type="number"
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
                        ))}
                    </div>

                    <div className="pt-2">
                        <FormInput
                            name="notes"
                            label="Internal Notes"
                            type="text"
                            placeholder="Add any additional context regarding this return..."
                        />
                    </div>

                    <FormCTAFooter
                        isPending={isCreating}
                        isDirty={methods.formState.isDirty}
                        isValid={methods.formState.isValid}
                        isEditMode={isEditing}
                        href="/supply/returns"
                    />
                </form>
            </FormProvider>
        </div>
    );
}