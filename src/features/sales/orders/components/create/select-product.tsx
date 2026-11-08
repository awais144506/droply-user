/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useMemo, useEffect } from "react";
import {
    Package,
    Plus,
    Trash2,
    Gift,
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Tag,
} from "lucide-react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";
import { FormInput } from "@/components/ui/form-input";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useCustomer } from "@/features/manage/customers/api/use-customer";
import { OrderFormValues } from "../../schema/create-order-schema";
import { FormNumberStepper } from "@/components/ui/form-number-stepper";

type Props = {
    branchId: string;
    initialData?: any;
};

const SelectProduct = ({ branchId, initialData }: Props) => {
    const { control, setValue } = useFormContext<OrderFormValues>();

    const { data, isLoading } = useProducts(branchId);

    const allProducts = useMemo(() => {
        return data?.products?.filter((p: any) => p.isActive === true) || [];
    }, [data?.products]);

    const selectedCustomerId = useWatch({ control, name: "customerId" });
    const watchedItems = useWatch({ control, name: "items" });
    const { data: detailedCustomer } = useCustomer(selectedCustomerId || "");

    const customerPrices: { productId: string; priceTierId: string | null }[] = useMemo(() => {
        return detailedCustomer?.customerPrices || [];
    }, [detailedCustomer?.customerPrices]);

    const productOptions = useMemo(() => {
        return allProducts.map((p: any) => {
            const defaultPrice = p.salePrice ?? p.priceTiers?.[0]?.salePrice ?? 0;
            return {
                label: `${p.name} ${p.trackingType} (Rs ${defaultPrice})`,
                value: p.id,
                trackingType: p.trackingType,
                name: p.name,
                price: defaultPrice,
                category: p.category,
            };
        });
    }, [allProducts]);

    const returnableProductOptions = useMemo(() => {
        return allProducts
            .filter((p: any) => p.trackingType === "RETURNABLE")
            .map((p: any) => ({
                label: `${p.name} (Deposit: Rs ${p.securityDeposit || 0})`,
                value: p.id,
                name: p.name,
                trackingType: p.trackingType,
                securityDeposit: p.securityDeposit || 0,
            }));
    }, [allProducts]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    // 🔥 FIX 2: Consume each assetExchange only ONCE so 2nd/3rd items don't steal the 1st item's container!
    useEffect(() => {
        if (initialData?.lineItems && initialData.lineItems.length > 0) {
            const usedExchangeIds = new Set<string>();

            const mappedItems = initialData.lineItems.map((item: any, idx: number) => {
                const freeQty = Number(item.freeQuantity || item.offerQty || 0);

                // 1. Try exact match first, otherwise match by index if unused
                let matchingAssetExchange = initialData.assetExchanges?.find(
                    (ae: any) =>
                        !usedExchangeIds.has(ae.id) &&
                        (ae.productId === item.containerId ||
                            ae.productId === item.returnableProductId)
                );

                if (!matchingAssetExchange && initialData.assetExchanges?.[idx]) {
                    const candidate = initialData.assetExchanges[idx];
                    if (!usedExchangeIds.has(candidate.id)) {
                        matchingAssetExchange = candidate;
                    }
                }

                if (matchingAssetExchange?.id) {
                    usedExchangeIds.add(matchingAssetExchange.id);
                }

                const emptiesOutVal = matchingAssetExchange
                    ? Number(matchingAssetExchange.outboundQuantity ?? 0)
                    : Number(item.emptiesOut ?? item.outboundQuantity ?? 0);

                const emptiesInVal = matchingAssetExchange
                    ? Number(matchingAssetExchange.inboundQuantity ?? 0)
                    : Number(item.emptiesIn ?? item.inboundQuantity ?? 0);

                const depositChargedVal = Number(
                    matchingAssetExchange?.depositCharged ?? item.depositCharged ?? 0
                );

                return {
                    id: item.id || crypto.randomUUID(),
                    productId: item.productId || item.product?.id || "",
                    priceTierId: item.priceTierId || null,
                    paidQty: item.paidQuantity ?? item.quantity ?? 1,
                    emptiesIn: emptiesInVal,
                    emptiesOut: emptiesOutVal,
                    hasOffer: freeQty > 0 || Boolean(item.hasOffer),
                    offerQty: freeQty,
                    freeProductId: item.freeProductId || item.productId || "",
                    discountPrice: item.discountPrice || 0,
                    chargedDeposit: depositChargedVal,
                    isDepositCharged: depositChargedVal > 0,
                    unitPrice: item.unitPrice || 0,
                    returnableProductId:
                        item.returnableProductId || matchingAssetExchange?.productId || "",
                };
            });
            setValue("items", mappedItems);
        }
    }, [initialData, setValue]);

    const prevSelectionRef = useRef<Record<number, string>>({});

    // 🔥 FIX 3: Include savedPriceRecord?.priceTierId in selectionKey so async customerPrices load highlights the tier
    useEffect(() => {
        if (!watchedItems || allProducts.length === 0) return;

        watchedItems.forEach((item: any, index: number) => {
            if (!item?.productId) return;

            const savedPriceRecord = customerPrices.find(
                (cp) => cp.productId === item.productId
            );

            const selectionKey = `${selectedCustomerId || "walkin"}_${item.productId}_${savedPriceRecord?.priceTierId || "none"}`;
            if (prevSelectionRef.current[index] === selectionKey) return;
            prevSelectionRef.current[index] = selectionKey;

            const product: any = allProducts.find((p: any) => p.id === item.productId);
            if (!product) return;

            const priceTiers: any[] = product.priceTiers || [];

            // If editing an order and unitPrice already matches a tier, keep that tier or saved customer tier
            if (savedPriceRecord?.priceTierId) {
                const matchedTier = priceTiers.find(
                    (t: any) => t.id === savedPriceRecord.priceTierId
                );
                if (matchedTier) {
                    setValue(`items.${index}.priceTierId` as any, matchedTier.id, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                    setValue(`items.${index}.unitPrice`, Number(matchedTier.salePrice), {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                    return;
                }
            }

            if (item.unitPrice) {
                const tierByPrice = priceTiers.find(
                    (t: any) => Number(t.salePrice) === Number(item.unitPrice)
                );
                if (tierByPrice) {
                    setValue(`items.${index}.priceTierId` as any, tierByPrice.id, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                    return;
                }
            }

            if (priceTiers.length === 1) {
                setValue(`items.${index}.priceTierId` as any, priceTiers[0].id, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                setValue(`items.${index}.unitPrice`, Number(priceTiers[0].salePrice), {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            } else if (priceTiers.length > 1) {
                setValue(`items.${index}.priceTierId` as any, "", {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                setValue(
                    `items.${index}.unitPrice`,
                    Number(product.salePrice || priceTiers[0]?.salePrice || 0),
                    { shouldDirty: true }
                );
            } else {
                setValue(`items.${index}.priceTierId` as any, null, { shouldDirty: true });
                setValue(`items.${index}.unitPrice`, Number(product.salePrice || 0), {
                    shouldDirty: true,
                });
            }
        });
    }, [watchedItems, selectedCustomerId, customerPrices, allProducts, setValue]);

    const handleAdd = () => {
        append({
            id: crypto.randomUUID(),
            productId: "",
            priceTierId: null,
            paidQty: 1,
            emptiesIn: 0,
            emptiesOut: 0,
            hasOffer: false,
            offerQty: 0,
            freeProductId: "",
            discountPrice: 0,
            chargedDeposit: 0,
            isDepositCharged: false,
            unitPrice: 0,
            returnableProductId: "",
        } as any);
    };

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Select Products
                </h3>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => {
                    const currentItemState: any = watchedItems?.[index] || field;
                    const selectedProductDetails: any = allProducts.find(
                        (p: any) => p.id === currentItemState.productId
                    );

                    const productTiers: any[] = selectedProductDetails?.priceTiers || [];
                    const savedCustomerPrice = customerPrices.find(
                        (cp) => cp.productId === currentItemState.productId
                    );
                    const isFirstTimeProduct =
                        Boolean(selectedCustomerId) &&
                        Boolean(currentItemState.productId) &&
                        !savedCustomerPrice?.priceTierId;

                    const isOutright = selectedProductDetails?.trackingType === "OUTRIGHT";
                    const currentStock = selectedProductDetails?.currentStock || 0;
                    const paidQty = Number(currentItemState.paidQty) || 0;
                    const emptiesIn = Number(currentItemState.emptiesIn) || 0;
                    const emptiesOut =
                        currentItemState.emptiesOut !== undefined &&
                        currentItemState.emptiesOut !== null
                            ? Number(currentItemState.emptiesOut)
                            : 0;

                    const selectedReturnableId = currentItemState.returnableProductId;
                    const selectedContainerAsset = allProducts.find(
                        (p: any) => p.id === selectedReturnableId
                    );
                    const containerDepositRate = selectedContainerAsset?.securityDeposit || 0;

                    const customerReturnableLedger = detailedCustomer?.returnables?.find(
                        (r: any) => r.productId === selectedReturnableId
                    );

                    const totalCustomerHeldForAsset = Number(
                        customerReturnableLedger?.currentBalance ?? 0
                    );

                    // 🔥 FIX 1: Calculate how many empties of this same asset are already claimed in OTHER rows
                    const emptiesInUsedByOtherRows = (watchedItems || []).reduce(
                        (sum: number, otherItem: any, otherIdx: number) => {
                            if (
                                otherIdx !== index &&
                                otherItem?.returnableProductId === selectedReturnableId
                            ) {
                                return sum + (Number(otherItem?.emptiesIn) || 0);
                            }
                            return sum;
                        },
                        0
                    );

                    // Remaining empties this row is allowed to take in
                    const maxCustomerEmpties = Math.max(
                        0,
                        totalCustomerHeldForAsset - emptiesInUsedByOtherRows
                    );

                    const isSameFreeProduct =
                        !currentItemState.freeProductId ||
                        currentItemState.freeProductId === currentItemState.productId;
                    const freeProductDetails: any = isSameFreeProduct
                        ? selectedProductDetails
                        : allProducts.find((p: any) => p.id === currentItemState.freeProductId);
                    const freeStock = freeProductDetails?.currentStock || 0;
                    const offerQty = Number(currentItemState.offerQty) || 0;

                    let remainingPaidStock = currentStock - paidQty;
                    let remainingFreeStock = freeStock - offerQty;

                    if (isSameFreeProduct) {
                        const totalRequested = paidQty + offerQty;
                        remainingPaidStock = currentStock - totalRequested;
                        remainingFreeStock = remainingPaidStock;
                    }

                    const isOutOfStock = remainingPaidStock < 0;
                    const isFreeOutOfStock = remainingFreeStock < 0;

                    const deficit = Math.max(0, emptiesOut - emptiesIn);
                    const showDepositWarning =
                        isOutright &&
                        Boolean(selectedReturnableId) &&
                        Boolean(selectedContainerAsset) &&
                        deficit > 0;
                    const isDepositCharged = currentItemState.isDepositCharged === true;
                    const calculatedDepositNeeded = deficit * containerDepositRate;
                    const scale = selectedProductDetails?.unitOfMeasure;

                    return (
                        <div
                            key={field.id}
                            className={`p-4 border rounded-2xl transition-colors space-y-4 ${
                                isOutOfStock
                                    ? "bg-rose-50/30 border-rose-200"
                                    : "bg-white border-slate-200/80 shadow-xs"
                            }`}
                        >
                            <div className="grid grid-cols-12 gap-4 items-start">
                                {/* Product Selection */}
                                <div className="col-span-12 sm:col-span-4 relative">
                                    <FormSelect
                                        name={`items.${index}.productId`}
                                        label="Product"
                                        isSearchable={true}
                                        isLoading={isLoading}
                                        options={productOptions}
                                        excludeFromList={watchedItems}
                                        excludeKey="productId"
                                        currentIndex={index}
                                        isClearable={true}
                                        formatOptionLabel={(opt: any) => (
                                            <div className="flex items-center justify-between w-full pr-1 py-0.5">
                                                <div className="flex flex-col truncate mr-2">
                                                    <span className="text-sm font-bold truncate">
                                                        {opt.name}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-[10px] font-bold text-emerald-600">
                                                            Rs {opt.price}
                                                        </span>
                                                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                                            • {opt.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white shadow-sm ${
                                                        opt.trackingType === "RETURNABLE"
                                                            ? "bg-purple-500"
                                                            : "bg-indigo-500"
                                                    }`}
                                                >
                                                    {opt.trackingType}
                                                </span>
                                            </div>
                                        )}
                                    />
                                    {selectedProductDetails && (
                                        <span
                                            className={`absolute -bottom-5 left-1 text-[11px] font-bold flex items-center gap-1 ${
                                                isOutOfStock
                                                    ? "text-rose-600"
                                                    : remainingPaidStock <=
                                                      (selectedProductDetails.lowStockThreshold || 0)
                                                    ? "text-amber-500"
                                                    : "text-emerald-600"
                                            }`}
                                        >
                                            {isOutOfStock && <AlertCircle className="h-3 w-3" />}
                                            {isOutOfStock
                                                ? "Stock Exceeded!"
                                                : `Stock Left: ${remainingPaidStock} ( ${scale} )`}
                                        </span>
                                    )}
                                </div>

                                {/* Paid Qty */}
                                <div className="col-span-6 sm:col-span-2">
                                    <FormNumberStepper
                                        label="Paid Qty"
                                        name={`items.${index}.paidQty`}
                                        min={1}
                                        max={isSameFreeProduct ? currentStock - offerQty : currentStock}
                                    />
                                </div>

                                {/* Container Asset & Dual Empties Out / Empties In */}
                                <div className="col-span-12 sm:col-span-4 space-y-3">
                                    {isOutright && (
                                        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                                            <FormSelect
                                                name={`items.${index}.returnableProductId`}
                                                label="Exchange Items"
                                                isSearchable={true}
                                                options={returnableProductOptions}
                                                excludeFromList={watchedItems}
                                                excludeKey="returnableProductId"
                                                currentIndex={index}
                                                placeholder="Select empty shell..."
                                                isClearable={true}
                                                formatOptionLabel={(opt: any) => (
                                                    <div className="flex items-center justify-between w-full pr-1 py-0.5">
                                                        <span className="text-xs font-bold truncate mr-2">
                                                            {opt.name}
                                                        </span>
                                                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-purple-100 text-purple-700">
                                                            Deposit: Rs {opt.securityDeposit}
                                                        </span>
                                                    </div>
                                                )}
                                            />

                                            {initialData && Boolean(selectedReturnableId) && (
                                                <div className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 leading-tight font-medium">
                                                    <strong>Adjustment Note:</strong> Empties Out/In reflect the original transaction. Changing these will re-sync the customer&apos;s held container balance.
                                                </div>
                                            )}

                                            { Boolean(selectedReturnableId) && (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="relative">
                                                        <FormNumberStepper
                                                            label="Items Out"
                                                            name={`items.${index}.emptiesOut`}
                                                            min={0}
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <FormNumberStepper
                                                            label="Items In"
                                                            name={`items.${index}.emptiesIn`}
                                                            min={0}
                                                            max={maxCustomerEmpties}
                                                        />
                                                        {selectedCustomerId && selectedReturnableId && (
                                                            <span className="absolute -bottom-4 left-0 w-full text-center text-[9px] font-bold text-slate-500">
                                                                Max Held: {maxCustomerEmpties}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* FOC Switch */}
                                <div className="col-span-4 sm:col-span-1 flex flex-col items-center justify-center pt-2">
                                    <span className="text-xs font-bold uppercase tracking-wide mb-2">
                                        FOC
                                    </span>
                                    <Switch
                                        checked={currentItemState.hasOffer}
                                        onCheckedChange={(val) => {
                                            setValue(`items.${index}.hasOffer`, val);
                                            if (val && !currentItemState.freeProductId) {
                                                setValue(
                                                    `items.${index}.freeProductId`,
                                                    currentItemState.productId
                                                );
                                            }
                                        }}
                                        disabled={currentStock <= 0}
                                    />
                                </div>

                                {/* Remove Row */}
                                <div className="col-span-2 sm:col-span-1 flex justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {selectedProductDetails && productTiers.length > 0 && (
                                <div
                                    className={`mt-7 p-3 rounded-xl border transition-all ${
                                        isFirstTimeProduct && !currentItemState.priceTierId
                                            ? "bg-amber-50/70 border-amber-200"
                                            : "bg-slate-50/80 border-slate-200/80"
                                    }`}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <Tag
                                                className={`h-3.5 w-3.5 ${
                                                    isFirstTimeProduct && !currentItemState.priceTierId
                                                        ? "text-amber-600"
                                                        : "text-sky-600"
                                                }`}
                                            />
                                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                                                Customer Price Tier
                                            </span>
                                        </div>

                                        {savedCustomerPrice?.priceTierId ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                                                {currentItemState.priceTierId === savedCustomerPrice.priceTierId
                                                    ? "Previous Customer Rate Applied"
                                                    : "Updating Customer Rate on Save"}
                                            </span>
                                        ) : selectedCustomerId ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                First-Time Sale • Select Rate to Save for Customer
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {productTiers.map((tier: any) => {
                                            const isSelected = currentItemState.priceTierId === tier.id;
                                            const isSavedDefault =
                                                savedCustomerPrice?.priceTierId === tier.id;

                                            return (
                                                <button
                                                    key={tier.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setValue(
                                                            `items.${index}.priceTierId` as any,
                                                            tier.id,
                                                            { shouldDirty: true, shouldValidate: true }
                                                        );
                                                        setValue(
                                                            `items.${index}.unitPrice`,
                                                            Number(tier.salePrice),
                                                            { shouldDirty: true, shouldValidate: true }
                                                        );
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                                                        isSelected
                                                            ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                                                            : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40"
                                                    }`}
                                                >
                                                    <span>{tier.title || "Tier"}</span>
                                                    <span
                                                        className={`text-[11px] font-extrabold ${
                                                            isSelected ? "text-sky-100" : "text-sky-600"
                                                        }`}
                                                    >
                                                        Rs {Number(tier.salePrice).toLocaleString()}
                                                    </span>
                                                    {isSavedDefault && (
                                                        <span
                                                            className={`text-[9px] px-1 py-0.2 rounded uppercase ${
                                                                isSelected
                                                                    ? "bg-sky-700 text-sky-100"
                                                                    : "bg-slate-100 text-slate-500"
                                                            }`}
                                                        >
                                                            Saved
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Nested FOC Row */}
                            {currentItemState.hasOffer && (
                                <div className="mt-4 pl-5 pr-2 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start gap-4">
                                    <Gift className="h-5 w-5 text-emerald-500 shrink-0 mt-2.5" />

                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                                            Select Free Item
                                        </label>
                                        <FormSelect
                                            name={`items.${index}.freeProductId`}
                                            label=""
                                            options={productOptions.filter(
                                                (opt) => opt.trackingType !== "RETURNABLE"
                                            )}
                                            placeholder="Select free product..."
                                            formatOptionLabel={(opt: any) => (
                                                <div className="flex items-center justify-between w-full pr-1">
                                                    <span className="font-medium truncate mr-2">
                                                        {opt.name}
                                                        <span className="text-[10px] opacity-70 font-normal ml-1">
                                                            (Rs {opt.price})
                                                        </span>
                                                    </span>
                                                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white shadow-sm bg-indigo-500">
                                                        {opt.trackingType}
                                                    </span>
                                                </div>
                                            )}
                                        />
                                        {freeProductDetails && (
                                            <span
                                                className={`text-[10px] font-bold ${
                                                    isFreeOutOfStock ? "text-rose-500" : "text-emerald-600"
                                                }`}
                                            >
                                                Stock Available: {remainingFreeStock}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 w-24">
                                        <label className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider text-center">
                                            Qty Out
                                        </label>
                                        <FormInput
                                            type="number"
                                            name={`items.${index}.offerQty`}
                                            min={0}
                                            max={isSameFreeProduct ? currentStock - paidQty : freeStock}
                                            className={`text-center font-bold ${
                                                isFreeOutOfStock
                                                    ? "bg-rose-100 border-rose-300 text-rose-700"
                                                    : "bg-white border-emerald-200 text-emerald-700"
                                            }`}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Asset Deficit Warning & Deposit Toggle */}
                            {showDepositWarning && (
                                <div
                                    className={`mt-4 p-3 border rounded-xl flex items-start sm:items-center gap-3 transition-all animate-in fade-in ${
                                        isDepositCharged
                                            ? "bg-emerald-50/50 border-emerald-200"
                                            : "bg-amber-50 border-amber-200"
                                    }`}
                                >
                                    {isDepositCharged ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                                    )}
                                    <div className="flex-1">
                                        <p
                                            className={`text-[13px] font-extrabold ${
                                                isDepositCharged ? "text-emerald-800" : "text-amber-800"
                                            }`}
                                        >
                                            Deficit: {deficit} Missing Container(s)
                                        </p>
                                        <p
                                            className={`text-[10px] font-medium leading-tight mt-0.5 ${
                                                isDepositCharged ? "text-emerald-600" : "text-amber-700"
                                            }`}
                                        >
                                            Deposit Required: Rs {calculatedDepositNeeded.toLocaleString()} (@ Rs{" "}
                                            {containerDepositRate}/ea)
                                        </p>
                                    </div>

                                    {isDepositCharged ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="border-emerald-200 text-emerald-600 hover:bg-emerald-100 text-[10px] h-8 shrink-0 shadow-sm cursor-pointer"
                                            onClick={() => {
                                                setValue(`items.${index}.isDepositCharged`, false);
                                                setValue(`items.${index}.chargedDeposit`, 0);
                                            }}
                                        >
                                            Remove Deposit
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] h-8 shrink-0 shadow-sm cursor-pointer"
                                            onClick={() => {
                                                setValue(`items.${index}.isDepositCharged`, true);
                                                setValue(`items.${index}.chargedDeposit`, calculatedDepositNeeded);
                                            }}
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