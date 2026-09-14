"use client";

import React from "react";
import { Banknote, CreditCard, Receipt, TrendingDown } from "lucide-react";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCustomers } from "@/features/customers/api/use-customer";
import { OrderFormValues } from "../../schema/create-order-schema";
import { useOrderCalculations } from "@/lib/hooks/useOrderCalculations";

type Props = {
    branchId: string;
};

const CheckoutSale = ({ branchId }: Props) => {
    const { control, register, formState: { isValid, isSubmitting } } = useFormContext<OrderFormValues>();
    const { data: customerData } = useCustomers(branchId);
    const customerOptions = customerData?.customerOptions || [];

    const customerId = useWatch({ control, name: "customerId" });
    const saleType = useWatch({ control, name: "saleType" });

    const customer = customerOptions.find(c => c.id === customerId);
    const previousBalance = Number(customer?.customerCredit || 0);

    const {
        grossTotal,
        totalSecurityDeposit,
        totalDue,
        remainingBalance,
        discountBreakdown
    } = useOrderCalculations(branchId, previousBalance);

    return (
        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col h-fit sticky top-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
                <Banknote className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-wide">Checkout</h3>
            </div>

            <div className="space-y-4 flex-1">
                {/* Gross Total */}
                <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>Products Total</span>
                    <span className="font-semibold text-white">
                        Rs {grossTotal.toLocaleString()}
                    </span>
                </div>

                {/* Applied FOC Offers */}
                {discountBreakdown.length > 0 && (
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                            <Receipt className="h-3 w-3" /> Free Goods
                        </div>
                        {discountBreakdown.map((disc, idx) => (
                            <div key={idx} className="flex justify-between items-start text-xs">
                                <span className="text-slate-300 pr-2">{disc.name}</span>
                                <span className="text-emerald-400 font-bold">{disc.offerQty}x Free</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Security Deposit Tally */}
                {totalSecurityDeposit > 0 && (
                    <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-800 pt-3">
                        <span>Security Deposits</span>
                        <span className="font-semibold text-amber-400">
                            + Rs {totalSecurityDeposit.toLocaleString()}
                        </span>
                    </div>
                )}

                {/* Global Discount */}
                <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-800 pt-3">
                    <span>Bill Discount</span>
                    <Input
                        type="number"
                        min={0}
                        {...register("discount")}
                        placeholder="0"
                        className="w-24 h-8 bg-slate-800 border-slate-700 text-right text-white focus-visible:ring-emerald-500"
                    />
                </div>

                {/* Previous Khata Balance */}
                <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-800 pt-3">
                    <span>Previous Balance</span>
                    <span className={`font-semibold ${previousBalance > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                        Rs {previousBalance.toLocaleString()}
                    </span>
                </div>

                <div className="pt-4 border-t border-slate-700">
                    {/* Total Due */}
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Due</span>
                        <span className="text-3xl font-extrabold text-white">
                            Rs {totalDue.toLocaleString()}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {/* Payment Method */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                                Payment Method
                            </label>
                            <Controller
                                control={control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full h-10 rounded-xl bg-slate-800 border-slate-700 text-white focus:ring-emerald-500">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                <SelectValue />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CASH">Cash on Hand</SelectItem>
                                            <SelectItem value="BANK">Bank Transfer</SelectItem>
                                            <SelectItem value="KHATA">Add Full to Khata</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {/* Amount Received */}
                        <div className="relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                                Received Now
                            </label>
                            <Input
                                type="number"
                                {...register("amountPaid")}
                                className="h-12 bg-slate-800 border-slate-600 text-emerald-400 text-xl font-black text-right focus-visible:ring-emerald-500 shadow-inner"
                            />
                        </div>

                        {/* Live Remaining Balance */}
                        <div className="flex items-center justify-between bg-slate-950 rounded-lg p-3 border border-slate-800">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase">
                                <TrendingDown className="h-3.5 w-3.5" /> Remaining to Khata
                            </div>
                            <span className={`text-sm font-black ${remainingBalance > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                                Rs {remainingBalance.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full h-12 mt-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed..."
            >
                {isSubmitting ? "Processing..." : (saleType === "WALK_IN" ? "Finalize Sale" : "Dispatch Order")}
            </Button>
        </div>
    );
};

export default CheckoutSale;