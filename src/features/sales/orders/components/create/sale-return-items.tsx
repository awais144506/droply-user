/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { RotateCcw, Search, AlertCircle, PackageCheck, Trash2 } from "lucide-react";
import { useCustomer } from "@/features/manage/customers/api/use-customer";
import { FormSelect } from "@/components/ui/form-select";
import { FormNumberStepper } from "@/components/ui/form-number-stepper";
import { OrderFormValues } from "../../schema/create-order-schema";
import dayjs from "dayjs";

const SaleReturnItems = () => {
    const { control, setValue, getValues } = useFormContext<OrderFormValues>();

    // Watch customer and selected order
    const selectedCustomerId = useWatch({ control, name: "customerId" });
    const returnOrderId = useWatch({ control, name: "returnOrderId" });
    const currentItems = useWatch({ control, name: "items" }) || [];

    const { data: detailedCustomer, isLoading } = useCustomer(selectedCustomerId || "");

    // 1. Stabilize the arrays using useMemo
    const completedOrders = useMemo(() => {
        return detailedCustomer?.orders?.filter((o: any) => o.status === "COMPLETED") || [];
    }, [detailedCustomer?.orders]);

    const orderOptions = useMemo(() => {
        return completedOrders.map((o: any) => ({
            value: o.id,
            label: `${o.orderCode} (Rs ${o.totalAmount})`,
            date: o.createdAt,
        }));
    }, [completedOrders]);

    // 2. Safely populate items
    useEffect(() => {
        if (!returnOrderId) {
            if (getValues("items")?.length > 0) {
                setValue("items", []);
            }
            return;
        }

        const targetOrder = completedOrders.find((o: any) => o.id === returnOrderId);

        if (targetOrder && targetOrder.lineItems && targetOrder.lineItems.length > 0) {
            const currentFormItems = getValues("items") || [];

            const isAlreadyPopulated = currentFormItems.length === targetOrder.lineItems.length &&
                currentFormItems.every((item: any, idx: number) => item.productId === targetOrder.lineItems[idx].productId);

            if (!isAlreadyPopulated) {
                const newItems = targetOrder.lineItems.map((item: any) => ({
                    id: crypto.randomUUID(),
                    productId: item.productId,
                    productName: item.product?.name || "Unknown Product",
                    originalQty: item.paidQuantity || 0,
                    unitPrice: item.unitPrice || 0,
                    returnedToStoreQty: 0,
                    wastageQuantity: 0,
                    paidQty: 0,
                    emptiesIn: 0,
                    hasOffer: false,
                    offerQty: 0,
                    discountPrice: 0,
                    chargedDeposit: 0,
                    isDepositCharged: false,
                }));

                setValue("items", newItems);
            }
        }
    }, [returnOrderId, completedOrders, setValue, getValues]);

    if (!selectedCustomerId) return null;

    // Calculate live refund amount based on what the manager has stepped up
    const calculatedRefund = currentItems.reduce((total: number, item: any) => {
        const qtyReturned = (Number(item.returnedToStoreQty) || 0) + (Number(item.wastageQuantity) || 0);
        return total + (qtyReturned * (Number(item.unitPrice) || 0));
    }, 0);

    return (
        <section className="p-5 bg-rose-50/50 border border-rose-100 rounded-2xl transition-all animate-in fade-in slide-in-from-top-2 space-y-6">
            <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                <div className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 text-rose-500" />
                    <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wide">
                        Process Sale Return
                    </h3>
                </div>
                {calculatedRefund > 0 && (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        Khata Credit: + Rs {calculatedRefund.toLocaleString()}
                    </span>
                )}
            </div>

            {isLoading ? (
                <div className="text-sm text-rose-600 font-medium animate-pulse">Loading past orders...</div>
            ) : (
                <div className="space-y-6">

                    {/* 1. Order Selection Dropdown */}
                    <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
                        <FormSelect
                            name="returnOrderId"
                            label="Select Past Order"
                            options={orderOptions}
                            placeholder="Search completed orders..."
                            labelIcon={Search}
                            iconColor="text-rose-400"
                            formatOptionLabel={(opt) => (
                                <div className="flex items-center justify-between w-full pr-1">
                                    <span className="font-bold text-slate-700">{opt.label}</span>
                                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                        {dayjs(opt.date).format("DD MMM, YYYY")}
                                    </span>
                                </div>
                            )}
                        />
                        {completedOrders.length === 0 && (
                            <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> No completed orders found for this customer.
                            </p>
                        )}
                    </div>

                    {/* 2. The Bucket Splitter */}
                    {returnOrderId && currentItems.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Classify Returned Items
                            </h4>

                            {currentItems.map((item: any, index: number) => {
                                const totalBeingReturned = (Number(item.returnedToStoreQty) || 0) + (Number(item.wastageQuantity) || 0);
                                // 🔥 FIX 2: Read originalQty from the form state item, not paidQuantity
                                const maxAllowed = Number(item.originalQty) || 0;

                                return (
                                    <div key={item.id} className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex flex-col gap-3">

                                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                            <div>
                                                <span className="text-sm font-bold text-slate-800 block">{item.productName}</span>
                                                <span className="text-[10px] font-medium text-slate-500">
                                                    Original Purchase: {maxAllowed} at Rs {item.unitPrice}/each
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs font-bold block ${totalBeingReturned > 0 ? "text-rose-600" : "text-slate-400"}`}>
                                                    {totalBeingReturned} / {maxAllowed}
                                                </span>
                                                <span className="text-[9px] uppercase tracking-wider text-slate-400">Returned</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Bucket A: Usable Store Stock */}
                                            <div className="flex items-center justify-between bg-sky-50/50 border border-sky-100 p-2.5 rounded-lg">
                                                <div className="flex items-center gap-1.5">
                                                    <PackageCheck className="h-4 w-4 text-sky-500" />
                                                    <span className="text-[11px] font-bold text-sky-800">To Store (Usable)</span>
                                                </div>
                                                <FormNumberStepper
                                                    name={`items.${index}.returnedToStoreQty`}
                                                    min={0}
                                                    max={maxAllowed - (Number(item.wastageQuantity) || 0)}
                                                    theme="sky"
                                                />
                                            </div>

                                            {/* Bucket B: Wastage */}
                                            <div className="flex items-center justify-between bg-rose-50/50 border border-rose-100 p-2.5 rounded-lg">
                                                <div className="flex items-center gap-1.5">
                                                    <Trash2 className="h-4 w-4 text-rose-500" />
                                                    <span className="text-[11px] font-bold text-rose-800">To Wastage (Defective)</span>
                                                </div>
                                                <FormNumberStepper
                                                    name={`items.${index}.wastageQuantity`}
                                                    min={0}
                                                    max={maxAllowed - (Number(item.returnedToStoreQty) || 0)}
                                                    theme="rose"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            )}
        </section>
    );
};

export default SaleReturnItems;