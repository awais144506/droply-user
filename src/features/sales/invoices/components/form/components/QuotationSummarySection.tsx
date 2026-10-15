/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Calculator, FileCheck2, Percent, Wallet } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toWords } from "number-to-words"

export function QuotationSummarySection() {
    const { register, watch, setValue } = useFormContext();

    const items = watch("items") || [];
    const gstPercent = Number(watch("gstPercent")) || 0;
    const discount = Number(watch("discount")) || 0;
    const advanceAmount = Number(watch("advanceAmount")) || 0;

    // Calculate live totals
    const computedSubTotal = items.reduce((sum: number, item: any) => {
        const q = Number(item?.quantity) || 0;
        const p = Number(item?.unitPrice) || 0;
        return sum + q * p;
    }, 0);

    const computedGstAmount = Math.round(((computedSubTotal * gstPercent) / 100) * 100) / 100;
    const computedTotalAmount = Math.max(0, Math.round((computedSubTotal + computedGstAmount - discount) * 100) / 100);
    const computedBalanceDue = Math.max(0, Math.round((computedTotalAmount - advanceAmount) * 100) / 100);

    // Sync computed values back into RHF form state so Yup validation & payload submission are exact
    useEffect(() => {
        setValue("subTotal", computedSubTotal);
        setValue("gstAmount", computedGstAmount);
        setValue("totalAmount", computedTotalAmount);
        setValue("balanceDue", computedBalanceDue);

        items.forEach((item: any, idx: number) => {
            const rowAmt = Math.round((Number(item?.quantity || 0) * Number(item?.unitPrice || 0)) * 100) / 100;
            if (item?.amount !== rowAmt) {
                setValue(`items.${idx}.amount`, rowAmt);
            }
        });
    }, [computedSubTotal, computedGstAmount, computedTotalAmount, computedBalanceDue, items, setValue]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Terms & Conditions, Notes & Amount in Words */}
            <Card className="lg:col-span-7 rounded-2xl border-slate-200/90 shadow-xs">
                <CardHeader className="p-5 border-b border-slate-100">
                    <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-sky-600" />
                        Terms, Notes & Amount in Words
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                    {/* Live Amount in Words Banner (Matches PDF) */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                            In Words
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                            &ldquo;{toWords(computedTotalAmount).toUpperCase()}&rdquo;
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                            Terms & Conditions
                        </label>
                        <textarea
                            rows={3}
                            {...register("termsAndConditions")}
                            placeholder="e.g. Thank you for doing business with us. 50% advance required upon confirmation."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                            Internal Notes
                        </label>
                        <textarea
                            rows={2}
                            {...register("notes")}
                            placeholder="Any additional remarks or delivery timeline notes..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Right 5 Cols: Financial Summary & Tax Breakdown */}
            <Card className="lg:col-span-5 rounded-2xl border-slate-200/90 shadow-xs">
                <CardHeader className="p-5 border-b border-slate-100">
                    <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-sky-600" />
                        Tax & Summary Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                    {/* Sub Total */}
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 py-1">
                        <span>Sub Total</span>
                        <span className="text-sm font-black text-slate-900 tabular-nums">
                            Rs. {computedSubTotal.toLocaleString()}
                        </span>
                    </div>

                    {/* GST Input & Calculated GST Amount */}
                    <div className="grid grid-cols-2 gap-3 items-end pt-2 border-t border-slate-100">
                        <FormInput
                            name="gstPercent"
                            label="GST @"
                            type="number"
                            suffix="%"
                            min={0}
                            max={100}
                            labelIcon={Percent}
                        />
                        <div className="space-y-1.5">
                            <span className="block text-[11px] font-bold text-slate-400 uppercase">
                                GST Amount
                            </span>
                            <div className="h-10 px-3 rounded-xl bg-slate-100/80 border border-slate-200 flex items-center justify-end font-bold text-xs text-slate-700 tabular-nums">
                                Rs. {computedGstAmount.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Discount & Advance Received */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <FormInput
                            name="discount"
                            label="Discount"
                            type="number"
                            prefix="Rs"
                            min={0}
                        />
                        <FormInput
                            name="advanceAmount"
                            label="Advance / Received"
                            type="number"
                            prefix="Rs"
                            min={0}
                            labelIcon={Wallet}
                        />
                    </div>

                    {/* Grand Total & Balance Due Box */}
                    <div className="rounded-2xl bg-slate-900 text-white p-4 space-y-2.5 mt-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Grand Total
                            </span>
                            <span className="text-xl font-black text-white tabular-nums">
                                Rs. {computedTotalAmount.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                                Balance Due
                            </span>
                            <span className="text-lg font-black text-sky-400 tabular-nums">
                                Rs. {computedBalanceDue.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}