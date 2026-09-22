/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { useRole } from "@/lib/hooks/use-role";
import { createPaymentSchema, CreatePaymentFormValues } from "../../schema/payment-schema";
import { useCreatePayment, useUpdatePayment } from "../../api/use-mutate-payments";
import { SupplierPayment } from "../../types/payments";
import { useSuppliers } from "@/features/supply/suppliers/api/use-suppliers";
import { usePurchaseOrders } from "@/features/supply/order/api/use-po";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";

interface PaymentFormProps {
    initialData?: SupplierPayment;
}

const PAYMENT_METHOD_OPTIONS = [
    { label: "Cash Voucher", value: "CASH" },
    { label: "Bank Transfer", value: "BANK_TRANSFER" },
    { label: "Cheque", value: "CHEQUE" },
];

export default function PaymentForm({ initialData }: PaymentFormProps) {
    const router = useRouter();
    const { branchId } = useRole();

    const isEditing = !!initialData;
    const { mutate: createPayment, isPending: isCreating } = useCreatePayment(branchId);
    const { mutate: updatePayment, isPending: isUpdating } = useUpdatePayment();


    // 1. Fetch Related Data for Dropdowns
    const { data: supplierData, isLoading: isLoadingSuppliers } = useSuppliers(branchId);

    // We fetch POs to populate the PO dropdown. 
    // In a real scenario, you might filter this by the selected supplier ID.
    const { data: poData, isLoading: isLoadingPOs } = usePurchaseOrders(branchId);

    // 2. Setup Form
    const methods = useForm<CreatePaymentFormValues>({
        resolver: yupResolver(createPaymentSchema),
        defaultValues: {
            branchId: branchId || "",
            supplierId: initialData?.supplierId || "",
            poId: initialData?.poId || "",
            amountPaid: initialData?.amountPaid || 0,
            paymentMethod: initialData?.paymentMethod || "CASH",
            paymentDate: initialData ? new Date(initialData.paymentDate) : new Date(),
            referenceNote: initialData?.referenceNote || "",
        },
    });

    const { handleSubmit, watch, setValue } = methods;
    const selectedSupplierId = watch("supplierId");

    const poOptions = useMemo(() => {
        if (!poData?.orders) return [];

        return poData.orders
            // Only show POs for the selected supplier that have a remaining balance (unless editing an existing payment)
            .filter(po => po.supplierId === selectedSupplierId && (po.balanceDue > 0 || po.id === initialData?.poId))
            .map(po => ({
                label: `${po.poNumber} (Remaining: Rs ${po.balanceDue.toLocaleString()})`,
                value: po.id,
            }));
    }, [poData?.orders, selectedSupplierId, initialData?.poId]);

    // Auto-reset PO selection if the user changes the Supplier
    useEffect(() => {
        if (!isEditing) {
            setValue("poId", "");
        }
    }, [selectedSupplierId, setValue, isEditing]);

    const onSubmit = (values: CreatePaymentFormValues) => {
        const payload = {
            ...values,
            paymentMethod: values.paymentMethod as "CASH" | "BANK_TRANSFER" | "CHEQUE",
            paymentDate: values.paymentDate.toISOString(),
        };

        if (isEditing && initialData) {
            updatePayment(
                { id: initialData.id, payload },
                {
                    onSuccess: () => {
                        router.push("/supply/payments");
                    }
                }
            );
        } else {
            createPayment(payload, {
                onSuccess: () => {
                    router.push("/supply/payments");
                }
            });
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-3xl">
            <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">
                    {isEditing ? "Edit Payment Voucher" : "Record Supplier Payment"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    {isEditing ? "Update financial ledger details." : "Record a bank transfer, cash voucher, or cheque against a specific Purchase Order."}
                </p>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormSelect
                            name="supplierId"
                            label="Supplier Firm"
                            options={supplierData?.supplierOptions || []}
                            placeholder={isLoadingSuppliers ? "Loading..." : "Select Supplier"}
                            disabled={isEditing || isLoadingSuppliers} // Usually can't change supplier on an existing ledger entry
                        />

                        <FormSelect
                            name="poId"
                            label="Purchase Order Ref"
                            options={poOptions}
                            placeholder={!selectedSupplierId ? "Select a supplier first" : isLoadingPOs ? "Loading POs..." : "Select PO"}
                            disabled={isEditing || !selectedSupplierId || isLoadingPOs}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            name="amountPaid"
                            label="Payment Amount (Rs)"
                            type="number"
                            placeholder="e.g. 50000"
                        />

                        <FormSelect
                            name="paymentMethod"
                            label="Payment Method"
                            options={PAYMENT_METHOD_OPTIONS}
                            placeholder="Select Method"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Assuming FormInput can handle type="date" and parse to/from Date object based on Yup */}
                        <FormInput
                            required
                            name="paymentDate"
                            label="Payment Date"
                            type="date"
                        />

                        <FormInput
                            name="referenceNote"
                            label="Reference / Cheque Number"
                            type="text"
                            placeholder="e.g. Meezan Bank (Plant Main A/C)"
                        />
                    </div>

                    <FormCTAFooter
                        isPending={isCreating}
                        isDirty={methods.formState.isDirty}
                        isValid={methods.formState.isValid}
                        isEditMode={isEditing}
                        href="/supply/payments"
                    />
                </form>
            </FormProvider>
        </div>
    );
}