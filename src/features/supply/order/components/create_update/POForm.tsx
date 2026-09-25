"use client";
import { useForm, useFieldArray, useWatch, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2, Info } from "lucide-react";

import { createPOSchema, CreatePOFormData } from "../../schema/create-po-schema";
import { Button } from "@/components/ui/button";
import { FormSelect, SelectOption } from "@/components/ui/form-select";
import { FormInput } from "@/components/ui/form-input";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";

type POFormProps = {
    supplierOptions: SelectOption[];
    productOptions: SelectOption[];
    onSubmit: (data: CreatePOFormData) => void;
    isPending: boolean;
    isLoadingProducts: boolean;
    isLoadingSuppliers: boolean;
    initalValues?: CreatePOFormData;
    isEditing?: boolean;
    isLocked?: boolean;
};

export default function POForm({ supplierOptions, productOptions, onSubmit, isPending, isLoadingProducts, isLoadingSuppliers, initalValues, isEditing, isLocked = false }: POFormProps) {
    const form = useForm<CreatePOFormData>({
        resolver: yupResolver(createPOSchema),
        mode: "onChange",
        defaultValues: {
            supplierId: "",
            notes: "",
            advancePaid: 0,
            items: [{ productId: "", supplierItemName: "", quantity: 1, unitCost: 0 }],
        },
        values: initalValues,
    });

    const { control, handleSubmit } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchedItems = useWatch({ control, name: "items" }) || [];
    const watchedAdvance = useWatch({ control, name: "advancePaid" }) || 0;
    const liveTotal = watchedItems.reduce((sum, item) => sum + ((item?.quantity || 0) * (item?.unitCost || 0)), 0);
    const balanceDue = Math.max(0, liveTotal - watchedAdvance);
    const isAdvanceError = watchedAdvance > liveTotal;

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                {/* 1. Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormSelect
                        name="supplierId"
                        label="Select Supplier"
                        options={supplierOptions}
                        isLoading={isLoadingSuppliers}
                        placeholder="-- Choose Supplier --"
                        isSearchable
                        required
                        disabled={isLocked}
                        formatOptionLabel={(opt) => (
                            <div className="flex items-center justify-between w-full pr-1">
                                <span className="font-medium mr-2">{opt.label}</span>
                                <span className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-slate-800 shadow-sm bg-gray-100">
                                    {opt.name}
                                </span>

                            </div>
                        )}
                    />
                    <div className="space-y-1">
                        <FormInput
                            name="advancePaid"
                            label="Advance Paid (Rs)"
                            type="number"
                            min={0}
                            disabled={isLocked}
                        />
                        {isAdvanceError && (
                            <p className="text-xs text-rose-600 font-medium">Advance cannot exceed the total order amount.</p>
                        )}
                    </div>
                    <FormInput
                        name="notes"
                        label="Order Notes"
                        placeholder="e.g. Please deliver to back gate"
                        disabled={isLocked}
                    />
                </div>

                {/* 2. Items Table Section */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-start justify-between pb-2">
                        <h3 className="font-bold text-slate-900 mt-1">Order Items</h3>
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-500">Subtotal: Rs {liveTotal.toLocaleString()}</p>
                            <p className={`text-lg font-bold ${isAdvanceError ? "text-rose-600" : "text-sky-600"}`}>
                                (PO Time) Balance: Rs {balanceDue.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {!isLocked && (
                        <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 px-4 py-3 rounded-xl text-xs font-medium">
                            <Info className="h-4 w-4 shrink-0" />
                            <p>When this order is marked as received, the specified quantities will automatically increment the live stock of the linked products.</p>
                        </div>
                    )}

                    {fields.map((field, index) => (
                        <div key={field.id} className="flex flex-col md:flex-row gap-6 items-start bg-slate-50 p-4 rounded-xl border border-slate-100 relative group">
                            <div className="flex-2 w-full">
                                <FormSelect
                                    name={`items.${index}.productId`}
                                    label="Product Link"
                                    options={productOptions}
                                    isLoading={isLoadingProducts}
                                    placeholder="Select Product..."
                                    isSearchable
                                    required
                                    disabled={isLocked}
                                    formatOptionLabel={(opt) => (
                                        <div className="flex items-center justify-between w-full pr-1">
                                            <span className="font-medium mr-2">{opt.name} <span className="text-[10px] bg-amber-600 text-white p-1 rounded">({opt.unit.toLowerCase()})</span></span>
                                            <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white shadow-sm bg-sky-700">
                                                {opt.category}
                                            </span>

                                        </div>
                                    )}
                                />
                            </div>

                            <div className="flex-2 w-full">
                                <FormInput
                                    name={`items.${index}.supplierItemName`}
                                    label="Item Name (For Invoice)"
                                    placeholder="e.g. 55mm Caps"
                                    required
                                    disabled={isLocked}
                                />
                            </div>

                            <div className="w-full md:w-24">
                                <FormInput
                                    name={`items.${index}.quantity`}
                                    label="Qty"
                                    type="number"
                                    min={1}
                                    required
                                    disabled={isLocked}
                                />
                            </div>

                            <div className="w-full md:w-32">
                                <FormInput
                                    name={`items.${index}.unitCost`}
                                    label="Unit Cost (Rs)"
                                    type="number"
                                    min={0}
                                    required
                                    disabled={isLocked}
                                />
                            </div>

                            {!isLocked && fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="md:mt-6 text-slate-400 hover:text-rose-600 hover:bg-rose-50 w-full md:w-auto"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}

                    {!isLocked && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ productId: "", supplierItemName: "", quantity: 1, unitCost: 0 })}
                            className="w-full border-dashed border-2 border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Another Item
                        </Button>
                    )}
                </div>

                {!isLocked && (
                    <FormCTAFooter
                        ctaText="Create PO"
                        href="/supply/order"
                        isPending={isPending}
                        isDirty={form.formState.isDirty}
                        isValid={form.formState.isValid && !isAdvanceError}
                        isEditMode={isEditing}
                    />
                )}
            </form>
        </FormProvider>
    );
}