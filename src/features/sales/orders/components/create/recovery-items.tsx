/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { HandCoins, Package, Banknote } from "lucide-react";
import { useCustomer } from "@/features/manage/customers/api/use-customer";
import { FormInput } from "@/components/ui/form-input";
import { FormNumberStepper } from "@/components/ui/form-number-stepper";
import { OrderFormValues } from "../../schema/create-order-schema";

const RecoveryItems = () => {
    const { control, setValue, getValues } = useFormContext<OrderFormValues>();

    const selectedCustomerId = useWatch({ control, name: "customerId" });
    const { data: detailedCustomer, isLoading } = useCustomer(selectedCustomerId || "");

    useEffect(() => {
        if (detailedCustomer?.returnables) {
            const currentItems = getValues("items") || [];

            const newItems = detailedCustomer.returnables.map((r: any) => {
                const existing = currentItems.find((i: any) => i.productId === r.productId);
                return {
                    id: existing?.id || crypto.randomUUID(),
                    productId: r.productId,
                    paidQty: existing?.paidQty || 0,
                    emptiesIn: 0,
                    hasOffer: false,
                    offerQty: 0,
                    discountPrice: 0,
                    chargedDeposit: 0,
                    isDepositCharged: false,
                };
            });

            const isDifferent = newItems.length !== currentItems.length || newItems.some((ni: any, idx: number) => ni.productId !== currentItems[idx]?.productId);

            if (isDifferent) {
                setValue("items", newItems);
                setValue("amountPaid", Number(detailedCustomer.customerCredit || 0));
            }
        }
    }, [detailedCustomer, setValue, getValues]);

    if (!selectedCustomerId) return null;

    const returnables = detailedCustomer?.returnables || [];
    const customerCredit = Number(detailedCustomer?.customerCredit || 0);

    return (
        <section className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl transition-all animate-in fade-in slide-in-from-top-2 space-y-6">
            <div className="flex items-center gap-2 border-b border-emerald-200 pb-3">
                <HandCoins className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">
                    Log Asset & Cash Recovery
                </h3>
            </div>

            {isLoading ? (
                <div className="text-sm text-emerald-600 font-medium animate-pulse">Loading customer ledger...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                                <Banknote className="h-4 w-4 text-emerald-500" /> Cash Recovery
                            </h4>
                            <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded shadow-sm">
                                Owes: Rs {customerCredit.toLocaleString()}
                            </span>
                        </div>
                        <FormInput
                            name="amountPaid"
                            type="number"
                            placeholder="0"
                            min={0}
                            max={customerCredit > 0 ? customerCredit : 0}
                        />
                    </div>
                    <div className="space-y-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Package className="h-4 w-4 text-emerald-500" /> Asset Recovery
                        </h4>

                        {returnables.map((item: any, index: number) => (
                            <div key={item.id} className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-slate-700 truncate">{item.productName}</span>
                                    <span className="text-[10px] font-medium text-slate-500">Max Hold: {item.currentBalance}</span>
                                </div>
                                <FormNumberStepper
                                    name={`items.${index}.paidQty`}
                                    min={0}
                                    max={item.currentBalance}
                                    theme="emerald"
                                />

                            </div>
                        ))}
                    </div>

                </div>
            )}
        </section>
    );
};

export default RecoveryItems;