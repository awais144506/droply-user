/* eslint-disable react-hooks/incompatible-library */
"use client";

import Link from "next/link";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactSelect from "react-select";
import { Package, Calculator, Settings2, Plus, AlertCircle, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { createItemSchema, CreateItemFormData } from "@/features/products/schema/create-item.schema";
import { categoryOptions, trackingOptions } from "../data/create-product-dropdown";
import { useRole } from "@/hooks/use-role";
import { useProducts } from "@/features/products/api/use-products";
import { reactSelectClassNames } from "@/utils/react-select-styles";
import { ProductRecipeSection } from "./Create_Product/product-recipe-section";

interface ProductFormProps {
    initialValues?: CreateItemFormData;
    onSubmit: (data: CreateItemFormData) => void;
    isPending?: boolean;
    submitText?: string;
}

export function ProductForm({ initialValues, onSubmit, isPending = false, submitText = "Save Item" }: ProductFormProps) {
    const { branchId } = useRole();
    const { data: products = [], isLoading: isProductsLoading } = useProducts(branchId);
    const isEditMode = !!initialValues;

    const dynamicRawMaterialOptions = products.map((product) => ({
        value: product.id,
        label: `${product.name} (${product.sku})`
    }));

    const { register, handleSubmit, control, watch, formState: { errors, isValid } } = useForm<CreateItemFormData>({
        resolver: yupResolver(createItemSchema),
        mode: "onChange",
        defaultValues: initialValues || {
            category: "FINISHED_GOOD",
            trackingType: "OUTRIGHT",
            name: "",
            sku: "",
            unitCost: 0,
            salePrice: 0,
            openingStock: 0,
            lowStockThreshold: 3,
            hasRecipe: false,
            recipeItems: [],
        },
    });

    const fieldArray = useFieldArray({ control, name: "recipeItems" });

    const hasRecipe = watch("hasRecipe");
    const unitCost = watch("unitCost") || 0;
    const salePrice = watch("salePrice") || 0;
    const profitMargin = salePrice > 0 ? (((salePrice - unitCost) / salePrice) * 100).toFixed(1) : "0.0";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* --- ITEM DETAILS CARD --- */}
                <Card>
                    <CardHeader className="pb-3 border-b border-slate-100">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Package className="h-4 w-4 text-sky-600" /> Item Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormInput
                                label="Item Name *"
                                placeholder="e.g. 19-Liter Water"
                                register={register("name")}
                                error={errors.name?.message}
                            />
                            <FormInput
                                label="SKU / Code *"
                                placeholder="e.g. BOT-19L"
                                register={register("sku")}
                                error={errors.sku?.message}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category</label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <ReactSelect
                                            options={categoryOptions}
                                            value={categoryOptions.find(c => c.value === field.value) || null}
                                            onChange={(opt) => field.onChange(opt?.value || "")}
                                            isSearchable={false}
                                            unstyled
                                            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                            menuPosition="fixed"
                                            classNames={reactSelectClassNames}
                                        />
                                    )}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Tracking Type</label>
                                <Controller
                                    name="trackingType"
                                    control={control}
                                    render={({ field }) => (
                                        <ReactSelect
                                            options={trackingOptions}
                                            value={trackingOptions.find(t => t.value === field.value) || null}
                                            onChange={(opt) => field.onChange(opt?.value || "")}
                                            isSearchable={false}
                                            unstyled
                                            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                            menuPosition="fixed"
                                            classNames={reactSelectClassNames}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* --- PRICING & INVENTORY CARDS --- */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Calculator className="h-4 w-4 text-emerald-600" /> Pricing & Margins
                            </CardTitle>
                            <div className={`px-2.5 py-1 font-bold text-[10px] rounded-md border ${parseFloat(profitMargin) > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                {profitMargin}% Margin
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 grid grid-cols-2 gap-4">
                            <FormInput
                                label="Unit Cost"
                                type="number"
                                prefix="Rs"
                                register={register("unitCost", { valueAsNumber: true })}
                                error={errors.unitCost?.message}
                            />
                            <FormInput
                                label="Sale Price"
                                type="number"
                                prefix="Rs"
                                register={register("salePrice", { valueAsNumber: true })}
                                error={errors.salePrice?.message}
                            />
                        </CardContent>
                    </Card>

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
                                register={register("openingStock", { valueAsNumber: true })}
                                error={errors.openingStock?.message}
                                helperText={isEditMode ? (
                                    <p className="text-[10px] text-amber-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> Adjusts live inventory.
                                    </p>
                                ) : undefined}
                            />
                            <FormInput
                                label={<span className="flex items-center gap-1">Low Alert At <AlertCircle className="h-3 w-3 text-slate-400" /></span>}
                                type="number"
                                register={register("lowStockThreshold", { valueAsNumber: true })}
                                error={errors.lowStockThreshold?.message}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* --- RECIPE SECTION --- */}
            <ProductRecipeSection
                hasRecipe={hasRecipe}
                register={register}
                control={control}
                errors={errors}
                fieldArray={fieldArray}
                dynamicRawMaterialOptions={dynamicRawMaterialOptions}
                isProductsLoading={isProductsLoading}
            />

            {/* --- FOOTER ACTIONS --- */}
            <div className="flex items-center justify-end gap-3 border-t pt-4">
                <Link
                    href="/manage/products"
                    className={`${buttonVariants({ variant: "outline", size: "sm" })} ${isPending ? "pointer-events-none opacity-50" : ""}`}
                    tabIndex={isPending ? -1 : undefined}
                >
                    Cancel
                </Link>
                <Button type="submit" disabled={!isValid || isPending} variant="create">
                    {isPending ? (
                        <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Saving...</>
                    ) : (
                        <><Plus className="h-4 w-4 mr-1.5" /> {submitText}</>
                    )}
                </Button>
            </div>
        </form>
    );
}