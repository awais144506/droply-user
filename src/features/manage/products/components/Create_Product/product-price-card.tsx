/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { Calculator, Settings2, AlertCircle, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { CreateItemFormData } from "../../schema/create-item.schema";

interface ProductPriceCardProps {
    isEditMode: boolean;
    itemType: "RETURNABLE" | "OUTRIGHT";
}

const ProductPriceCard = ({ isEditMode, itemType }: ProductPriceCardProps) => {
    const { control, watch, setValue } = useFormContext<CreateItemFormData>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "priceTiers",
    });

    const watchedTiers = watch("priceTiers") || [];

    // Set a specific tier as Default (and unset others)
    const handleSetDefault = (selectedIndex: number) => {
        watchedTiers.forEach((_: any, idx: number) => {
            setValue(`priceTiers.${idx}.isDefault`, idx === selectedIndex, {
                shouldDirty: true,
                shouldValidate: true,
            });
        });
    };

    // Safely remove a tier and ensure a default tier still exists
    const handleRemoveTier = (indexToRemove: number) => {
        const wasDefault = watchedTiers[indexToRemove]?.isDefault;
        remove(indexToRemove);

        if (wasDefault && fields.length > 1) {
            const nextDefaultIndex = indexToRemove === 0 ? 0 : indexToRemove - 1;
            setTimeout(() => {
                setValue(`priceTiers.${nextDefaultIndex}.isDefault`, true, {
                    shouldDirty: true,
                });
            }, 0);
        }
    };

    const handleAddTier = () => {
        append({
            title: `Tier ${fields.length + 1}`,
            unitCost: watchedTiers[0]?.unitCost ?? 0,
            salePrice: watchedTiers[0]?.salePrice ?? 0,
            isDefault: fields.length === 0,
            isActive: true,
        });
    };

    return (
        <div className="space-y-6">
            {/* PRICING TIERS CARD */}
            <Card>
                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-emerald-600" /> Pricing & Tiers
                    </CardTitle>
                    <button
                        type="button"
                        onClick={handleAddTier}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Price Tier
                    </button>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                    {fields.map((field, index) => {
                        const tierValues = watchedTiers[index] || {};
                        const cost = Number(tierValues.unitCost || 0);
                        const sale = Number(tierValues.salePrice || 0);
                        const profit = sale - cost;
                        const marginPct = sale > 0 ? (((sale - cost) / sale) * 100).toFixed(1) : "0.0";
                        const isDefault = Boolean(tierValues.isDefault);

                        return (
                            <div
                                key={field.id}
                                className={`p-3.5 rounded-xl border transition-all space-y-3 ${
                                    isDefault
                                        ? "bg-emerald-50/30 border-emerald-200"
                                        : "bg-slate-50/60 border-slate-200"
                                }`}
                            >
                                {/* Tier Header Bar */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleSetDefault(index)}
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                                                isDefault
                                                    ? "bg-emerald-600 text-white border-emerald-600"
                                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                            }`}
                                        >
                                            <CheckCircle2 className="h-3 w-3" />
                                            {isDefault ? "Default Price" : "Set Default"}
                                        </button>

                                        <span
                                            className={`px-2 py-0.5 font-bold text-[10px] rounded-md border ${
                                                profit > 0
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : profit < 0
                                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                            }`}
                                        >
                                            Rs. {profit} ({marginPct}% Margin)
                                        </span>
                                    </div>

                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTier(index)}
                                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                            title="Remove price tier"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Tier Inputs */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <FormInput
                                        label="Tier Title"
                                        placeholder="e.g. Standard, Wholesale"
                                        name={`priceTiers.${index}.title`}
                                    />
                                    <FormInput
                                        label="Unit Cost"
                                        type="number"
                                        required
                                        prefix="Rs"
                                        name={`priceTiers.${index}.unitCost`}
                                    />
                                    <FormInput
                                        label="Sale Price"
                                        type="number"
                                        required
                                        prefix="Rs"
                                        name={`priceTiers.${index}.salePrice`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* INVENTORY SETTINGS CARD */}
            <Card>
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Settings2 className="h-4 w-4 text-amber-600" /> Inventory Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-2 gap-4">
                    <FormInput
                        label={isEditMode ? "Adjust Current Stock" : "Opening Stock"}
                        type="number"
                        required
                        name="openingStock"
                        helperText={
                            isEditMode ? (
                                <p className="text-[10px] text-amber-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> Adjusts live inventory.
                                </p>
                            ) : undefined
                        }
                    />
                    <FormInput
                        label="Low Stock Alert At"
                        type="number"
                        required
                        name="lowStockThreshold"
                    />
                    {itemType === "RETURNABLE" && (
                        <div className="col-span-2 sm:col-span-1">
                            <FormInput
                                label="Security Deposit"
                                type="number"
                                name="securityDeposit"
                                prefix="Rs"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductPriceCard;