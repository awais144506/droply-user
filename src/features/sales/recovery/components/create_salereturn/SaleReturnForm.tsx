/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useFieldArray, useWatch } from "react-hook-form";
import {
    User,
    Package,
    RotateCcw,
    Trash2,
    Wallet,
    AlertCircle,
    Phone,
    MapPin,
    CheckCircle2,
    FileText,
    Layers,
    Sparkles,
} from "lucide-react";

import { useAppForm } from "@/lib/hooks/use-app-form";
import { FormSelect } from "@/components/ui/form-select";
import { FormNumberStepper } from "@/components/ui/form-number-stepper";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";

import { useCustomers, useCustomer } from "@/features/manage/customers/api/use-customer";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useRecoveries } from "../../api/use-recovery";
import { useMutateRecovery } from "../../api/use-mutate-recovery";
import {
    saleReturnSchema,
    SaleReturnFormValues,
} from "../../schema/recovery-schema";
import { PaymentMethodType } from "../../types/recovery.types";

type Props = {
    branchId: string;
};

const PAYMENT_OPTIONS = [
    { label: "Cash Refund / Adjustment", value: "CASH" },
    { label: "Bank Transfer", value: "BANK" },
];

const SaleReturnForm = ({ branchId }: Props) => {
    const router = useRouter();
    const { createSaleReturn } = useMutateRecovery();

    // 1. Fetch Branch Customers, Products (for Recipe BOM), & Existing Returns
    const { data: customerData, isLoading: isCustomersLoading } = useCustomers(branchId);
    const { data: productData } = useProducts(branchId);
    const { data: recoveryData } = useRecoveries(branchId);

    // 2. Initialize Form
    const methods = useAppForm(saleReturnSchema, {
        customerId: "",
        orderId: "",
        paymentMethod: "CASH",
        depositRefunded: 0,
        reason: "",
        remarks: "",
        items: [],
    });

    const { control, handleSubmit, setValue, reset } = methods;

    const { fields, remove, replace } = useFieldArray({
        control,
        name: "items",
    });

    // 3. Watch Form State (Wrapped in useMemo to fix React Hook dependency warning)
    const selectedCustomerId = useWatch({ control, name: "customerId" });
    const selectedOrderId = useWatch({ control, name: "orderId" });
    const rawWatchedItems = useWatch({ control, name: "items" });
    const watchedItems = useMemo(() => rawWatchedItems || [], [rawWatchedItems]);
    const watchedDepositRefunded = Number(
        useWatch({ control, name: "depositRefunded" }) || 0
    );

    // 4. Fetch Detailed Customer (which includes customer.orders!)
    const { data: detailedCustomer, isLoading: isCustomerDetailLoading } = useCustomer(
        selectedCustomerId || ""
    );

    const customerCredit = Number(detailedCustomer?.customerCredit || 0);

    // 5. Enrich Customer's Completed Orders directly from detailedCustomer.orders + productData
    const eligibleOrders = useMemo(() => {
        const rawOrders: any[] = (detailedCustomer as any)?.orders || [];
        const allProducts: any[] = productData?.products || [];
        const allSaleReturns: any[] = recoveryData?.saleReturns || [];

        return rawOrders
            .filter((order) => order.status === "COMPLETED")
            .map((order) => {
                // Find any previous sale returns already filed against this order
                const orderReturns = allSaleReturns.filter(
                    (sr) => sr.orderId === order.id
                );

                const enrichedLineItems = (order.lineItems || []).map((li: any) => {
                    const fullProduct = allProducts.find((p) => p.id === li.productId);

                    const alreadyReturned = orderReturns.reduce((sum, sr) => {
                        const match = (sr.items || []).find(
                            (i: any) => i.productId === li.productId
                        );
                        return sum + Number(match?.returnQuantity || 0);
                    }, 0);

                    const availableToReturn = Math.max(
                        0,
                        Number(li.paidQuantity || 0) - alreadyReturned
                    );

                    // Map recipe ingredients with full child product details from allProducts
                    const rawRecipe = fullProduct?.recipeIngredients || [];
                    const enrichedRecipe = rawRecipe.map((ri: any) => {
                        const childProduct = allProducts.find(
                            (p) => p.id === ri.childItemId
                        );
                        return {
                            ...ri,
                            childItem: ri.childItem || {
                                id: ri.childItemId,
                                name: childProduct?.name || "Raw Material",
                                unitOfMeasure: childProduct?.unitOfMeasure || "PIECE",
                                trackingType: childProduct?.trackingType || "OUTRIGHT",
                            },
                        };
                    });

                    return {
                        ...li,
                        alreadyReturned,
                        availableToReturn,
                        product: {
                            id: li.productId,
                            name:
                                li.product?.name ||
                                fullProduct?.name ||
                                "Product",
                            hasRecipe: Boolean(fullProduct?.hasRecipe),
                            trackingType: fullProduct?.trackingType || "OUTRIGHT",
                            unitOfMeasure: fullProduct?.unitOfMeasure || "PIECE",
                            recipeIngredients: enrichedRecipe,
                        },
                    };
                });

                return {
                    ...order,
                    lineItems: enrichedLineItems,
                    hasReturnableItemsLeft: enrichedLineItems.some(
                        (li: any) => li.availableToReturn > 0
                    ),
                };
            })
            .filter((order) => order.hasReturnableItemsLeft);
    }, [detailedCustomer, productData?.products, recoveryData?.saleReturns]);

    const orderOptions = useMemo(() => {
        return eligibleOrders.map((order: any) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
            const totalUnitsLeft = order.lineItems.reduce(
                (sum: number, li: any) => sum + Number(li.availableToReturn || 0),
                0
            );
            return {
                label: `#${order.orderCode} — ${dateStr}`,
                value: order.id,
                orderCode: order.orderCode,
                dateStr,
                totalAmount: order.totalAmount,
                totalUnitsLeft,
                lineItems: order.lineItems,
            };
        });
    }, [eligibleOrders]);

    const selectedOrder = useMemo(() => {
        return eligibleOrders.find((o: any) => o.id === selectedOrderId);
    }, [eligibleOrders, selectedOrderId]);

    // Reset order & items when customer changes
    useEffect(() => {
        setValue("orderId", "");
        replace([]);
        setValue("depositRefunded", 0);
    }, [selectedCustomerId, setValue, replace]);

    // Auto-populate order line items & recipe materials when a COMPLETED order is selected
    useEffect(() => {
        if (!selectedOrder) {
            replace([]);
            return;
        }

        const returnableLines = selectedOrder.lineItems.filter(
            (li: any) => Number(li.availableToReturn) > 0
        );

        const mappedItems = returnableLines.map((li: any) => {
            const defaultReturnQty = 1;
            const hasRecipe = Boolean(li.product?.hasRecipe);
            const recipeIngredients = li.product?.recipeIngredients || [];

            return {
                id: crypto.randomUUID(),
                orderLineItemId: li.id,
                productId: li.productId,
                productName: li.product?.name || "Product",
                soldQuantity: Number(li.paidQuantity || 0),
                availableToReturn: Number(li.availableToReturn || 0),
                unitPrice: Number(li.unitPrice || 0),
                returnQuantity: defaultReturnQty,
                goodToStoreQty: defaultReturnQty,
                wastageQty: 0,
                hasRecipe,
                recipeMaterials: hasRecipe
                    ? recipeIngredients.map((ri: any) => {
                          const expected = Number(ri.quantity || 1) * defaultReturnQty;
                          return {
                              rawMaterialId: ri.childItemId,
                              rawMaterialName: ri.childItem?.name || "Raw Material",
                              unitOfMeasure: ri.childItem?.unitOfMeasure || "PIECE",
                              trackingType: ri.childItem?.trackingType || "OUTRIGHT",
                              expectedQuantity: expected,
                              returnedToStoreQty: expected,
                              wastageQty: 0,
                          };
                      })
                    : [],
            };
        });

        replace(mappedItems as any);
    }, [selectedOrder, replace]);

    // Helper: Sync recipe expected quantities when user changes a parent item's returnQuantity
    const handleSyncRecipeQuantities = (index: number, newReturnQty: number) => {
        const item: any = watchedItems[index];
        if (!item) return;

        setValue(`items.${index}.goodToStoreQty`, newReturnQty, { shouldValidate: true });
        setValue(`items.${index}.wastageQty`, 0, { shouldValidate: true });

        if (item.hasRecipe && selectedOrder) {
            const originalLine = selectedOrder.lineItems.find(
                (li: any) => li.productId === item.productId
            );
            const recipeIngredients = originalLine?.product?.recipeIngredients || [];

            const updatedMaterials = recipeIngredients.map((ri: any) => {
                const expected = Number(ri.quantity || 1) * newReturnQty;
                return {
                    rawMaterialId: ri.childItemId,
                    rawMaterialName: ri.childItem?.name || "Raw Material",
                    unitOfMeasure: ri.childItem?.unitOfMeasure || "PIECE",
                    trackingType: ri.childItem?.trackingType || "OUTRIGHT",
                    expectedQuantity: expected,
                    returnedToStoreQty: expected,
                    wastageQty: 0,
                };
            });

            setValue(`items.${index}.recipeMaterials`, updatedMaterials as any, {
                shouldValidate: true,
            });
        }
    };

    // Live Financial & Validation Calculations
    const totalRefundAmount = useMemo(() => {
        return watchedItems.reduce((sum: number, item: any) => {
            const qty = Number(item?.returnQuantity || 0);
            const price = Number(item?.unitPrice || 0);
            return sum + qty * price;
        }, 0);
    }, [watchedItems]);

    const khataCredited = Math.min(Math.max(0, customerCredit), totalRefundAmount);
    const cashRefunded = Math.max(0, totalRefundAmount - khataCredited);
    const remainingCustomerKhata = Math.max(0, customerCredit - khataCredited);

    const hasValidationErrors = useMemo(() => {
        if (watchedItems.length === 0) return true;

        return watchedItems.some((item: any) => {
            const retQty = Number(item?.returnQuantity || 0);
            const maxAvail = Number(item?.availableToReturn || 0);
            const goodQty = Number(item?.goodToStoreQty || 0);
            const wasteQty = Number(item?.wastageQty || 0);

            if (retQty <= 0 || retQty > maxAvail) return true;
            if (goodQty + wasteQty !== retQty) return true;

            if (item?.hasRecipe && Array.isArray(item.recipeMaterials)) {
                const badRecipeRow = item.recipeMaterials.some((rm: any) => {
                    const exp = Number(rm?.expectedQuantity || 0);
                    const store = Number(rm?.returnedToStoreQty || 0);
                    const waste = Number(rm?.wastageQty || 0);
                    return store + waste !== exp;
                });
                if (badRecipeRow) return true;
            }

            return false;
        });
    }, [watchedItems]);

    const canSubmit =
        Boolean(selectedCustomerId) &&
        Boolean(selectedOrderId) &&
        watchedItems.length > 0 &&
        !hasValidationErrors;

    const onSubmit = async (values: SaleReturnFormValues) => {
        if (!canSubmit) return;

        const payloadItems = (values.items || []).map((item: any) => ({
            orderLineItemId: item.orderLineItemId || undefined,
            productId: item.productId,
            returnQuantity: Number(item.returnQuantity),
            goodToStoreQty: Number(item.goodToStoreQty),
            wastageQty: Number(item.wastageQty),
            hasRecipe: Boolean(item.hasRecipe),
            recipeMaterials:
                item.hasRecipe && Array.isArray(item.recipeMaterials)
                    ? item.recipeMaterials.map((rm: any) => ({
                          rawMaterialId: rm.rawMaterialId,
                          expectedQuantity: Number(rm.expectedQuantity),
                          returnedToStoreQty: Number(rm.returnedToStoreQty),
                          wastageQty: Number(rm.wastageQty),
                      }))
                    : undefined,
        }));

        await createSaleReturn.mutateAsync({
            customerId: values.customerId,
            orderId: values.orderId,
            paymentMethod: values.paymentMethod as PaymentMethodType,
            depositRefunded: Number(values.depositRefunded || 0),
            reason: values.reason || undefined,
            remarks: values.remarks || undefined,
            items: payloadItems,
        });

        reset();
        router.push("/sales/recovery");
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
                {/* LEFT COLUMN: CUSTOMER, COMPLETED ORDER & RETURN ITEMS */}
                <div className="lg:col-span-8 space-y-6">
                    {/* 1. CUSTOMER & COMPLETED ORDER SELECTION */}
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-5 shadow-xs">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-slate-400" />
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                1. Select Customer & Completed Order
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormSelect
                                name="customerId"
                                label="Search Customer"
                                placeholder="Select customer..."
                                isSearchable={true}
                                isClearable={true}
                                isLoading={isCustomersLoading}
                                options={customerData?.customerOptions || []}
                                formatOptionLabel={(opt: any) => (
                                    <div className="flex items-center justify-between w-full py-0.5 pr-1">
                                        <div className="flex flex-col truncate mr-2">
                                            <span className="text-sm font-bold truncate">
                                                {opt.label}
                                            </span>
                                            <span className="text-[11px]">
                                                {opt.phone}
                                            </span>
                                        </div>
                                        {Number(opt.customerCredit) > 0 && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                                                Rs {Number(opt.customerCredit).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                )}
                            />

                            <FormSelect
                                name="orderId"
                                label="Completed Order"
                                placeholder={
                                    !selectedCustomerId
                                        ? "Select a customer first..."
                                        : isCustomerDetailLoading
                                        ? "Loading customer orders..."
                                        : orderOptions.length === 0
                                        ? "No eligible completed orders"
                                        : "Select completed order..."
                                }
                                disabled={!selectedCustomerId || orderOptions.length === 0}
                                isLoading={isCustomerDetailLoading}
                                isSearchable={true}
                                options={orderOptions}
                                formatOptionLabel={(opt: any) => (
                                    <div className="flex items-center justify-between w-full py-0.5 pr-1">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-extrabold ">
                                                #{opt.orderCode}
                                            </span>
                                            <span className="text-[11px] ">
                                                {opt.dateStr} • {opt.totalUnitsLeft} returnable unit(s)
                                            </span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200">
                                            Rs {Number(opt.totalAmount || 0).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            />
                        </div>

                        {/* Customer Ledger Snapshot */}
                        {selectedCustomerId && detailedCustomer && (
                            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-sm font-extrabold text-slate-900">
                                        {detailedCustomer.name}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                                        <span className="flex items-center gap-1">
                                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                                            {detailedCustomer.phone}
                                        </span>
                                        {detailedCustomer.address && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                {detailedCustomer.address}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="px-3.5 py-2 rounded-lg bg-rose-50 border border-rose-200/70 text-right">
                                        <span className="block text-[9px] font-extrabold uppercase tracking-wider text-rose-500">
                                            Current Khata
                                        </span>
                                        <span className="text-base font-black text-rose-700">
                                            Rs {customerCredit.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. ORDER ITEMS & RECIPE RAW MATERIALS BREAKDOWN */}
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-slate-400" />
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                        2. Returned Products & Stock / Wastage Split
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Specify return quantities and route both finished items and recipe raw materials to live stock or wastage.
                                    </p>
                                </div>
                            </div>

                            {selectedOrder && fields.length === 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setValue("orderId", "");
                                        setTimeout(() => setValue("orderId", selectedOrder.id), 10);
                                    }}
                                    className="text-xs font-bold cursor-pointer"
                                >
                                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reload Order Items
                                </Button>
                            )}
                        </div>

                        {!selectedOrderId ? (
                            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                                Select a customer and one of their completed orders above to load returnable items.
                            </div>
                        ) : fields.length === 0 ? (
                            <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-xs font-semibold">
                                All items from this order have been removed from the return list. Click &ldquo;Reload Order Items&rdquo; to restore them.
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {fields.map((field, index) => {
                                    const item: any = watchedItems[index] || field;
                                    const maxAvail = Number(item.availableToReturn || 0);
                                    const retQty = Number(item.returnQuantity || 0);
                                    const goodQty = Number(item.goodToStoreQty || 0);
                                    const wasteQty = Number(item.wastageQty || 0);
                                    const unitPrice = Number(item.unitPrice || 0);
                                    const lineRefund = retQty * unitPrice;

                                    const isQtyExceeded = retQty > maxAvail || retQty <= 0;
                                    const isParentSplitBad = goodQty + wasteQty !== retQty;

                                    const recipeMaterials: any[] = item.recipeMaterials || [];

                                    return (
                                        <div
                                            key={field.id}
                                            className={`p-5 border rounded-2xl transition-all space-y-4 ${
                                                isQtyExceeded || isParentSplitBad
                                                    ? "bg-rose-50/20 border-rose-200"
                                                    : "bg-slate-50/60 border-slate-200/90"
                                            }`}
                                        >
                                            {/* Parent Product Header */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-black">
                                                        #{index + 1}
                                                    </span>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-extrabold text-slate-900">
                                                                {item.productName}
                                                            </h4>
                                                            {item.hasRecipe && (
                                                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                                                                    <Layers className="h-3 w-3" /> Recipe BOM
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                                            Sold: <strong>{item.soldQuantity}</strong> • Eligible to Return:{" "}
                                                            <strong className="text-sky-700">{maxAvail}</strong> • Sold Rate:{" "}
                                                            <strong>Rs {unitPrice.toLocaleString()}</strong>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                            Item Refund
                                                        </span>
                                                        <span className="text-sm font-black text-emerald-700">
                                                            Rs {lineRefund.toLocaleString()}
                                                        </span>
                                                    </div>

                                                    {fields.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                                                            title="Exclude this item from return"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Parent Product Quantity Controls */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                                <div>
                                                    <FormNumberStepper
                                                        name={`items.${index}.returnQuantity`}
                                                        label={`Return Qty (Max ${maxAvail})`}
                                                        min={1}
                                                        max={maxAvail}
                                                    />
                                                </div>

                                                <div>
                                                    <FormNumberStepper
                                                        name={`items.${index}.goodToStoreQty`}
                                                        label="Safe to Store (Stock +)"
                                                        min={0}
                                                        max={retQty}
                                                    />
                                                </div>

                                                <div>
                                                    <FormNumberStepper
                                                        name={`items.${index}.wastageQty`}
                                                        label="Damaged / Spoiled (Waste)"
                                                        min={0}
                                                        max={retQty}
                                                    />
                                                </div>
                                            </div>

                                            {/* Parent Split Validation Status */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                                                {isParentSplitBad ? (
                                                    <span className="text-rose-600 font-bold flex items-center gap-1">
                                                        <AlertCircle className="h-3.5 w-3.5" />
                                                        Safe to Store ({goodQty}) + Wastage ({wasteQty}) must equal Return Qty ({retQty})
                                                    </span>
                                                ) : (
                                                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Finished Product: +{goodQty} to Stock • {wasteQty} to Wastage
                                                    </span>
                                                )}

                                                {item.hasRecipe && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSyncRecipeQuantities(index, retQty)}
                                                        className="text-[11px] font-extrabold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-md border border-purple-200 transition-colors flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Sparkles className="h-3 w-3" /> Auto-Sync Recipe Materials for {retQty} Qty
                                                    </button>
                                                )}
                                            </div>

                                            {/* RECIPE RAW MATERIALS BREAKDOWN TABLE */}
                                            {item.hasRecipe && recipeMaterials.length > 0 && (
                                                <div className="mt-3 p-4 rounded-xl bg-white border border-purple-200/80 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                                                            <Layers className="h-3.5 w-3.5" />
                                                            Recipe Raw Materials Breakdown
                                                        </span>
                                                        <span className="text-[11px] text-slate-500">
                                                            Route reusable shells/caps to stock and damaged items to wastage
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2.5">
                                                        {recipeMaterials.map((rm: any, rmIndex: number) => {
                                                            const expQty = Number(rm.expectedQuantity || 0);
                                                            const rmStore = Number(rm.returnedToStoreQty || 0);
                                                            const rmWaste = Number(rm.wastageQty || 0);
                                                            const isRmSplitBad = rmStore + rmWaste !== expQty;

                                                            return (
                                                                <div
                                                                    key={rm.rawMaterialId || rmIndex}
                                                                    className={`p-3 rounded-xl border grid grid-cols-1 sm:grid-cols-12 gap-3 items-center ${
                                                                        isRmSplitBad
                                                                            ? "bg-rose-50/40 border-rose-200"
                                                                            : "bg-slate-50/70 border-slate-200/70"
                                                                    }`}
                                                                >
                                                                    <div className="sm:col-span-5">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs font-extrabold text-slate-900">
                                                                                {rm.rawMaterialName}
                                                                            </span>
                                                                            {rm.trackingType && (
                                                                                <span
                                                                                    className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-white ${
                                                                                        rm.trackingType === "RETURNABLE"
                                                                                            ? "bg-purple-500"
                                                                                            : "bg-indigo-500"
                                                                                    }`}
                                                                                >
                                                                                    {rm.trackingType}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-[11px] text-slate-500 block mt-0.5">
                                                                            Expected Qty:{" "}
                                                                            <strong className="text-slate-800">
                                                                                {expQty} {rm.unitOfMeasure}
                                                                            </strong>
                                                                        </span>
                                                                        {isRmSplitBad && (
                                                                            <span className="text-[10px] font-bold text-rose-600 block mt-0.5">
                                                                                Store ({rmStore}) + Waste ({rmWaste}) must equal {expQty}
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <div className="sm:col-span-3">
                                                                        <FormNumberStepper
                                                                            name={`items.${index}.recipeMaterials.${rmIndex}.returnedToStoreQty`}
                                                                            label="Safe to Store"
                                                                            min={0}
                                                                            max={expQty}
                                                                        />
                                                                    </div>

                                                                    <div className="sm:col-span-4">
                                                                        <FormNumberStepper
                                                                            name={`items.${index}.recipeMaterials.${rmIndex}.wastageQty`}
                                                                            label="Send to Wastage"
                                                                            min={0}
                                                                            max={expQty}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: REFUND & KHATA ADJUSTMENT SUMMARY */}
                <div className="lg:col-span-4 space-y-6 sticky top-6">
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-5 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Wallet className="h-5 w-5 text-sky-600" />
                            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                                Sale Return Settlement
                            </h3>
                        </div>

                        {/* Automatic Khata vs Cash Split Breakdown */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between text-slate-600">
                                <span>Customer Current Khata</span>
                                <span className="font-bold text-rose-600">
                                    Rs {customerCredit.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-slate-900 font-bold">
                                <span>Total Return Value</span>
                                <span className="text-base font-black text-sky-700">
                                    Rs {totalRefundAmount.toLocaleString()}
                                </span>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 font-medium">
                                        1. Deducted from Khata Ledger:
                                    </span>
                                    <span className="font-extrabold text-emerald-600">
                                        - Rs {khataCredited.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 font-medium">
                                        2. Cash Refund to Customer:
                                    </span>
                                    <span className="font-extrabold text-sky-700">
                                        Rs {cashRefunded.toLocaleString()}
                                    </span>
                                </div>
                                {watchedDepositRefunded > 0 && (
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                                        <span className="text-slate-600 font-medium">
                                            Security Deposit Refunded:
                                        </span>
                                        <span className="font-extrabold text-purple-700">
                                            Rs {watchedDepositRefunded.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                                <span className="text-xs font-extrabold uppercase text-slate-700">
                                    Customer Khata After Return
                                </span>
                                <span className="text-xl font-black text-slate-900">
                                    Rs {remainingCustomerKhata.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Payment & Notes Inputs */}
                        <div className="space-y-4 pt-2 border-t border-slate-100">
                            <FormSelect
                                name="paymentMethod"
                                label="Refund / Settlement Mode"
                                options={PAYMENT_OPTIONS}
                            />

                            <FormInput
                                type="number"
                                name="depositRefunded"
                                label="Security Deposit Refunded (Optional)"
                                min={0}
                            />

                            <FormInput
                                type="text"
                                name="reason"
                                label="Return Reason"
                                placeholder="e.g., Leaking seal, wrong order quantity..."
                            />

                            <FormInput
                                type="text"
                                name="remarks"
                                label="Internal Remarks (Optional)"
                                placeholder="Additional counter notes..."
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/sales/recovery")}
                                className="flex-1 h-11 rounded-xl font-bold cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!canSubmit || createSaleReturn.isPending}
                                className="flex-2 h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold cursor-pointer flex items-center justify-center gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                {createSaleReturn.isPending
                                    ? "Processing..."
                                    : "Complete Sale Return"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};

export default SaleReturnForm;