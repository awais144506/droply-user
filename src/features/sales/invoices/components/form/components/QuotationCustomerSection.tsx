/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import {
    Building2,
    Calendar,
    FileText,
    Hash,
    MapPin,
    Mail,
    ShieldAlert,
    PackageCheck,
    UserCheck,
} from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormPhoneInput } from "@/components/ui/form-phone-input";

interface Props {
    customerOptions: any[];
    isLoadingCustomers: boolean;
}

export function QuotationCustomerSection({
    customerOptions = [],
    isLoadingCustomers,
}: Props) {
    const { setValue, watch } = useFormContext();
    const selectedCustomerId = watch("customerId");

    // Find currently selected customer object to show their live history/ledger card
    const selectedCustomer = customerOptions.find(
        (c) => c.value === selectedCustomerId
    );

    // Auto-fill "Bill To" fields when user selects a customer from dropdown
    const handleCustomerSelect = (option: any) => {
        if (option) {
            setValue("partyName", option.label || "", { shouldValidate: true, shouldDirty: true });
            setValue("partyPhone", option.phone || "", { shouldValidate: true, shouldDirty: true });
            setValue("partyNtn", option.ntn || "", { shouldValidate: true, shouldDirty: true });
            setValue("partyStrn", option.strn || "", { shouldValidate: true, shouldDirty: true });
            setValue("partyEmail", option.email || "", { shouldValidate: true, shouldDirty: true });
            setValue("partyAddress", option.address !== "No Address Provided" ? option.address : "", {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: Document Info & Customer Lookup */}
            <Card className="lg:col-span-5 rounded-2xl border-slate-200/90 shadow-xs">
                <CardHeader className="p-5 border-b border-slate-100">
                    <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sky-600" />
                        Date & Customer
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">


                    {/* Registered Customer Selector (Optional) */}
                    <div className="pt-2 border-t border-slate-100">
                        <FormSelect
                            name="customerId"
                            label="Customer List"
                            placeholder="Search regular or corporate client..."
                            options={customerOptions}
                            isLoading={isLoadingCustomers}
                            isSearchable
                            isClearable
                            labelIcon={UserCheck}
                            onValueChange={handleCustomerSelect}
                            helperText="Select a customer to auto-fill Bill To details & view their ledger history, or type a custom client on the right."
                            formatOptionLabel={(opt: any) => (
                                <div className="flex items-center justify-between py-0.5">
                                    <div>
                                        <span className="font-bold text-xs block">{opt.label}</span>
                                        <span className="text-[10px] opacity-75">{opt.phone} • {opt.zoneName || "No Zone"}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] uppercase font-bold">
                                        {opt.category}
                                    </Badge>
                                </div>
                            )}
                        />
                    </div>

                    {/* 🔥 Live Customer History / Standing Card when a customer is selected */}
                    {selectedCustomer && (
                        <div className="rounded-xl bg-sky-50/60 border border-sky-200/80 p-3.5 space-y-2.5 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                                    <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                                    Customer History
                                </span>
                                <Badge variant="outline" className="bg-white text-sky-700 border-sky-200 text-[10px] font-bold">
                                    {selectedCustomer.category}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <div className="bg-white/90 rounded-lg p-2.5 border border-sky-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                        <ShieldAlert className="w-3 h-3 text-rose-500" /> Outstanding Credit
                                    </span>
                                    <p className={`text-sm font-black mt-0.5 ${selectedCustomer.customerCredit > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                        Rs. {Number(selectedCustomer.customerCredit || 0).toLocaleString()}
                                    </p>
                                </div>

                                <div className="bg-white/90 rounded-lg p-2.5 border border-sky-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                        <PackageCheck className="w-3 h-3 text-indigo-500" /> Assets Held
                                    </span>
                                    <p className="text-sm font-black text-slate-900 mt-0.5">
                                        {selectedCustomer.assetsHeld} <span className="text-[10px] font-semibold text-slate-400">units</span>
                                    </p>
                                </div>
                            </div>

                            {selectedCustomer.zoneName && (
                                <p className="text-[11px] text-slate-600 font-medium">
                                    Zone: <span className="font-bold text-slate-800">{selectedCustomer.zoneName}</span>
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Right 7 Cols: Editable "Bill To" Snapshot (Matches PDF) */}
            <Card className="lg:col-span-7 rounded-2xl border-slate-200/90 shadow-xs">
                <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-sky-600" />
                            Customer / Party Details
                        </CardTitle>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Auto-filled if a customer is selected, or freely editable for walk-in B2B / corporate clients.
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                    {/* Row 1: Issue Date, Client Name, Phone (Balanced 3 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormInput
                            name="issueDate"
                            label="Issue Date"
                            type="date"
                            required
                            labelIcon={Calendar}
                        />
                        <FormInput
                            name="partyName"
                            label="Company / Client Name"
                            placeholder="e.g. Beacon Energy (Pvt) Limited"
                            required
                            labelIcon={Building2}
                        />
                        <FormPhoneInput
                            name="partyPhone"
                            label="Phone"
                            placeholder="e.g. 03216903582"
                        />
                    </div>

                    {/* Row 2: NTN, STRN, Email (Consistent 3 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormInput
                            name="partyNtn"
                            label="NTN No."
                            placeholder="e.g. 6528870-0"
                            labelIcon={Hash}
                        />
                        <FormInput
                            name="partyStrn"
                            label="STRN No."
                            placeholder="e.g. 3277876181126"
                            labelIcon={Hash}
                        />
                        <FormInput
                            name="partyEmail"
                            label="Email"
                            placeholder="client@company.com"
                            labelIcon={Mail}
                        />
                    </div>

                    {/* Row 3: Full Width Address */}
                    <FormInput
                        name="partyAddress"
                        label="Address"
                        placeholder="e.g. 789, Capital View Road Mohra Noor, Banigala, Islamabad"
                        labelIcon={MapPin}
                    />
                </CardContent>
            </Card>
        </div>
    );
}