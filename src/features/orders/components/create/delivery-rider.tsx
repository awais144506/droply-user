/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { Truck, Phone } from "lucide-react"; // Added Phone icon
import { useFormContext, useWatch } from "react-hook-form";
import { FormSelect } from "@/components/ui/form-select";
import { FormInput } from "@/components/ui/form-input";
import { useStaffList } from "@/features/staff/api/use-staff";
import { OrderFormValues } from "../../schema/create-order-schema";

type Props = {
    branchId: string;
};

const DeliveryRider = ({ branchId }: Props) => {
    const { control, setValue } = useFormContext<OrderFormValues>();

    // Watch the saleType from react-hook-form state
    const saleType = useWatch({
        control,
        name: "saleType",
    });

    // Fetch live rider options using your hook
    const { data, isLoading } = useStaffList(branchId);

    // Auto-parse the label "Name (Phone)" into separate fields for beautiful rendering
    const rawRiderOptions = data?.riderOptions || [];
    const riderOptions = rawRiderOptions.map((r: any) => {
        const extractedName = r.name || r.label.split(' (')[0];
        const extractedPhone = r.phone || r.label.match(/\(([^)]+)\)/)?.[1] || '';
        return {
            ...r,
            name: extractedName,
            phone: extractedPhone
        };
    });

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setValue("scheduledDate", today);
    }, [setValue]);

    if (saleType !== "DELIVERY") return null;

    return (
        <section className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl transition-all animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">
                    Dispatch Details
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                {/* Rider Selection hooked into react-hook-form */}
                <div className="-mt-0.5">
                    <FormSelect
                        name="riderId"
                        label="Assign Rider"
                        isSearchable={true}
                        isLoading={isLoading}
                        options={riderOptions}
                        formatOptionLabel={(opt) => (
                            <div className="flex items-center justify-between w-full pr-1">
                                <span className="font-medium truncate mr-2">
                                    {opt.name}
                                </span>
                                {opt.phone && (
                                    <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide opacity-70 border border-current shadow-sm">
                                        <Phone className="h-2.5 w-2.5" />
                                        {opt.phone}
                                    </span>
                                )}
                            </div>
                        )}
                    />
                </div>

                {/* Date Selection hooked into react-hook-form */}
                <div>
                    <FormInput
                        label="Scheduled Delivery"
                        type="date"
                        name="scheduledDate"
                    />
                </div>
            </div>
        </section>
    );
};

export default DeliveryRider;