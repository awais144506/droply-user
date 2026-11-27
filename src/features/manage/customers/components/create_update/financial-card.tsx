/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray, useWatch } from "react-hook-form";
import { Wallet, Trash2, PlusCircle, Package } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSelect } from "@/components/ui/form-select";
import { FormNumberStepper } from "@/components/ui/form-number-stepper";

export default function FinancialsCard({ control, productOptions = [], isLoadingProducts }: any) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "returnables",
    });

    const currentReturnables = useWatch({
        control,
        name: "returnables",
        defaultValue: []
    }) || [];
    const canAddNew = productOptions.length > fields.length;

    return (
        <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-amber-600" />
                    Initial Balances & Assets
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <FormInput
                            label="Outstanding"
                            type="number"
                            prefix="Rs"
                            name="customerCredit"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Advance Paid"
                            type="number"
                            prefix="Rs"
                            name="customerAdvance"
                        />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                        <FormInput
                            label="Security Deposit"
                            type="number"
                            prefix="Rs"
                            name="securityDeposit"
                        />
                    </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center min-w-0">
                            <Package className="h-4 w-4 text-sky-600 mr-2 shrink-0" />
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                Opening Returnables (Only Returnables)
                            </label>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={!canAddNew}
                            onClick={() => append({ productId: "", quantity: 1 })}
                            className="h-8 sm:h-7 text-[11px] sm:text-[10px] rounded-lg px-2.5 sm:px-2 text-sky-600 border-sky-200 hover:bg-sky-50 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            <PlusCircle className="h-3.5 w-3.5 sm:h-3 sm:w-3 mr-1" /> Add Item
                        </Button>
                    </div>

                    {fields.length === 0 ? (
                        <div className="text-xs text-slate-400 bg-slate-50 rounded-xl p-4 text-center border border-dashed border-slate-200">
                            No assets assigned to this customer yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {fields.map((field, index) => {
                                const availableOptions = productOptions.filter((option: any) => {
                                    const isSelectedElsewhere = currentReturnables.some(
                                        (item: any, i: number) =>
                                            i !== index && item.productId === option.value
                                    );
                                    return !isSelectedElsewhere;
                                });

                                return (
                                    <div
                                        key={field.id}
                                        className="flex flex-col sm:flex-row sm:items-start gap-2 p-2.5 sm:p-0 rounded-xl sm:rounded-none bg-slate-50/80 sm:bg-transparent border border-slate-200/80 sm:border-0"
                                    >
                                        <div className="w-full sm:flex-1 min-w-0">
                                            <FormSelect
                                                name={`returnables.${index}.productId`}
                                                label=""
                                                options={availableOptions}
                                                placeholder="Search item..."
                                                isSearchable={true}
                                                isLoading={isLoadingProducts}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
                                            <div className="flex-1 sm:flex-none">
                                                <FormNumberStepper
                                                    name={`returnables.${index}.quantity`}
                                                    label=""
                                                />
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => remove(index)}
                                                title="Remove item"
                                                className="h-10 w-10 p-0 sm:mt-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl shrink-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}