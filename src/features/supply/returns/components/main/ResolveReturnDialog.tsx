"use client";
import { useEffect } from "react";
import { useForm, FormProvider, useFieldArray, useWatch } from "react-hook-form";
import { AlertTriangle, PackageCheck, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { PurchaseReturn } from "../../types/returns";

interface ResolveReturnDialogProps {
    isOpen: boolean;
    onClose: () => void;
    returnRecord: PurchaseReturn | null;
    onConfirm: (id: string, data: ResolveFormValues) => void;
    isLoading: boolean;
}

export type ResolveFormValues = {
    items: {
        id: string;
        branchProductId: string;
        supplierItemName: string;
        unitCost: number;
        quantityReturned: number;
        quantityReplaced: number;
        quantityCredited: number;
        quantityRejected: number;
    }[];
};

export default function ResolveReturnDialog({ isOpen, onClose, returnRecord, onConfirm, isLoading }: ResolveReturnDialogProps) {
    const methods = useForm<ResolveFormValues>({
        mode: "onChange",
        defaultValues: { items: [] }
    });

    const { control, handleSubmit, reset } = methods;
    const { fields } = useFieldArray({ control, name: "items" });
    const watchedItems = useWatch({ control, name: "items" }) || [];

    // Pre-fill the form
    useEffect(() => {
        if (returnRecord && isOpen) {
            reset({
                items: returnRecord.items.map(item => ({
                    id: item.id,
                    branchProductId: item.branchProductId,
                    supplierItemName: item.supplierItemName,
                    unitCost: item.unitCost,
                    quantityReturned: item.quantityReturned,
                    quantityReplaced: 0,
                    quantityCredited: 0,
                    quantityRejected: 0,
                }))
            });
        }
    }, [returnRecord, isOpen, reset]);

    const onSubmit = (data: ResolveFormValues) => {
        if (returnRecord) {
            onConfirm(returnRecord.id, data);
        }
    };

    // 🔥 Strict Validation: Every item's resolved sum must EQUAL its original quantityReturned
    const hasItemError = watchedItems.some(item => {
        const replaced = Number(item.quantityReplaced) || 0;
        const credited = Number(item.quantityCredited) || 0;
        const rejected = Number(item.quantityRejected) || 0;
        const sum = replaced + credited + rejected;
        return sum !== item.quantityReturned; // Must be strictly equal, no missing or excess items!
    });

    const liveCreditRecovered = watchedItems.reduce((sum, item) => {
        return sum + ((Number(item.quantityCredited) || 0) * (item.unitCost || 0));
    }, 0);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
            <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-slate-800">
                        <PackageCheck className="h-5 w-5 text-sky-600" />
                        Resolve Case: {returnRecord?.debitNoteNumber}
                    </DialogTitle>
                    <DialogDescription>
                        Specify how the supplier resolved this return. The sum of Replaced, Credited, and Rejected must exactly equal the returned quantity.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form id="resolve-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">

                        {/* Items Loop */}
                        <div className="space-y-4">
                            {fields.map((field, index) => {
                                const originalQty = field.quantityReturned;
                                const replaced = Number(watchedItems[index]?.quantityReplaced) || 0;
                                const credited = Number(watchedItems[index]?.quantityCredited) || 0;
                                const rejected = Number(watchedItems[index]?.quantityRejected) || 0;
                                const currentSum = replaced + credited + rejected;
                                const isRowError = currentSum !== originalQty;

                                return (
                                    <div key={field.id} className={`p-4 rounded-xl border ${isRowError ? "border-rose-300 bg-rose-50/50" : "border-slate-200 bg-slate-50"} transition-colors`}>
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-slate-800">
                                                {field.supplierItemName} <span className="text-sm font-medium text-slate-400 ml-2">(@ Rs {field.unitCost})</span>
                                            </h4>
                                            <span className={`text-xs font-bold px-2 py-1 rounded border ${isRowError ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-slate-200 text-slate-600 border-slate-300"}`}>
                                                Total Returned: {originalQty} | Accounted For: {currentSum}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <FormInput
                                                name={`items.${index}.quantityReplaced`}
                                                label="Replaced (Restock)"
                                                type="number" min={0}
                                            />
                                            <FormInput
                                                name={`items.${index}.quantityCredited`}
                                                label="Refunded / Credited"
                                                type="number" min={0}
                                            />
                                            <FormInput
                                                name={`items.${index}.quantityRejected`}
                                                label="Loss / Rejected"
                                                type="number" min={0}
                                            />
                                        </div>

                                        {isRowError && (
                                            <p className="text-xs text-rose-600 font-bold mt-2">
                                                {currentSum > originalQty
                                                    ? `Resolution sum (${currentSum}) exceeds the returned quantity (${originalQty}).`
                                                    : `Unaccounted items! You have ${originalQty - currentSum} remaining units to assign (Replaced + Credited + Rejected must equal ${originalQty}).`
                                                }
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Read-Only Global Financial Recovery */}
                        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                                    <Receipt className="h-4 w-4" />
                                    Calculated Financial Credit
                                </h4>
                                <p className="text-xs text-emerald-700 mt-1">
                                    This value is automatically calculated based on items marked as Refunded / Credited.
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-emerald-700">
                                    Rs {liveCreditRecovered.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {hasItemError && (
                            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-2 rounded-lg text-sm font-medium border border-rose-100">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                <span>All returned quantities must be fully and accurately accounted for before confirming resolution.</span>
                            </div>
                        )}
                    </form>
                </FormProvider>

                <DialogFooter className="border-t border-slate-100 pt-4 mt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" form="resolve-form" disabled={isLoading || hasItemError} className="bg-sky-600 hover:bg-sky-700 text-white">
                        {isLoading ? "Processing..." : "Confirm Resolution"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}