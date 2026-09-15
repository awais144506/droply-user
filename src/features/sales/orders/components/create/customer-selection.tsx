"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FormSelect } from "@/components/ui/form-select";
import { User, MapPin } from "lucide-react";
import { useCustomers } from "@/features/manage/customers/api/use-customer";
import { OrderFormValues } from "../../schema/create-order-schema";

type Props = {
    branchId: string;
};

const CustomerSelection = ({ branchId }: Props) => {
    const { control } = useFormContext<OrderFormValues>();
    const { data, isLoading } = useCustomers(branchId);
    const customerOptions = data?.customerOptions || [];
    const selectedCustomerId = useWatch({
        control,
        name: "customerId",
    });

    const selectedCustomer = customerOptions.find(c => c.id === selectedCustomerId);

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Customer & Khata
                </h3>
            </div>

            <FormSelect
                name="customerId"
                label="Search Customers"
                isSearchable={true}
                isLoading={isLoading}
                // 1. Pass the extra data (address, category, name) into the options array
                options={customerOptions.map((c) => ({
                    value: c.id,
                    label: `${c.name} - ${c.address} (${c.category})`,
                    name: c.name,
                    address: c.address,
                    category: c.category
                }))}
                // 2. Custom Render for the Dropdown Options
                formatOptionLabel={(opt) => (
                    <div className="flex flex-col w-full pr-1 py-0.5">
                        <div className="flex items-center justify-between w-full">
                            <span className="font-bold truncate mr-2">
                                {opt.name}
                            </span>
                            <span className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border border-current opacity-70 shadow-sm">
                                {opt.category}
                            </span>
                        </div>
                        {opt.address && opt.address !== "No Address Provided" && (
                            <span className="text-[10px] opacity-70 font-medium flex items-center gap-1 mt-0.5 truncate">
                                <MapPin className="h-2.5 w-2.5 shrink-0" />
                                {opt.address}
                            </span>
                        )}
                    </div>
                )}
            />

            {/* The Context Banner as a Column Card */}
            {selectedCustomer && (
                <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">

                    {/* Top Section: Identity & Address */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                        <div>
                            <h4 className="text-sm font-extrabold text-slate-900">
                                {selectedCustomer.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                {selectedCustomer.address}
                            </p>
                            {selectedCustomer.zoneName && (
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 pl-5">
                                    Zone: {selectedCustomer.zoneName}
                                </p>
                            )}
                        </div>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                            {selectedCustomer.category}
                        </span>
                    </div>

                    {/* Bottom Section: Dual Ledger Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Financial Ledger (Khata) */}
                        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 flex flex-col">
                            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide mb-1">
                                Payable Khata
                            </span>
                            <span className="text-lg font-black text-rose-700">
                                Rs {Number(selectedCustomer.customerCredit || 0).toLocaleString()}
                            </span>
                        </div>

                        {/* Asset Ledger (Returnables) */}
                        <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-3 flex flex-col">
                            <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wide mb-1">
                                Assets Held
                            </span>
                            <span className="text-lg font-black text-sky-700">
                                {selectedCustomer.assetsHeld} <span className="text-xs font-bold text-sky-600/70">items</span>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CustomerSelection;