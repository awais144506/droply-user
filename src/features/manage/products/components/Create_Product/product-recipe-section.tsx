/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext, useFieldArray } from "react-hook-form";
import { Settings2, PlusCircle, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";

// 🔥 1. Updated interface to include currentStock from your custom hook
interface RecipeSectionProps {
    hasRecipe: boolean;
    dynamicRawMaterialOptions: {
        value: string;
        label: string;
        currentStock: number;
        salePrice: number;
        unitCost: number;
    }[];
    isProductsLoading: boolean;
}

export function ProductRecipeSection({
    hasRecipe,
    dynamicRawMaterialOptions,
    isProductsLoading
}: RecipeSectionProps) {
    const { register, control, watch, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: "recipeItems" });
    const recipeErrors = errors.recipeItems as any;
    const currentRecipeItems = watch("recipeItems") || [];
    const selectedMaterialIds = currentRecipeItems
        .map((item: any) => item?.rawMaterialId)
        .filter(Boolean);

    return (
        <Card className="overflow-hidden border-slate-200">
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Settings2 className="h-4 w-4 text-sky-600" /> Recipe / Bill of Materials (BoM)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Enable this if this item is produced/assembled from other raw materials.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" {...register("hasRecipe")} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
            </div>

            {hasRecipe && (
                <CardContent className="pt-4 pb-6">
                    <div className="space-y-4">
                        {fields.length > 0 && (
                            <div className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wide px-1 mb-2">
                                <span className="flex-1">Raw Material</span>
                                <span className="w-32">Qty</span>
                                <span className="w-10"></span>
                            </div>
                        )}

                        {fields.length === 0 ? (
                            <div className="text-xs text-slate-400 p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
                                No components added yet.
                            </div>
                        ) : (
                            fields.map((field, index) => {
                                // 🔥 3. Get current row's data
                                const currentRowData = currentRecipeItems[index];
                                const currentMaterialId = currentRowData?.rawMaterialId;
                                const currentQty = Number(currentRowData?.quantityRequired) || 0;

                                // Find the raw material in our options to check its stock
                                const materialInfo = dynamicRawMaterialOptions.find(
                                    (opt) => opt.value === currentMaterialId
                                );

                                // Calculate how many recipes can be made
                                let possibleYield = null;
                                if (materialInfo && currentQty > 0) {
                                    possibleYield = Math.floor(materialInfo.currentStock / currentQty);
                                }


                                const availableOptions = dynamicRawMaterialOptions.filter(
                                    (opt) => !selectedMaterialIds.includes(opt.value) || opt.value === currentMaterialId
                                );

                                return (
                                    <div key={field.id} className="flex items-start gap-2">
                                        <div className="flex-1">
                                            <FormSelect
                                                name={`recipeItems.${index}.rawMaterialId`}
                                                label=""
                                                options={availableOptions}
                                                placeholder="Search material..."
                                                isSearchable={true}
                                                isLoading={isProductsLoading}
                                            />
                                            {/* Show current stock helper text */}
                                            {materialInfo && (
                                                <div className="flex items-center gap-4 mt-1.5 ml-1">
                                                    <p className="text-[10px] text-slate-500">
                                                        In Stock: <span className="font-semibold text-slate-700">{materialInfo.currentStock}</span>
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">
                                                        Unit Cost: <span className="font-semibold text-slate-700">Rs. {materialInfo.unitCost || 0}</span>
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">
                                                        Sale Price: <span className="font-semibold text-slate-700">Rs. {materialInfo.salePrice || 0}</span>
                                                    </p>
                                                    {currentQty > 1 && (
                                                        <p className="text-[10px] text-amber-600 font-medium">
                                                            (Unit * Quantity) Total: Rs. {(materialInfo.unitCost * currentQty).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="w-32">
                                            <FormInput
                                                name={`recipeItems.${index}.quantityRequired`}
                                                type="number"
                                                label=""
                                                placeholder="Qty"
                                                min={0}
                                            />
                                            {/* 🔥 5. Display the calculation */}
                                            {possibleYield !== null && (
                                                <p className={`text-[10px] mt-1.5 ml-1 flex items-center gap-1 ${possibleYield === 0 ? "text-rose-500 font-bold" : "text-sky-600 font-medium"}`}>
                                                    {possibleYield === 0 && <AlertCircle className="h-3 w-3" />}
                                                    Yields Recipe: {possibleYield} max
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => remove(index)}
                                            className="h-10 w-10 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl shrink-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            })
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
                        {recipeErrors && !Array.isArray(recipeErrors) && (
                            <p className="text-[10px] text-rose-500 mt-2">{recipeErrors.message as string}</p>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}