import { Controller, UseFieldArrayReturn } from "react-hook-form";
import ReactSelect from "react-select";
import { Settings2, PlusCircle, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input"; // The new component above

// Note: You can move `reactSelectClassNames` into a shared utils file like `src/utils/react-select-styles.ts`
import { reactSelectClassNames } from "@/utils/react-select-styles";

interface RecipeSectionProps {
    hasRecipe: boolean;
    register: any;
    control: any;
    errors: any;
    fieldArray: UseFieldArrayReturn<any, "recipeItems">;
    dynamicRawMaterialOptions: { value: string; label: string }[];
    isProductsLoading: boolean;
}

export function ProductRecipeSection({
    hasRecipe,
    register,
    control,
    errors,
    fieldArray,
    dynamicRawMaterialOptions,
    isProductsLoading
}: RecipeSectionProps) {
    const { fields, append, remove } = fieldArray;

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
                                    <div className="flex-1 space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Raw Material</label>
                                        <Controller
                                            name={`recipeItems.${index}.rawMaterialId`}
                                            control={control}
                                            render={({ field: selectField }) => (
                                                <ReactSelect
                                                    options={dynamicRawMaterialOptions}
                                                    isLoading={isProductsLoading}
                                                    value={dynamicRawMaterialOptions.find(p => p.value === selectField.value) || null}
                                                    onChange={(opt) => selectField.onChange(opt?.value || "")}
                                                    placeholder="Search raw materials..."
                                                    isClearable
                                                    unstyled
                                                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                                    menuPosition="fixed"
                                                    classNames={reactSelectClassNames}
                                                />
                                            )}
                                        />
                                        {errors.recipeItems?.[index]?.rawMaterialId && (
                                            <p className="text-[10px] text-rose-500">{errors.recipeItems[index].rawMaterialId.message}</p>
                                        )}
                                    </div>

                                    <div className="w-32">
                                        <FormInput
                                            label="Qty Required"
                                            type="number"
                                            register={register(`recipeItems.${index}.quantityRequired`, { valueAsNumber: true })}
                                            error={errors.recipeItems?.[index]?.quantityRequired?.message as string}
                                            suffix="Qty"
                                        />
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
                            <p className="text-[10px] text-rose-500 mt-2">{errors.recipeItems.message as string}</p>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}