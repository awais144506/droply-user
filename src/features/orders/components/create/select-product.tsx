"use client";

import React from "react";
import { Package, Plus, Trash2, Gift, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";
import { FormInput } from "@/components/ui/form-input";
import { useProducts } from "@/features/products/api/use-products";
import { OrderFormValues } from "../../schema/create-order-schema";

type Props = {
    branchId: string;
};

const SelectProduct = ({ branchId }: Props) => {
    const { control, setValue } = useFormContext<OrderFormValues>();

    const { data, isLoading } = useProducts(branchId);
    const allProducts = data?.products || [];

    const productOptions = allProducts.map(p => ({
        label: `${p.name} - ${p.trackingType} (Rs ${p.salePrice})`,
        value: p.id,
        trackingType: p.trackingType,
        name: p.name,
        price: p.salePrice
    }));

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchedItems = useWatch({
        control,
        name: "items",
    });

    const handleAdd = () => {
        append({
            id: crypto.randomUUID(),
            productId: "",
            paidQty: 1,
            emptiesIn: 0,
            hasOffer: false,
            offerQty: 0,
            discountPrice: 0,
            chargedDeposit: 0, 
            isDepositCharged: false // 🔥 Ensure boolean initializes as false
        });
    };

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Products & Assets
                </h3>
            </div>

            <div className="grid grid-cols-12 gap-3 mb-2 text-[10px] font-bold text-slate-400 uppercase px-2">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Paid Qty</div>
                <div className="col-span-2 text-center">Empties In</div>
                <div className="col-span-2 text-center">FOC</div>
                <div className="col-span-1"></div>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => {
                    const currentItemState = watchedItems?.[index] || field;
                    const selectedProductDetails = allProducts.find(
                        p => p.id === currentItemState.productId
                    );
                    const isReturnable = selectedProductDetails?.trackingType === "RETURNABLE";
                    const currentStock = selectedProductDetails?.currentStock || 0;
                    const depositRate = selectedProductDetails?.securityDeposit || 0;
                    const paidQty = Number(currentItemState.paidQty) || 0;
                    const offerQty = Number(currentItemState.offerQty) || 0;
                    const emptiesIn = Number(currentItemState.emptiesIn) || 0;
                    const totalRequested = paidQty + offerQty;
                    const remainingStock = currentStock - totalRequested;
                    const isOutOfStock = remainingStock < 0;
                    const deficit = Math.max(0, totalRequested - emptiesIn);
                    const showDepositWarning = isReturnable && deficit > 0;
                    const isDepositCharged = currentItemState.isDepositCharged === true;
                    const calculatedDepositNeeded = deficit * depositRate;

                    return (
                        <div key={field.id} className={`p-3 border rounded-xl transition-colors ${isOutOfStock ? 'bg-rose-50/30 border-rose-200' : 'bg-white border-slate-100'}`}>
                            <div className="grid grid-cols-12 gap-3 items-start">
                                {/* Product Selection */}
                                <div className="col-span-5 relative -mt-0.5">
                                    <FormSelect
                                        name={`items.${index}.productId`}
                                        label=""
                                        isSearchable={true}
                                        isLoading={isLoading}
                                        options={productOptions}
                                        formatOptionLabel={(opt) => (
                                            <div className="flex items-center justify-between w-full pr-1">
                                                <span className="font-medium truncate mr-2">
                                                    {opt.name}
                                                    <span className="text-[10px] opacity-70 font-normal ml-1">
                                                        (Rs {opt.price})
                                                    </span>
                                                </span>
                                                <span className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white shadow-sm ${opt.trackingType === "RETURNABLE"
                                                    ? "bg-purple-500"
                                                    : "bg-indigo-500"
                                                    }`}>
                                                    {opt.trackingType}
                                                </span>
                                            </div>
                                        )}
                                    />
                                    {selectedProductDetails && (
                                        <span className={`absolute -bottom-5 left-1 text-[10px] font-bold flex items-center gap-1 ${isOutOfStock ? 'text-rose-600' :
                                            remainingStock <= (selectedProductDetails.lowStockThreshold || 0) ? 'text-amber-500' :
                                                'text-emerald-600'
                                            }`}>
                                            {isOutOfStock && <AlertCircle className="h-3 w-3" />}
                                            {isOutOfStock ? "Stock Exceeded!" : `Stock Left: ${remainingStock}`}
                                        </span>
                                    )}
                                </div>

                                {/* Paid Qty */}
                                <div className="col-span-2">
                                    <FormInput
                                        type="number"
                                        name={`items.${index}.paidQty`}
                                        min={1}
                                        max={currentStock - offerQty}
                                        className={`text-center font-bold ${isOutOfStock ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-white'}`}
                                    />
                                </div>

                                {/* Empties In */}
                                <div className="col-span-2">
                                    {isReturnable ? (
                                        <FormInput
                                            type="number"
                                            name={`items.${index}.emptiesIn`}
                                            min={0}
                                            className="text-center text-sky-700 font-bold bg-sky-50 border-sky-200 focus:bg-white"
                                        />
                                    ) : (
                                        <div className="h-10 flex items-center justify-center bg-slate-100 rounded-xl border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">N/A</span>
                                        </div>
                                    )}
                                </div>

                                {/* FOC Toggle */}
                                <div className="col-span-2 flex justify-center mt-2">
                                    <Switch
                                        checked={currentItemState.hasOffer}
                                        onCheckedChange={(val) => setValue(`items.${index}.hasOffer`, val)}
                                        disabled={currentStock <= 0}
                                    />
                                </div>

                                {/* Remove Row */}
                                <div className="col-span-1 flex justify-end mt-1">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Nested FOC Row */}
                            {currentItemState.hasOffer && (
                                <div className="mt-7 pl-5 pr-2 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-4">
                                    <div className="flex items-center gap-2 flex-1">
                                        <Gift className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span className="text-xs font-bold text-emerald-700 truncate">
                                            Free Item: {selectedProductDetails?.name || "Product"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Qty Out:</span>
                                        <div className="w-20">
                                            <FormInput
                                                type="number"
                                                name={`items.${index}.offerQty`}
                                                min={0}
                                                max={currentStock - paidQty}
                                                className={`text-center font-bold ${isOutOfStock ? 'bg-rose-100 border-rose-300 text-rose-700' : 'bg-white border-emerald-200 text-emerald-700'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Asset Deficit Warning & Deposit Toggle */}
                            {showDepositWarning && (
                                <div className={`mt-6 p-3 border rounded-xl flex items-start sm:items-center gap-3 transition-all animate-in fade-in ${
                                    isDepositCharged ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50 border-amber-200"
                                }`}>
                                    {isDepositCharged ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                                    )}
                                    <div className="flex-1">
                                        <p className={`text-[13px] font-extrabold ${isDepositCharged ? "text-emerald-800" : "text-amber-800"}`}>
                                            Deficit: {deficit} Missing Container(s)
                                        </p>
                                        <p className={`text-[10px] font-medium leading-tight mt-0.5 ${isDepositCharged ? "text-emerald-600" : "text-amber-700"}`}>
                                            Deposit Required: Rs {calculatedDepositNeeded.toLocaleString()} (@ Rs {depositRate}/ea)
                                        </p>
                                    </div>

                                    {/* Toggle buttons hooked up to the boolean state */}
                                    {isDepositCharged ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="border-emerald-200 text-emerald-600 hover:bg-emerald-100 text-[10px] h-8 shrink-0 shadow-sm"
                                            onClick={() => setValue(`items.${index}.isDepositCharged`, false)}
                                        >
                                            Remove Deposit
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] h-8 shrink-0 shadow-sm"
                                            onClick={() => setValue(`items.${index}.isDepositCharged`, true)}
                                        >
                                            Charge Rs {calculatedDepositNeeded}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <Button
                type="button"
                onClick={handleAdd}
                variant="outline"
                className="w-full mt-4 h-11 border-dashed border-slate-300 text-slate-500 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 cursor-pointer rounded-xl"
            >
                <Plus className="h-4 w-4 mr-2" /> Add Another Item
            </Button>
        </section>
    );
};

export default SelectProduct;