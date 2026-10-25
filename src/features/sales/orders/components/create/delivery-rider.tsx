/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Truck, Phone, RefreshCw, UserCog } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormSelect } from "@/components/ui/form-select";
import { FormInput } from "@/components/ui/form-input";
import { useStaffList } from "@/features/admin/staff/api/use-staff";
import { OrderFormValues } from "../../schema/create-order-schema";
import { FormPhoneInput } from "@/components/ui/form-phone-input";

type Props = {
    branchId: string;
};

const DeliveryRider = ({ branchId }: Props) => {
    const { control, setValue } = useFormContext<OrderFormValues>();
    const orderType = useWatch({ control, name: "orderType" });
    const [isThirdParty, setIsThirdParty] = useState(false);

    const { data, isLoading } = useStaffList(branchId);
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

    // Handle switching between modes
    const enableThirdParty = () => {
        setIsThirdParty(true);
        setValue("riderId", "");
    };

    const enableBranchRider = () => {
        setIsThirdParty(false);
        // Clear manual 3rd party fields
        setValue("driverName", "");
        setValue("driverPhone", "");
        setValue("driverCnic", "");
        setValue("vehiclePlate", "");
    };

    if (orderType !== "DELIVERY") return null;

    return (
        <section className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl transition-all animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {isThirdParty ? <UserCog className="h-5 w-5 text-indigo-400" /> : <Truck className="h-5 w-5 text-indigo-400" />}
                    <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">
                        {isThirdParty ? "Third Party Logistics" : "Dispatch Details"}
                    </h3>
                </div>
                
                {/* Toggle Button for Header */}
                {isThirdParty && (
                    <button 
                        type="button" 
                        onClick={enableBranchRider}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 bg-indigo-100/50 hover:bg-indigo-100 px-2 py-1 rounded cursor-pointer transition-colors"
                    >
                        <RefreshCw className="h-3 w-3" />
                        Use Branch Rider
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                
                {!isThirdParty ? (
                    /* NORMAL MODE: Branch Rider Dropdown */
                    <div className="-mt-0.5">
                        <FormSelect
                            name="riderId"
                            label="Assign Rider"
                            isSearchable={true}
                            isLoading={isLoading}
                            options={riderOptions}
                            showSecondaryAction={true}
                            secondaryActionLabel="Assign 3rd Party / Local Driver"
                            secondaryActionIcon={UserCog}
                            onSecondaryActionClick={enableThirdParty}
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
                ) : (
                    /* 3RD PARTY MODE: Manual Fields */
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
                        <FormInput name="driverName" label="Driver Name" placeholder="e.g. Ali " />
                        <FormPhoneInput name="driverPhone" label="Driver Phone" placeholder="0300 1234567" />
                        <FormInput name="driverCnic" label="Driver CNIC" placeholder="35202-1234567-8" />
                        <FormInput name="vehiclePlate" label="Vehicle Plate No." placeholder="e.g. LEA-1234" />
                    </div>
                )}

                {/* Date Selection (Always visible) */}
                <div className={isThirdParty ? "sm:col-span-2 sm:max-w-[50%]" : ""}>
                    <FormInput
                        label="Scheduled Delivery"
                        type="date"
                        name="scheduledDate"
                        disablePastDates={true}
                    />
                </div>
            </div>
        </section>
    );
};

export default DeliveryRider;