"use client";

import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { PackagePlus, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { useAppForm } from "@/lib/hooks/use-app-form";
import { finalizeBatchSchema, FinalizeBatchFormValues } from "../../schema/finalize-batch-schema";
import { ProductionBatch } from "../../types/production";
import { useFinalizeProduction } from "../../api/use-mutate-production";

interface FinalizeBatchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    batch: ProductionBatch | null;
    branchId: string;
}

export function FinalizeBatchDialog({ isOpen, onClose, batch, branchId }: FinalizeBatchDialogProps) {
    const { mutateAsync: finalizeBatch, isPending } = useFinalizeProduction(branchId);

    const methods = useAppForm(finalizeBatchSchema, {
        actualYield: batch?.expectedYield || 0,
        wastage: [],
    });

    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: "wastage",
    });

    // Reset form when a new batch is selected
    useEffect(() => {
        if (batch && isOpen) {
            methods.reset({
                actualYield: batch.expectedYield || 0,
                wastage: [],
            });
        }
    }, [batch, isOpen, methods]);

    if (!batch) return null;

    // Only allow wasting materials that were actually part of this batch
    const materialOptions = batch.consumedItems?.map(item => ({
        value: item.rawMaterialId,
        label: `${item.rawMaterial.name} (Used: ${item.quantityUsed})`,
    })) || [];

    const onSubmit = async (data: FinalizeBatchFormValues) => {
        finalizeBatch({
            id: batch.id,
            actualYield: data.actualYield,
            wastage: data.wastage,
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PackagePlus className="w-5 h-5 text-emerald-600" />
                        Finalize Batch & Add to Stock
                    </DialogTitle>
                    <DialogDescription>
                        Record the actual finished goods yield for <strong>{batch.batchCode}</strong>. You can also log any raw materials that were damaged during this specific production run.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        {/* Yield Section */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Expected Yield</label>
                                    <p className="text-xl font-bold text-slate-900">{batch.expectedYield?.toLocaleString()}</p>
                                </div>
                                <FormInput
                                    name="actualYield"
                                    label="Actual Yield (Good Units)"
                                    type="number"
                                    min={0}
                                />
                            </div>
                        </div>

                        {/* Wastage Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-slate-900">Production Wastage (Optional)</h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ rawMaterialId: "", quantity: 1, reason: "" })}
                                    className="h-7 text-xs border-dashed"
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Log Wastage
                                </Button>
                            </div>

                            {fields.length === 0 ? (
                                <p className="text-xs text-slate-500 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                    No wastage logged for this batch.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-start gap-3 p-3 bg-rose-50/50 border border-rose-100 rounded-lg">
                                            <div className="grid grid-cols-12 gap-3 flex-1">
                                                <div className="col-span-12 md:col-span-5">
                                                    <FormSelect
                                                        label="Wastage Product"
                                                        name={`wastage.${index}.rawMaterialId`}
                                                        options={materialOptions}
                                                        placeholder="Select material..."
                                                    />
                                                </div>
                                                <div className="col-span-6 md:col-span-3">
                                                    <FormInput
                                                        name={`wastage.${index}.quantity`}
                                                        type="number"
                                                        placeholder="Qty"
                                                    />
                                                </div>
                                                <div className="col-span-6 md:col-span-4">
                                                    <FormInput
                                                        name={`wastage.${index}.reason`}
                                                        placeholder="Reason (e.g., Leaked)"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="h-10 w-10 text-rose-500 hover:text-rose-700 hover:bg-rose-100 shrink-0 mt-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending || methods.formState.isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                {isPending || methods.formState.isSubmitting ? "Finalizing..." : "Add to Stock"}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}