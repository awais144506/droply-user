"use client";

import { useEffect } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import {
    PackagePlus,
    Plus,
    Trash2,
    AlertTriangle,
    Layers,
    Sparkles,
    RotateCcw,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { useAppForm } from "@/lib/hooks/use-app-form";
import {
    finalizeBatchSchema,
    FinalizeBatchFormValues,
} from "../../schema/finalize-batch-schema";
import { ProductionBatch } from "../../types/production";
import { useFinalizeProduction } from "../../api/use-mutate-production";

interface FinalizeBatchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    batch: ProductionBatch | null;
    branchId: string;
}

export function FinalizeBatchDialog({
    isOpen,
    onClose,
    batch,
    branchId,
}: FinalizeBatchDialogProps) {
    const { mutateAsync: finalizeBatch, isPending } =
        useFinalizeProduction(branchId);

    const methods = useAppForm(finalizeBatchSchema, {
        actualYield: batch?.expectedYield || 0,
        wastage: [],
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: methods.control,
        name: "wastage",
    });

    const watchedActualYield = Number(
        useWatch({ control: methods.control, name: "actualYield" }) || 0
    );
    const watchedWastage =
        useWatch({ control: methods.control, name: "wastage" }) || [];

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

    const hasRecipe =
        batch.consumedItems && batch.consumedItems.length > 0;
    const expectedYield = batch.expectedYield || 0;
    const yieldShortfall = Math.max(0, expectedYield - watchedActualYield);

    // Only allow wasting materials that were actually part of this batch
    const materialOptions =
        batch.consumedItems?.map((item) => ({
            value: item.rawMaterialId,
            label: `${item.rawMaterial.name} (Reserved: ${item.quantityUsed})`,
        })) || [];

    // 🔥 Helper: 1-Click Auto-Fill Wastage for the missing yield
    const handleAutoFillShortfallAsWastage = () => {
        if (!hasRecipe || yieldShortfall <= 0) return;

        const autoWastage = batch.consumedItems.map((item) => {
            const perUnitQty = item.quantityUsed / expectedYield;
            const wastedQty = Number((perUnitQty * yieldShortfall).toFixed(2));
            return {
                rawMaterialId: item.rawMaterialId,
                quantity: wastedQty > 0 ? wastedQty : 1,
                reason: `Damaged during production (${yieldShortfall} shortfall)`,
            };
        });

        replace(autoWastage);
    };

    const onSubmit = async (data: FinalizeBatchFormValues) => {
        await finalizeBatch({
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
                        Record the actual finished goods yield for{" "}
                        <strong>{batch.batchCode}</strong> ({batch.product?.name}).
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(onSubmit)}
                        className="space-y-6 mt-4"
                    >
                        {/* Yield Section */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="grid grid-cols-2 gap-4 items-center">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">
                                        Expected Yield
                                    </label>
                                    <p className="text-2xl font-black text-slate-900 mt-1">
                                        {expectedYield.toLocaleString()}{" "}
                                        <span className="text-xs font-medium text-slate-400">
                                            units
                                        </span>
                                    </p>
                                </div>
                                <FormInput
                                    name="actualYield"
                                    label="Actual Yield (Good Units)"
                                    type="number"
                                    min={0}
                                />
                            </div>
                        </div>

                        {/* 🔥 SMART SHORTFALL PROMPT: Ask what happened to the missing 20 units */}
                        {hasRecipe && yieldShortfall > 0 && fields.length === 0 && (
                            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-2.5 text-amber-900 text-xs">
                                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                                    <div>
                                        <p className="font-bold">
                                            Shortfall of {yieldShortfall} units detected!
                                        </p>
                                        <p className="text-amber-700 mt-0.5">
                                            If you don&apos;t log wastage, the raw materials for these{" "}
                                            <strong>{yieldShortfall} units</strong> will be assumed{" "}
                                            <strong>unused</strong> and refunded back to your warehouse stock.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={handleAutoFillShortfallAsWastage}
                                    className="shrink-0 bg-white border-amber-300 text-amber-800 hover:bg-amber-100 text-xs h-8"
                                >
                                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                                    Log {yieldShortfall} as Damaged
                                </Button>
                            </div>
                        )}

                        {/* 🔥 RECIPE & MATERIAL RECONCILIATION PREVIEW */}
                        {hasRecipe ? (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                                    Recipe Material Reconciliation (Live Preview)
                                </h4>
                                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                                    <div className="grid grid-cols-12 bg-slate-100 px-3 py-2 font-bold text-slate-600 border-b border-slate-200">
                                        <div className="col-span-4">Raw Material</div>
                                        <div className="col-span-2 text-right">Deducted</div>
                                        <div className="col-span-2 text-right">Used</div>
                                        <div className="col-span-2 text-right text-rose-600">Wasted</div>
                                        <div className="col-span-2 text-right">Stock Adj.</div>
                                    </div>
                                    {batch.consumedItems.map((item) => {
                                        const baseRequired = Number(
                                            (
                                                (watchedActualYield / expectedYield) *
                                                item.quantityUsed
                                            ).toFixed(2)
                                        );
                                        const wastedQty = watchedWastage
                                            .filter((w) => w?.rawMaterialId === item.rawMaterialId)
                                            .reduce((sum, w) => sum + (Number(w?.quantity) || 0), 0);
                                        const trueConsumption = baseRequired + wastedQty;
                                        // Positive refund = returned to warehouse; Negative = extra deducted from warehouse
                                        const stockRefund = Number(
                                            (item.quantityUsed - trueConsumption).toFixed(2)
                                        );

                                        return (
                                            <div
                                                key={item.id}
                                                className="grid grid-cols-12 px-3 py-2.5 items-center border-b last:border-b-0 border-slate-100 bg-white"
                                            >
                                                <div className="col-span-4 font-semibold text-slate-800 truncate pr-2">
                                                    {item.rawMaterial.name}
                                                </div>
                                                <div className="col-span-2 text-right text-slate-500">
                                                    {item.quantityUsed}
                                                </div>
                                                <div className="col-span-2 text-right font-medium text-slate-800">
                                                    {baseRequired}
                                                </div>
                                                <div className="col-span-2 text-right font-bold text-rose-600">
                                                    {wastedQty > 0 ? wastedQty : "-"}
                                                </div>
                                                <div className="col-span-2 text-right font-bold">
                                                    {stockRefund > 0 ? (
                                                        <span className="text-emerald-600 flex items-center justify-end gap-0.5">
                                                            +{stockRefund}
                                                        </span>
                                                    ) : stockRefund < 0 ? (
                                                        <span className="text-rose-600">
                                                            {stockRefund}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">0</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <RotateCcw className="w-3 h-3" />
                                    <strong>Stock Adj.:</strong> Green (+ve) means unused material refunded to stock. Red (-ve) means extra material deducted due to wastage.
                                </p>
                            </div>
                        ) : (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 text-center">
                                This product has no raw material recipe attached. Finalizing will directly add{" "}
                                <strong>{watchedActualYield} units</strong> to finished goods stock.
                            </div>
                        )}

                        {/* Wastage Section (Only show if the batch has recipe materials) */}
                        {hasRecipe && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-slate-900">
                                        Damaged Raw Materials / Wastage
                                    </h4>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            append({
                                                rawMaterialId: materialOptions[0]?.value || "",
                                                quantity: 1,
                                                reason: "",
                                            })
                                        }
                                        className="h-7 text-xs border-dashed"
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Log Wastage
                                    </Button>
                                </div>

                                {fields.length === 0 ? (
                                    <p className="text-xs text-slate-500 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                        No damaged materials logged.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {fields.map((field, index) => (
                                            <div
                                                key={field.id}
                                                className="flex items-center gap-3 p-3 bg-rose-50/50 border border-rose-100 rounded-lg"
                                            >
                                                <div className="grid grid-cols-12 gap-3 flex-1">
                                                    <div className="col-span-12 md:col-span-5">
                                                        <FormSelect
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
                                                            placeholder="Reason (e.g., Burst)"
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    className="h-10 w-10 text-rose-500 hover:text-rose-700 hover:bg-rose-100 shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    isPending ||
                                    methods.formState.isSubmitting ||
                                    !methods.formState.isValid
                                }
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {isPending || methods.formState.isSubmitting
                                    ? "Finalizing..."
                                    : "Finalize & Update Stock"}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}