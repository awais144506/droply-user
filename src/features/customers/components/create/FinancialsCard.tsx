
import { Controller, useFieldArray } from "react-hook-form";
import ReactSelect from "react-select";
import { Wallet, Trash2, PlusCircle, Package } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reactSelectClassNames } from "@/utils/react-select-styles";


export default function FinancialsCard({ control, register, errors, productOptions }: any) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "openingReturnables",
    });

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
                            label="Khata (Credit)"
                            type="number"
                            prefix="Rs"
                            register={register("customerCredit")}
                            error={errors.customerCredit?.message}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Advance Paid"
                            type="number"
                            prefix="Rs"
                            register={register("customerAdvance")}
                            error={errors.customerAdvance?.message}
                        />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                        <FormInput
                            label="Security Deposit"
                            type="number"
                            prefix="Rs"
                            register={register("securityDeposit")}
                            error={errors.securityDeposit?.message}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center mr-2">
                            <Package className="h-4 w-4 text-sky-600 mr-2" />
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Opening Returnables</label>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ productId: "", quantity: 1 })}
                            className="h-7 text-[10px] rounded-lg px-2 text-sky-600 border-sky-200 hover:bg-sky-50"
                        >
                            <PlusCircle className="h-3 w-3 mr-1" /> Add Item
                        </Button>
                    </div>

                    {fields.length === 0 ? (
                        <div className="text-xs text-slate-400 bg-slate-50 rounded-xl p-4 text-center border border-dashed border-slate-200">
                            No assets assigned to this customer yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-start gap-2">
                                    <div className="flex-1">
                                        <Controller
                                            name={`openingReturnables.${index}.productId`}
                                            control={control}
                                            render={({ field: selectField }) => (
                                                <ReactSelect
                                                    options={productOptions}
                                                    value={productOptions.find(p => p.value === selectField.value) || null}
                                                    onChange={(opt) => selectField.onChange(opt?.value || "")}
                                                    placeholder="Search item..."
                                                    isClearable
                                                    unstyled
                                                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                                    menuPosition="fixed"
                                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                    classNames={{
                                                        ...reactSelectClassNames,
                                                        control: (state) =>
                                                            `flex min-h-10 w-full items-center justify-between rounded-xl bg-slate-50 border px-3 ${errors.openingReturnables?.[index]?.productId ? 'border-rose-300'
                                                                : state.isFocused ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200'
                                                            } hover:bg-white transition-colors text-sm cursor-text`
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="w-24">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                {...register(`openingReturnables.${index}.quantity`, { valueAsNumber: true })}
                                                className={`w-full h-10 pr-8 pl-3 rounded-xl border bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:bg-white ${errors.openingReturnables?.[index]?.quantity ? 'border-rose-300' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                                                    }`}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Qty</span>
                                        </div>
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
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}