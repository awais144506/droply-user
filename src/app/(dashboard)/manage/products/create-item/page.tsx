"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactSelect from "react-select";
import { toast } from "sonner";
import {
    ArrowLeft, Package, Calculator,
    Settings2, Plus, Trash2, PlusCircle, AlertCircle
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createItemSchema, CreateItemFormData } from "@/features/products/schema/create-item.schema";

// --- Tailwind styled React-Select styling configuration ---
const reactSelectClassNames = {
    control: (state: any) =>
        `flex min-h-10 w-full items-center justify-between rounded-xl bg-slate-50 border px-3 ${state.isFocused ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200'
        } shadow-none hover:border-sky-500 hover:bg-white transition-colors text-sm cursor-pointer`,
    valueContainer: () => "flex items-center gap-1 w-full m-0 p-0",
    singleValue: () => "text-slate-900 font-medium overflow-hidden text-ellipsis whitespace-nowrap",
    input: () => "text-slate-900 m-0 p-0",
    placeholder: () => "text-slate-400 font-normal",
    indicatorsContainer: () => "flex items-center gap-1",
    clearIndicator: () => "text-slate-400 hover:text-rose-500 cursor-pointer",
    dropdownIndicator: () => "text-slate-400 hover:text-slate-600 cursor-pointer",
    indicatorSeparator: () => "hidden",
    menu: () => "rounded-xl border border-slate-200 bg-white shadow-lg mt-1 text-sm overflow-hidden z-50",
    menuList: () => "max-h-48 custom-scrollbar p-1",
    option: (state: any) =>
        `cursor-pointer px-3 py-2 rounded-lg transition-colors ${state.isSelected ? 'bg-sky-50 text-sky-700 font-bold' : state.isFocused ? 'bg-slate-50 text-slate-900' : 'text-slate-700'
        }`,
};

export default function CreateItemPage() {
    const router = useRouter();

    // Dropdown Options
    const categoryOptions = [
        { value: "FINISHED_GOOD", label: "Finished Water / Good" },
        { value: "RAW_MATERIAL", label: "Raw Material (Caps, Seals)" },
        { value: "RETURNABLE_CONTAINER", label: "Returnable Container" },
        { value: "EQUIPMENT", label: "Equipment (Dispensers)" },
    ];

    const trackingOptions = [
        { value: "OUTRIGHT", label: "Outright (Consumed/Sold)" },
        { value: "RETURNABLE", label: "Returnable (Asset Tracked)" },
    ];

    const rawMaterialOptions = [
        { value: "rm-1", label: "19L Polycarbonate Empty Bottle" },
        { value: "rm-2", label: "12L & 19L Smart Bottle Cap" },
        { value: "rm-3", label: "Purified Water (Liters)" },
        { value: "rm-4", label: "Plastic Shrink Seal" },
    ];

    const { register, handleSubmit, control, watch, formState: { errors, isValid } } = useForm<CreateItemFormData>({
        resolver: yupResolver(createItemSchema),
        mode: "onChange",
        defaultValues: {
            category: "FINISHED_GOOD",
            trackingType: "OUTRIGHT",
            name: "",
            sku: "",
            unitCost: 0,
            salePrice: 0,
            openingStock: 0,
            lowStockThreshold: 10,
            hasRecipe: false,
            recipeItems: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "recipeItems",
    });

    const hasRecipe = watch("hasRecipe");
    const unitCost = watch("unitCost") || 0;
    const salePrice = watch("salePrice") || 0;

    // Calculate Profit Margin dynamically
    const profitMargin = salePrice > 0 ? (((salePrice - unitCost) / salePrice) * 100).toFixed(1) : "0.0";

    const onSubmit = (data: CreateItemFormData) => {
        console.log("Item Payload:", data);
        toast.success("Item created successfully!");
        router.push("/manage/products");
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">

            {/* Top Header */}
            <div className="flex items-center gap-3 border-b pb-4">
                <Link href="/manage/products" className={buttonVariants({ variant: "outline", size: "icon-sm" })}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Item</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* LEFT COLUMN: Basic Item Info */}
                    <Card>
                        <CardHeader className="pb-3 border-b border-slate-100">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Package className="h-4 w-4 text-sky-600" />
                                Item Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Item Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 19-Liter Water Refill (Sealed)"
                                    {...register("name")}
                                    className={`w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:bg-white ${errors.name ? "border-rose-300 focus:ring-rose-500" : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-500"}`}
                                />
                                {errors.name && <p className="text-[10px] text-rose-500">{errors.name.message}</p>}
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
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                classNames={{
                                                    ...reactSelectClassNames,
                                                    control: (state) =>
                                                        `flex min-h-10 w-full items-center justify-between rounded-xl bg-slate-50 border px-3 ${errors.category ? 'border-rose-300' : state.isFocused ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200'
                                                        } hover:bg-white transition-colors text-sm cursor-pointer`
                                                }}
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
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                classNames={{
                                                    ...reactSelectClassNames,
                                                    control: (state) =>
                                                        `flex min-h-10 w-full items-center justify-between rounded-xl bg-slate-50 border px-3 ${errors.trackingType ? 'border-rose-300' : state.isFocused ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200'
                                                        } hover:bg-white transition-colors text-sm cursor-pointer`
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* RIGHT COLUMN: Pricing & Inventory */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Calculator className="h-4 w-4 text-emerald-600" />
                                    Pricing & Margins
                                </CardTitle>
                                <div className={`px-2.5 py-1 font-bold text-[10px] rounded-md border ${parseFloat(profitMargin) > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                    {profitMargin}% Margin
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Unit Cost</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs</span>
                                        <input
                                            type="number"
                                            step="any"
                                            {...register("unitCost", { valueAsNumber: true })}
                                            className="w-full h-10 pl-8 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Sale Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs</span>
                                        <input
                                            type="number"
                                            step="any"
                                            {...register("salePrice", { valueAsNumber: true })}
                                            className="w-full h-10 pl-8 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3 border-b border-slate-100">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Settings2 className="h-4 w-4 text-amber-600" />
                                    Inventory Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Opening Stock</label>
                                    <input
                                        type="number"
                                        {...register("openingStock", { valueAsNumber: true })}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                                        Low Alert At <AlertCircle className="h-3 w-3 text-slate-400" />
                                    </label>
                                    <input
                                        type="number"
                                        {...register("lowStockThreshold", { valueAsNumber: true })}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* BOTTOM FULL WIDTH: Recipe / Bill of Materials Section */}
                <Card className="overflow-hidden border-slate-200">
                    <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Settings2 className="h-4 w-4 text-sky-600" />
                                Recipe / Bill of Materials (BoM)
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Enable this if this item is produced/assembled from other raw materials.</p>
                        </div>

                        {/* Custom Tailwind Toggle Switch */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" {...register("hasRecipe")} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                        </label>
                    </div>

                    {hasRecipe && (
                        <CardContent className="pt-4 pb-6">
                            <div className="space-y-3">
                                {fields.length === 0 ? (
                                    <div className="text-xs text-slate-400 p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
                                        No components added yet.
                                    </div>
                                ) : (
                                    fields.map((field, index) => (
                                        <div key={field.id} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Raw Material</label>
                                                <Controller
                                                    name={`recipeItems.${index}.rawMaterialId`}
                                                    control={control}
                                                    render={({ field: selectField }) => (
                                                        <ReactSelect
                                                            options={rawMaterialOptions}
                                                            value={rawMaterialOptions.find(p => p.value === selectField.value) || null}
                                                            onChange={(opt) => selectField.onChange(opt?.value || "")}
                                                            placeholder="Search raw materials..."
                                                            isClearable
                                                            unstyled
                                                            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                                            menuPosition="fixed"
                                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                            classNames={{
                                                                ...reactSelectClassNames,
                                                                control: (state) =>
                                                                    `flex min-h-10 w-full items-center justify-between rounded-xl bg-slate-50 border px-3 ${errors.recipeItems?.[index]?.rawMaterialId ? 'border-rose-300' : state.isFocused ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200'
                                                                    } hover:bg-white transition-colors text-sm cursor-text`
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors.recipeItems?.[index]?.rawMaterialId && (
                                                    <p className="text-[10px] text-rose-500 mt-1">{errors.recipeItems[index].rawMaterialId.message}</p>
                                                )}
                                            </div>

                                            <div className="w-32">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Qty Required</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        {...register(`recipeItems.${index}.quantityRequired`, { valueAsNumber: true })}
                                                        className={`w-full h-10 pr-8 pl-3 rounded-xl border bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:bg-white ${errors.recipeItems?.[index]?.quantityRequired ? 'border-rose-300' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'}`}
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Qty</span>
                                                </div>
                                                {errors.recipeItems?.[index]?.quantityRequired && (
                                                    <p className="text-[10px] text-rose-500 mt-1">{errors.recipeItems[index].quantityRequired.message}</p>
                                                )}
                                            </div>

                                            <div className="pt-[18px]">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => remove(index)}
                                                    className="h-10 w-10 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl shrink-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}

                                <div className="pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append({ rawMaterialId: "", quantityRequired: 1 })}
                                        className="h-9 text-xs rounded-xl px-3 text-sky-700 bg-sky-50 border-sky-200 hover:bg-sky-100 hover:border-sky-300"
                                    >
                                        <PlusCircle className="h-4 w-4 mr-1.5" /> Add Material to Recipe
                                    </Button>
                                </div>
                                {errors.recipeItems && !Array.isArray(errors.recipeItems) && (
                                    <p className="text-[10px] text-rose-500 mt-2">{errors.recipeItems.message}</p>
                                )}
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 border-t pt-4">
                    <Link href="/manage/products" className={buttonVariants({ variant: "outline", size: "sm" })}>
                        Cancel
                    </Link>
                    <Button type="submit" disabled={!isValid} className="min-w-36 bg-sky-600 hover:bg-sky-700 rounded-xl h-10 text-white shadow-sm">
                        <Plus className="h-4 w-4 mr-1.5" /> Save Item
                    </Button>
                </div>
            </form>
        </div>
    );
}