/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, PackageSearch, Layers } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UNIT_OPTIONS = [
    { label: "Piece", value: "Piece" },
    { label: "Carton", value: "Carton" },
    { label: "Pack", value: "Pack" },
    { label: "KG", value: "KG" },
    { label: "Gram", value: "Gram" },
    { label: "Liter", value: "Liter" },
    { label: "mm", value: "mm" },
    { label: "cm", value: "cm" },
    { label: "ft", value: "ft" },
];

interface Props {
    productOptions: any[];
    isLoadingProducts: boolean;
}

export function QuotationItemsSection({
    productOptions = [],
    isLoadingProducts,
}: Props) {
    const { control, watch, setValue } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchedItems = watch("items") || [];

    // When a catalog product is selected for row `index`, auto-fill name, UOM, and price
    const handleProductSelect = (index: number, selectedOption: any) => {
        if (selectedOption) {
            const formattedUom = selectedOption.unitOfMeasure
                ? selectedOption.unitOfMeasure.charAt(0).toUpperCase() +
                  selectedOption.unitOfMeasure.slice(1).toLowerCase()
                : "Piece";

            setValue(`items.${index}.itemName`, selectedOption.label || "", {
                shouldValidate: true,
                shouldDirty: true,
            });
            setValue(`items.${index}.unitOfMeasure`, formattedUom, {
                shouldValidate: true,
                shouldDirty: true,
            });
            if (selectedOption.salePrice !== undefined) {
                setValue(`items.${index}.unitPrice`, Number(selectedOption.salePrice), {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            }
        }
    };

    return (
        <Card className="rounded-2xl border-slate-200/90 shadow-xs">
            <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-sky-600" />
                        Add Products/Items
                    </CardTitle>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Pick from inventory to auto-fill and check live stock, or type any custom item name directly. Zero stock will not block quotations.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() =>
                        append({
                            productId: null,
                            itemName: "",
                            quantity: 1,
                            unitPrice: 0,
                            unitOfMeasure: "Piece",
                            amount: 0,
                        })
                    }
                >
                    <Plus className="w-4 h-4" /> Add Line Item
                </Button>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
                {fields.map((field, index) => {
                    const row = watchedItems[index] || {};
                    const qty = Number(row.quantity) || 0;
                    const price = Number(row.unitPrice) || 0;
                    const rowAmount = Math.round(qty * price * 100) / 100;
                    const selectedProductIds = watchedItems
                        .map((item: any, idx: number) => (idx !== index ? item?.productId : null))
                        .filter(Boolean);
                    const availableProductOptions = productOptions.filter(
                        (opt) => !selectedProductIds.includes(opt.value)
                    );
                    const linkedProduct = productOptions.find(
                        (p) => p.value === row.productId
                    );

                    return (
                        <div
                            key={field.id}
                            className="relative rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-3 transition-all hover:border-slate-300"
                        >
                            {/* Top Row Header: Item # + Stock Status Pill + Remove Button */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-white text-[11px] font-black">
                                        #{index + 1}
                                    </span>
                                    <span className="text-xs font-bold text-slate-700">
                                        {row.itemName || "New Line Item"}
                                    </span>

                                    {linkedProduct && (
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] font-bold ${
                                                linkedProduct.currentStock > 0
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                            }`}
                                        >
                                            {linkedProduct.currentStock > 0
                                                ? `In Stock: ${linkedProduct.currentStock} ${linkedProduct.unitOfMeasure}`
                                                : "Stock: 0 (Quotation Allowed)"}
                                        </Badge>
                                    )}
                                </div>

                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon-sm"
                                        onClick={() => remove(index)}
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                )}
                            </div>

                            {/* Item Inputs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                {/* 1. Optional Catalog Product Lookup (3 cols) */}
                                <div className="md:col-span-3">
                                    <FormSelect
                                        name={`items.${index}.productId`}
                                        label="Select Product (Optional)"
                                        placeholder="Pick from DB..."
                                        options={availableProductOptions}
                                        isLoading={isLoadingProducts}
                                        isSearchable
                                        isClearable
                                        labelIcon={PackageSearch}
                                        onValueChange={(opt) => handleProductSelect(index, opt)}
                                        formatOptionLabel={(opt: any) => (
                                            <div className="flex items-center justify-between text-xs py-0.5">
                                                <span className="font-semibold truncate pr-2">{opt.label}</span>
                                                <span
                                                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                                                        opt.currentStock > 0
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : "bg-rose-100 text-rose-700"
                                                    }`}
                                                >
                                                    Qty: {opt.currentStock}
                                                </span>
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* 2. Custom / Editable Item Name (3 cols) */}
                                <div className="md:col-span-3">
                                    <FormInput
                                        name={`items.${index}.itemName`}
                                        label="Item Name"
                                        placeholder="e.g. Aluminum L3 Structure 2.6mm"
                                        required
                                    />
                                </div>

                                {/* 3. Unit of Measure (2 cols) */}
                                <div className="md:col-span-2">
                                    <FormSelect
                                        name={`items.${index}.unitOfMeasure`}
                                        label="Unit"
                                        options={UNIT_OPTIONS}
                                        required
                                    />
                                </div>

                                {/* 4. Quantity (1.5 -> 1 col) */}
                                <div className="md:col-span-1">
                                    <FormInput
                                        name={`items.${index}.quantity`}
                                        label="Qty"
                                        type="number"
                                        min={0.01}
                                        required
                                    />
                                </div>

                                {/* 5. Unit Price (2 cols) */}
                                <div className="md:col-span-2">
                                    <FormInput
                                        name={`items.${index}.unitPrice`}
                                        label="Price / Unit"
                                        type="number"
                                        prefix="Rs"
                                        min={0}
                                        required
                                    />
                                </div>

                                {/* 6. Computed Row Amount (1 col) */}
                                <div className="md:col-span-1 space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                                        Amount
                                    </label>
                                    <div className="h-10 px-3 rounded-xl bg-white border border-slate-200 flex items-center justify-end font-black text-xs text-slate-900 tabular-nums shadow-2xs">
                                        {rowAmount.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}