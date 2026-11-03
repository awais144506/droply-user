/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useMemo } from "react";
import {
    Package,
    Plus,
    Trash2,
    Gift,
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Tag,
    Sparkles,
} from "lucide-react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";
import { FormInput } from "@/components/ui/form-input";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useCustomers, useCustomer } from "@/features/manage/customers/api/use-customer";
import { OrderFormValues } from "../../schema/create-order-schema";
import { FormNumberStepper } from "@/components/ui/form-number-stepper";

type Props = {
    branchId: string;
};

const SelectProduct = ({ branchId }: Props) => {
    const { control, setValue } = useFormContext<OrderFormValues>();

    // 1. Fetch Products & Customers
    const { data, isLoading } = useProducts(branchId);
    const { data: customerData } = useCustomers(branchId);

    const allProducts = useMemo(() => {
        return data?.products?.filter((p: any) => p.isActive === true) || [];
    }, [data?.products]);

    // Watch Customer & Line Items
    const selectedCustomerId = useWatch({ control, name: "customerId" });
    const watchedItems = useWatch({ control, name: "items" });

    // 🔥 Fetch detailed customer data to get their live returnable balances
    const { data: detailedCustomer } = useCustomer(selectedCustomerId || "");

    // Grab the selected customer's saved product prices from customerOptions
    const selectedCustomerOption = customerData?.customerOptions?.find(
        (c: any) => c.value === selectedCustomerId
    );
    const customerPrices: { productId: string; priceTierId: string | null }[] = useMemo(() => {
        return selectedCustomerOption?.customerPrices || [];
    }, [selectedCustomerOption?.customerPrices]);

    const productOptions = allProducts.map((p: any) => {
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

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    // Track last evaluated (customerId + productId) per row so we only auto-fill when product or customer changes
    const prevSelectionRef = useRef<Record<number, string>>({});

    useEffect(() => {
        if (!watchedItems) return;

        watchedItems.forEach((item: any, index: number) => {
            if (!item?.productId) return;

            const selectionKey = `${selectedCustomerId || "walkin"}_${item.productId}`;
            if (prevSelectionRef.current[index] === selectionKey) return;
            prevSelectionRef.current[index] = selectionKey;

            const product: any = allProducts.find((p: any) => p.id === item.productId);
            if (!product) return;

            const priceTiers: any[] = product.priceTiers || [];

            // Check if this customer has a saved priceTierId for this product
            const savedPriceRecord = customerPrices.find(
                (cp) => cp.productId === item.productId
            );

            if (savedPriceRecord?.priceTierId) {
                const matchedTier = priceTiers.find(
                    (t: any) => t.id === savedPriceRecord.priceTierId
                );
                if (matchedTier) {
                    setValue(`items.${index}.priceTierId` as any, matchedTier.id, { shouldDirty: true, shouldValidate: true });
                    setValue(`items.${index}.unitPrice`, Number(matchedTier.salePrice), { shouldDirty: true, shouldValidate: true });
                    return;
                }
            }

            // First time selling this product to this customer:
            if (priceTiers.length === 1) {
                setValue(`items.${index}.priceTierId` as any, priceTiers[0].id, { shouldDirty: true, shouldValidate: true });
                setValue(`items.${index}.unitPrice`, Number(priceTiers[0].salePrice), { shouldDirty: true, shouldValidate: true });
            } else if (priceTiers.length > 1) {
                setValue(`items.${index}.priceTierId` as any, "", { shouldDirty: true, shouldValidate: true });
                setValue(`items.${index}.unitPrice`, Number(product.salePrice || priceTiers[0]?.salePrice || 0), { shouldDirty: true });
            } else {
                setValue(`items.${index}.priceTierId` as any, null, { shouldDirty: true });
                setValue(`items.${index}.unitPrice`, Number(product.salePrice || 0), { shouldDirty: true });
            }
        });
    }, [watchedItems, selectedCustomerId, customerPrices, allProducts, setValue]);

    const handleAdd = () => {
        append({
            id: crypto.randomUUID(),
            productId: "",
            priceTierId: "",
            paidQty: 1,
            emptiesIn: 0,
            hasOffer: false,
            offerQty: 0,
            freeProductId: "",
            discountPrice: 0,
            chargedDeposit: 0,
            isDepositCharged: false,
            returnedToStoreQty: 0,
            wastageQuantity: 0,
            unitPrice: 0,
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

                    // Customer-Specific Pricing Logic
                    const productTiers: any[] = selectedProductDetails?.priceTiers || [];
                    const savedCustomerPrice = customerPrices.find(
                        (cp) => cp.productId === currentItemState.productId
                    );
                    const isFirstTimeProduct =
                        Boolean(selectedCustomerId) &&
                        Boolean(currentItemState.productId) &&
                        !savedCustomerPrice?.priceTierId;

                    // Logic for the Paid Item
                    const isReturnable = selectedProductDetails?.trackingType === "RETURNABLE";
                    const currentStock = selectedProductDetails?.currentStock || 0;
                    const depositRate = selectedProductDetails?.securityDeposit || 0;
                    const paidQty = Number(currentItemState.paidQty) || 0;
                    const emptiesIn = Number(currentItemState.emptiesIn) || 0;

                    // 🔥 Find how many empties this specific customer actually holds of this product
                    const customerReturnableLedger = detailedCustomer?.returnables?.find(
                        (r: any) => r.productId === currentItemState.productId
                    );
                    const maxCustomerEmpties = (customerReturnableLedger?.currentBalance || 0) + paidQty;

                    // Logic for Free Item
                    const isSameFreeProduct =
                        !currentItemState.freeProductId ||
                        currentItemState.freeProductId === currentItemState.productId;
                    const freeProductDetails: any = isSameFreeProduct
                        ? selectedProductDetails
                        : allProducts.find((p: any) => p.id === currentItemState.freeProductId);
                    const freeStock = freeProductDetails?.currentStock || 0;
                    const offerQty = Number(currentItemState.offerQty) || 0;

                    // Calculate remaining stock
                    let remainingPaidStock = currentStock - paidQty;
                    let remainingFreeStock = freeStock - offerQty;

                    if (isSameFreeProduct) {
                        const totalRequested = paidQty + offerQty;
                        remainingPaidStock = currentStock - totalRequested;
                        remainingFreeStock = remainingPaidStock;
                    }

                    const isOutOfStock = remainingPaidStock < 0;
                    const isFreeOutOfStock = remainingFreeStock < 0;

                    // Deposit calculation
                    const deficit = Math.max(0, paidQty - emptiesIn);
                    const showDepositWarning = isReturnable && deficit > 0;
                    const isDepositCharged = currentItemState.isDepositCharged === true;
                    const calculatedDepositNeeded = deficit * depositRate;
                    const scale = selectedProductDetails?.unitOfMeasure;

                    return (
                        <div
                            key={field.id}
                            className={`p-3 border rounded-xl transition-colors ${isOutOfStock
                                ? "bg-rose-50/30 border-rose-200"
                                : "bg-white border-slate-100"
                                }`}
                        >
                            <div className="grid grid-cols-12 gap-3 items-start">
                                {/* Product Selection */}
                                <div className="col-span-5 relative -mt-0.5">
                                    <FormSelect

                                        name={`items.${index}.productId`}
                                        label="Product"
                                        isSearchable={true}
                                        isLoading={isLoading}
                                        options={productOptions}
                                        isClearable={true}
                              formatOptionLabel={(opt: any) => (
                                            <div className="flex items-center justify-between w-full pr-1 py-0.5">
                                                
                                                {/* Left Side: Stacked Name, Price, and Category */}
                                                <div className="flex flex-col truncate mr-2">
                                                    <span className="text-sm font-bold truncate">
                                                        {opt.name}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-[10px] font-bold ">
                                                            Rs {opt.price}
                                                        </span>
                                                        <span className="text-[10px] font-medium uppercase tracking-wider">
                                                            • {opt.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Right Side: Tracking Type Badge */}
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
                                            className={`absolute -bottom-5 left-1 text-[11px] font-bold flex items-center gap-1 ${isOutOfStock
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
                                <div className="col-span-2">
                                    <FormNumberStepper
                                        label="Paid Qty"
                                        name={`items.${index}.paidQty`}
                                        min={1}
                                        max={isSameFreeProduct ? currentStock - offerQty : currentStock}
                                    />
                                </div>

                                {/* Empties In */}
                                <div className="col-span-2">
                                    {isReturnable && (
                                        <div className="relative">
                                            <FormNumberStepper
                                                label="Empties In"
                                                name={`items.${index}.emptiesIn`}
                                                min={0}
                                                max={maxCustomerEmpties}
                                            />
                                            {selectedCustomerId && (
                                                <span className="absolute -bottom-4 left-0 w-full text-center text-[9px] font-bold text-slate-400">
                                                    Max: {maxCustomerEmpties}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* FOC Toggle */}
                                <div className="col-span-2 flex flex-col items-center justify-center gap-1 mt-0.5">
                                    <span className="text-xs font-bold uppercase tracking-wide mb-2">
                                        FOC
                                    </span>
                                    <Switch
                                        checked={currentItemState.hasOffer}
                                        onCheckedChange={(val) => {
                                            setValue(`items.${index}.hasOffer`, val);
                                            if (val && !currentItemState.freeProductId) {
                                                // Default to the same product, unless it's returnable (handled by the nested block)
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
                                <div className="col-span-1 flex justify-end mt-1">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-2 text-rose-500 bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            {selectedProductDetails && productTiers.length > 0 && (
                                <div
                                    className={`mt-7 p-3 rounded-xl border transition-all ${isFirstTimeProduct && !currentItemState.priceTierId
                                        ? "bg-amber-50/70 border-amber-200"
                                        : "bg-slate-50/80 border-slate-200/80"
                                        }`}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <Tag
                                                className={`h-3.5 w-3.5 ${isFirstTimeProduct && !currentItemState.priceTierId
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
                                                <Sparkles className="h-3 w-3 text-sky-600" />
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
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                                                        ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                                                        : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40"
                                                        }`}
                                                >
                                                    <span>{tier.name || tier.tierName || tier.title || "Tier"}</span>
                                                    <span
                                                        className={`text-[11px] font-extrabold ${isSelected ? "text-sky-100" : "text-sky-600"
                                                            }`}
                                                    >
                                                        Rs {Number(tier.salePrice).toLocaleString()}
                                                    </span>
                                                    {isSavedDefault && (
                                                        <span
                                                            className={`text-[9px] px-1 py-0.2 rounded uppercase ${isSelected
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
                                            // 🔥 Exclude returnable assets from the free item dropdown
                                            options={productOptions.filter(opt => opt.trackingType !== "RETURNABLE")}
                                            placeholder="Select free product..."
                                            formatOptionLabel={(opt: any) => (
                                                <div className="flex items-center justify-between w-full pr-1">
                                                    <span className="font-medium truncate mr-2">
                                                        {opt.name}
                                                        <span className="text-[10px] opacity-70 font-normal ml-1">
                                                            (Rs {opt.price})
                                                        </span>
                                                    </span>
                                                    <span
                                                        className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white shadow-sm bg-indigo-500`}
                                                    >
                                                        {opt.trackingType}
                                                    </span>
                                                </div>
                                            )}
                                        />
                                        {freeProductDetails && (
                                            <span
                                                className={`text-[10px] font-bold ${isFreeOutOfStock ? "text-rose-500" : "text-emerald-600"
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
                                            className={`text-center font-bold ${isFreeOutOfStock
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
                                    className={`mt-4 p-3 border rounded-xl flex items-start sm:items-center gap-3 transition-all animate-in fade-in ${isDepositCharged
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
                                            className={`text-[13px] font-extrabold ${isDepositCharged ? "text-emerald-800" : "text-amber-800"
                                                }`}
                                        >
                                            Deficit: {deficit} Missing Container(s)
                                        </p>
                                        <p
                                            className={`text-[10px] font-medium leading-tight mt-0.5 ${isDepositCharged ? "text-emerald-600" : "text-amber-700"
                                                }`}
                                        >
                                            Deposit Required: Rs {calculatedDepositNeeded.toLocaleString()} (@ Rs{" "}
                                            {depositRate}/ea)
                                        </p>
                                    </div>

                                    {isDepositCharged ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="border-emerald-200 text-emerald-600 hover:bg-emerald-100 text-[10px] h-8 shrink-0 shadow-sm cursor-pointer"
                                            onClick={() =>
                                                setValue(`items.${index}.isDepositCharged`, false)
                                            }
                                        >
                                            Remove Deposit
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] h-8 shrink-0 shadow-sm cursor-pointer"
                                            onClick={() =>
                                                setValue(`items.${index}.isDepositCharged`, true)
                                            }
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