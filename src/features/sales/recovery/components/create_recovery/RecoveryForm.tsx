/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useFieldArray, useWatch } from "react-hook-form";
import {
    User,
    Package,
    Plus,
    Trash2,
    Wallet,
    ShieldCheck,
    AlertCircle,
    Phone,
    MapPin,
    CheckCircle2,
} from "lucide-react";

import { useAppForm } from "@/lib/hooks/use-app-form";
import { FormSelect } from "@/components/ui/form-select";
import { FormNumberStepper } from "@/components/ui/form-number-stepper";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";

import { useCustomers, useCustomer } from "@/features/manage/customers/api/use-customer";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useMutateRecovery } from "../../api/use-mutate-recovery";
import {
    customerRecoverySchema,
    CustomerRecoveryFormValues,
} from "../../schema/recovery-schema";
import { PaymentMethodType } from "../../types/recovery.types";

type Props = {
    branchId: string;
};

const PAYMENT_OPTIONS = [
    { label: "Cash", value: "CASH" },
    { label: "Bank Transfer", value: "BANK" },
];

const RecoveryForm = ({ branchId }: Props) => {
    const router = useRouter();
    const { createRecovery } = useMutateRecovery();

    // 1. Fetch Customers & Branch Products
    const { data: customerData, isLoading: isCustomersLoading } = useCustomers(branchId);
    const { data: productData } = useProducts(branchId);

    // 2. Initialize Form
    const methods = useAppForm(customerRecoverySchema, {
        customerId: "",
        paymentMethod: "CASH",
        amountReceived: 0,
        remarks: "",
        items: [],
    });

    const { control, handleSubmit, setValue, reset } = methods;

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "items",
    });

    // 3. Watch Form State
    const selectedCustomerId = useWatch({ control, name: "customerId" });
    const watchedItems = useWatch({ control, name: "items" }) || [];
    const watchedAmountReceived = Number(useWatch({ control, name: "amountReceived" }) || 0);

    // 4. Fetch Full Single Customer Details (Includes returnables array & credit ledger)
    const { data: detailedCustomer, isLoading: isCustomerDetailLoading } = useCustomer(
        selectedCustomerId || ""
    );

    const customerCredit = Number(detailedCustomer?.customerCredit || 0);
    const customerReturnables: {
        id: string;
        productId: string;
        productName?: string;
        currentBalance: number;
    }[] = useMemo(() => {
        return (detailedCustomer?.returnables || [])
            .filter((r: any) => Number(r.currentBalance) > 0)
            .map((r: any) => ({
                id: r.id || crypto.randomUUID(), // 🔥 Guarantees id is a string
                productId: r.productId,
                productName: r.productName,
                currentBalance: Number(r.currentBalance),
            }));
    }, [detailedCustomer?.returnables]);

    const totalAssetsHeld = useMemo(() => {
        return customerReturnables.reduce(
            (sum, r) => sum + Number(r.currentBalance || 0),
            0
        );
    }, [customerReturnables]);

    // Build dropdown options ONLY from the returnable containers this customer actually holds
    const returnableProductOptions = useMemo(() => {
        const allProducts = productData?.products || [];
        return customerReturnables.map((ret) => {
            const matchedProduct = allProducts.find((p: any) => p.id === ret.productId);
            const name = ret.productName || matchedProduct?.name || "Returnable Asset";
            return {
                label: `${name} (Held: ${ret.currentBalance})`,
                value: ret.productId,
                name,
                maxHeld: Number(ret.currentBalance || 0),
                securityDeposit: Number(matchedProduct?.securityDeposit || 0),
            };
        });
    }, [customerReturnables, productData?.products]);

    // When customer changes, auto-populate their held returnables or clear rows
    useEffect(() => {
        if (!selectedCustomerId) {
            replace([]);
            setValue("amountReceived", 0);
            return;
        }
        // Reset items when switching customers so previous customer's products don't linger
        replace([]);
        setValue("amountReceived", 0);
    }, [selectedCustomerId, replace, setValue]);

    // Add a returnable item row
    const handleAddItem = () => {
        // Pick first unselected returnable asset if available
        const usedIds = new Set(watchedItems.map((i: any) => i.productId));
        const availableOption = returnableProductOptions.find(
            (opt) => !usedIds.has(opt.value)
        );

        append({
            id: crypto.randomUUID(),
            productId: availableOption?.value || "",
            productName: availableOption?.name || "",
            maxHeld: availableOption?.maxHeld || 0,
            quantityReturned: 1,
            goodToStoreQty: 1,
            wastageQty: 0,
            depositRefunded: 0,
        });
    };

    // Live Summary Calculations
    const remainingLedger = Math.max(0, customerCredit - watchedAmountReceived);
    const isLedgerExceeded = watchedAmountReceived > customerCredit;

    const totalReturningContainers = watchedItems.reduce(
        (sum: number, item: any) => sum + Number(item?.quantityReturned || 0),
        0
    );
    const totalGoodToStore = watchedItems.reduce(
        (sum: number, item: any) => sum + Number(item?.goodToStoreQty || 0),
        0
    );
    const totalWastage = watchedItems.reduce(
        (sum: number, item: any) => sum + Number(item?.wastageQty || 0),
        0
    );

    const hasInvalidItemRow = watchedItems.some((item: any) => {
        if (!item?.productId) return true;
        const heldRecord = customerReturnables.find((r) => r.productId === item.productId);
        const maxHeld = Number(heldRecord?.currentBalance || 0);
        const qtyReturned = Number(item.quantityReturned || 0);
        const splitSum = Number(item.goodToStoreQty || 0) + Number(item.wastageQty || 0);
        return qtyReturned <= 0 || qtyReturned > maxHeld || splitSum !== qtyReturned;
    });

    const canSubmit =
        Boolean(selectedCustomerId) &&
        !isLedgerExceeded &&
        !hasInvalidItemRow &&
        (watchedAmountReceived > 0 || watchedItems.length > 0);

    const onSubmit = async (values: CustomerRecoveryFormValues) => {
        if (isLedgerExceeded) return;

        const cleanItems = (values.items || [])
            .filter((item) => Boolean(item?.productId) && Number(item?.quantityReturned) > 0)
            .map((item) => ({
                productId: item.productId,
                quantityReturned: Number(item.quantityReturned),
                goodToStoreQty: Number(item.goodToStoreQty),
                wastageQty: Number(item.wastageQty),
                depositRefunded: Number(item.depositRefunded || 0),
            }));

        await createRecovery.mutateAsync({
            customerId: values.customerId,
            paymentMethod: values.paymentMethod as PaymentMethodType,
            amountReceived: Number(values.amountReceived || 0),
            remarks: values.remarks || undefined,
            items: cleanItems.length > 0 ? cleanItems : undefined,
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
                {/* LEFT COLUMN: CUSTOMER & RETURNABLE ITEMS */}
                <div className="lg:col-span-8 space-y-6">
                    {/* 1. CUSTOMER SELECTION & KHATA CARD */}
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-5 shadow-xs">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-slate-400" />
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                Customer & Khata
                            </h3>
                        </div>

                        <FormSelect
                            name="customerId"
                            label="Search Customers"
                            placeholder="Select customer by name or phone..."
                            isSearchable={true}
                            isClearable={true}
                            isLoading={isCustomersLoading}
                            options={customerData?.customerOptions || []}
                            formatOptionLabel={(opt: any) => (
                                <div className="flex items-center justify-between w-full py-0.5 pr-1">
                                    <div className="flex flex-col truncate mr-3">
                                        <span className="text-sm font-bold text-slate-900 truncate">
                                            {opt.label}
                                        </span>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                            <span>{opt.phone}</span>
                                            {opt.address && (
                                                <span className="truncate">• {opt.address}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {Number(opt.customerCredit) > 0 && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                                                Rs {Number(opt.customerCredit).toLocaleString()}
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-slate-100 text-slate-700">
                                            {opt.category}
                                        </span>
                                    </div>
                                </div>
                            )}
                        />

                        {/* Customer Snapshot Details */}
                        {selectedCustomerId && detailedCustomer && (
                            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-4">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                        <h4 className="text-base font-extrabold text-slate-900">
                                            {detailedCustomer.name}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
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
                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-slate-200/70 text-slate-700">
                                        {detailedCustomer.category}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Payable Ledger Box */}
                                    <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/70 flex flex-col justify-between">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                                            Payable Ledger (Khata)
                                        </span>
                                        <span className="text-2xl font-black text-rose-700 mt-1">
                                            Rs {customerCredit.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Total Assets Held Box */}
                                    <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/70 flex flex-col justify-between">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600">
                                                Total Assets Held
                                            </span>
                                            <span className="text-sm font-black text-sky-700">
                                                {totalAssetsHeld} items
                                            </span>
                                        </div>

                                        {customerReturnables.length > 0 ? (
                                            <div className="mt-2 pt-2 border-t border-sky-200/60 space-y-1">
                                                {customerReturnables.map((ret) => (
                                                    <div
                                                        key={ret.id}
                                                        className="flex items-center justify-between text-xs font-bold text-slate-700"
                                                    >
                                                        <span className="truncate">
                                                            {ret.productName || "Returnable Container"}
                                                        </span>
                                                        <span className="text-sky-700 font-extrabold">
                                                            {ret.currentBalance}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 mt-2">
                                                No returnable containers held by customer
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. RETURNABLE CONTAINERS RECOVERY SECTION */}
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-slate-400" />
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                        Recover Returnable Containers
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Deduct returned empties from customer account and split between live stock or wastage.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {!selectedCustomerId ? (
                            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                                Select a customer above to view and recover their held containers.
                            </div>
                        ) : customerReturnables.length === 0 && !isCustomerDetailLoading ? (
                            <div className="p-6 text-center bg-slate-50 border border-slate-200/70 rounded-xl text-slate-500 text-xs font-semibold">
                                This customer currently holds 0 returnable containers. You can still record a Khata cash recovery on the right.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {fields.map((field, index) => {
                                    const currentItem: any = watchedItems[index] || field;
                                    const selectedOption = returnableProductOptions.find(
                                        (opt) => opt.value === currentItem.productId
                                    );
                                    const maxHeld = selectedOption?.maxHeld || 0;
                                    const qtyReturned = Number(currentItem.quantityReturned || 0);
                                    const goodQty = Number(currentItem.goodToStoreQty || 0);
                                    const wasteQty = Number(currentItem.wastageQty || 0);

                                    const isQtyExceeded = qtyReturned > maxHeld;
                                    const isSplitMismatch = goodQty + wasteQty !== qtyReturned;
                                    const remainingCustomerAsset = Math.max(0, maxHeld - qtyReturned);

                                    return (
                                        <div
                                            key={field.id}
                                            className={`p-4 border rounded-xl transition-colors space-y-3 ${isQtyExceeded || isSplitMismatch
                                                    ? "bg-rose-50/30 border-rose-200"
                                                    : "bg-slate-50/50 border-slate-200/80"
                                                }`}
                                        >
                                            <div className="grid grid-cols-12 gap-3 items-start">
                                                {/* Returnable Product Select */}
                                                <div className="col-span-12 sm:col-span-5">
                                                    <FormSelect
                                                        name={`items.${index}.productId`}
                                                        label="Returnable Asset"
                                                        options={returnableProductOptions}
                                                        excludeFromList={watchedItems}
                                                        excludeKey="productId"
                                                        currentIndex={index}
                                                        placeholder="Select held container..."
                                                    />
                                                </div>

                                                {/* Total Returned By Customer */}
                                                <div className="col-span-4 sm:col-span-2">
                                                    <FormNumberStepper
                                                        name={`items.${index}.quantityReturned`}
                                                        label="Total Returned"
                                                        min={1}
                                                        max={maxHeld || 1}
                                                    />
                                                </div>

                                                {/* Good To Store (Increments Stock) */}
                                                <div className="col-span-4 sm:col-span-2">
                                                    <FormNumberStepper
                                                        name={`items.${index}.goodToStoreQty`}
                                                        label="Good (To Stock)"
                                                        min={0}
                                                        max={qtyReturned}
                                                    />
                                                </div>

                                                {/* Wastage Qty (Creates Wastage Record) */}
                                                <div className="col-span-3 sm:col-span-2">
                                                    <FormNumberStepper
                                                        name={`items.${index}.wastageQty`}
                                                        label="Damaged (Waste)"
                                                        min={0}
                                                        max={qtyReturned}
                                                    />
                                                </div>

                                                {/* Remove Item Button */}
                                                <div className="col-span-1 flex justify-end mt-6">
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Live Balance & Validation Bar */}
                                            {currentItem.productId && (
                                                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-semibold text-slate-600">
                                                            Currently Held:{" "}
                                                            <strong className="text-slate-900">{maxHeld}</strong>
                                                        </span>
                                                        <span className="font-semibold text-emerald-600">
                                                            Remaining After Recovery:{" "}
                                                            <strong>{remainingCustomerAsset}</strong>
                                                        </span>
                                                    </div>

                                                    {isQtyExceeded ? (
                                                        <span className="text-rose-600 font-bold flex items-center gap-1">
                                                            <AlertCircle className="h-3.5 w-3.5" />
                                                            Cannot exceed {maxHeld} held items!
                                                        </span>
                                                    ) : isSplitMismatch ? (
                                                        <span className="text-rose-600 font-bold flex items-center gap-1">
                                                            <AlertCircle className="h-3.5 w-3.5" />
                                                            Good ({goodQty}) + Damaged ({wasteQty}) must equal{" "}
                                                            {qtyReturned}
                                                        </span>
                                                    ) : (
                                                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            +{goodQty} to Stock • {wasteQty} to Wastage
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {fields.length < returnableProductOptions.length && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleAddItem}
                                        className="w-full h-11 border-dashed border-slate-300 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer rounded-xl"
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add Returnable Container
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: KHATA RECOVERY & CHECKOUT SUMMARY */}
                <div className="lg:col-span-4 space-y-6 sticky top-6">
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-5 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Wallet className="h-5 w-5 text-emerald-600" />
                            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                                Recovery Summary
                            </h3>
                        </div>

                        {/* Ledger Math Breakdown */}
                        <div className="space-y-2.5 text-sm">
                            <div className="flex items-center justify-between text-slate-600">
                                <span>Current Khata Balance</span>
                                <span className="font-bold text-rose-600">
                                    Rs {customerCredit.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-slate-600">
                                <span>Amount Recovering Now</span>
                                <span className="font-bold text-emerald-600">
                                    - Rs {watchedAmountReceived.toLocaleString()}
                                </span>
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                                <span className="text-xs font-extrabold uppercase text-slate-700">
                                    Remaining Ledger
                                </span>
                                <span className="text-xl font-black text-slate-900">
                                    Rs {remainingLedger.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Container Recovery Summary Pill */}
                        {watchedItems.length > 0 && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                                <div className="flex justify-between font-bold text-slate-700">
                                    <span>Containers Recovering:</span>
                                    <span>{totalReturningContainers} units</span>
                                </div>
                                <div className="flex justify-between text-emerald-600 font-medium">
                                    <span>Adding to Live Stock:</span>
                                    <span>+{totalGoodToStore} units</span>
                                </div>
                                {totalWastage > 0 && (
                                    <div className="flex justify-between text-amber-600 font-medium">
                                        <span>Logging to Wastage:</span>
                                        <span>{totalWastage} units</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payment Method & Amount Input */}
                        <div className="space-y-4 pt-2 border-t border-slate-100">
                            <FormSelect
                                name="paymentMethod"
                                label="Payment Method"
                                options={PAYMENT_OPTIONS}
                            />

                            <div>
                                <FormInput
                                    type="number"
                                    name="amountReceived"
                                    label="Amount Received Now (Rs)"
                                    min={0}
                                    max={customerCredit}
                                    disabled={!selectedCustomerId || customerCredit <= 0}
                                />
                                {isLedgerExceeded && (
                                    <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        Cannot recover more than customer Khata (Rs{" "}
                                        {customerCredit.toLocaleString()})
                                    </p>
                                )}
                            </div>

                            <FormInput
                                type="text"
                                name="remarks"
                                label="Remarks / Notes (Optional)"
                                placeholder="e.g., Cash & 2 empty bottles collected at gate..."
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
                                disabled={!canSubmit || createRecovery.isPending}
                                className="flex-2 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                {createRecovery.isPending
                                    ? "Saving..."
                                    : "Complete Recovery"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};

export default RecoveryForm;