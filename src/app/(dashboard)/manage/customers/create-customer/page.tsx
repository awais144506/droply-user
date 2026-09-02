"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactSelect from "react-select";
import { toast } from "sonner";
import {
    ArrowLeft, Loader2, User, MapPin, Wallet,
    Plus, AlertCircle, Trash2, PlusCircle, Package
} from "lucide-react";

import { useRole } from "@/hooks/use-role";
import { useZones } from "@/features/zones/api/use-zones";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCustomerSchema, CreateCustomerFormData } from "@/features/customers/schema/create-customer.schema";

// --- Tailwind styled React-Select styling configuration ---
const reactSelectClassNames = {
    control: (state: any) =>
        `flex min-h-10 w-full items-center justify-between rounded-xl bg-slate-50 border px-3 ${state.isFocused ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200'
        } shadow-none hover:border-sky-500 hover:bg-white transition-colors text-sm cursor-text`,
    valueContainer: () => "flex items-center gap-1 w-full m-0 p-0",
    singleValue: () => "text-slate-900 font-medium overflow-hidden text-ellipsis whitespace-nowrap",
    input: () => "text-slate-900 m-0 p-0",
    placeholder: () => "text-slate-400 font-normal",
    indicatorsContainer: () => "flex items-center gap-1",
    clearIndicator: () => "text-slate-400 hover:text-rose-500 cursor-pointer",
    dropdownIndicator: () => "text-slate-400 hover:text-slate-600 cursor-pointer",
    indicatorSeparator: () => "hidden",
    menu: () => "rounded-xl border border-slate-200 bg-white shadow-lg mt-1 text-sm overflow-hidden z-50",
    menuList: () => "max-h-48 custom-scrollbar p-1",
    option: (state: any) =>
        `cursor-pointer px-3 py-2 rounded-lg transition-colors ${state.isSelected ? 'bg-sky-50 text-sky-700 font-bold' : state.isFocused ? 'bg-slate-50 text-slate-900' : 'text-slate-700'
        }`,
};

export default function CreateCustomerPage() {
    const router = useRouter();
    const { branchId } = useRole();

    // Data Fetching
    const { data: rawZones } = useZones(branchId);
    const zones = Array.isArray(rawZones) ? rawZones : [];

    // Formatted for react-select
    const zoneOptions = zones.map(z => ({ value: z.id, label: z.name }));

    // Mocking products for UI demonstration
    const productOptions = [
        { value: "prod-1", label: "19L Bottle" },
        { value: "prod-2", label: "Water Dispenser" },
        { value: "prod-3", label: "12kg Cylinder" },
        { value: "prod-4", label: "Empty Pallet" },
    ];

    const isPending = false;
    const isError = false;

    const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<CreateCustomerFormData>({
        resolver: yupResolver(createCustomerSchema),
        mode: "onChange",
        defaultValues: {
            partyType: "CUSTOMER",
            customerCategory: "DOMESTIC",
            name: "",
            phone: "",
            zoneId: "",
            address: "",
            customerCredit: 0,
            customerAdvance: 0,
            securityHeld: 0,
            openingReturnables: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "openingReturnables",
    });

    const onSubmit = (data: CreateCustomerFormData) => {
        console.log("Customer Payload:", data);
        toast.success("Customer created successfully!");
        router.push("/manage/customers");
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <div className="flex items-center gap-3 border-b pb-4">
                <Link href="/manage/customers" className={buttonVariants({ variant: "outline", size: "icon-sm" })}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Customer</h1>
                </div>
            </div>

            {isError && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Failed to save customer. Please check the inputs.</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Identity & Contact */}
                    <Card>
                        <CardHeader className="pb-3 border-b border-slate-100">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <User className="h-4 w-4 text-sky-600" />
                                Identity & Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Party Type *</label>
                                    <Controller
                                        name="partyType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-full h-10 rounded-xl bg-slate-50 border-slate-200 focus:ring-sky-500">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="CUSTOMER">Customer (Buyer)</SelectItem>
                                                    <SelectItem value="VENDOR">Vendor (Supplier)</SelectItem>
                                                    <SelectItem value="BOTH">Both (Buys & Sells)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category *</label>
                                    <Controller
                                        name="customerCategory"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-full h-10 rounded-xl bg-slate-50 border-slate-200 focus:ring-sky-500">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="DOMESTIC">Domestic (Home)</SelectItem>
                                                    <SelectItem value="COMMERCIAL">Commercial (Shop)</SelectItem>
                                                    <SelectItem value="CORPORATE">Corporate (Office)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Full Name / Business Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Al-Madina Sweets"
                                    {...register("name")}
                                    className={`w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:bg-white ${errors.name ? "border-rose-300 focus:ring-rose-500" : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-500"}`}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Phone Number *</label>
                                <input
                                    type="text"
                                    placeholder="03001234567"
                                    {...register("phone")}
                                    className={`w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:bg-white ${errors.phone ? "border-rose-300 focus:ring-rose-500" : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-500"}`}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Delivery Zone / Route</label>
                                <Controller
                                    name="zoneId"
                                    control={control}
                                    render={({ field }) => (
                                        <ReactSelect
                                            options={zoneOptions}
                                            value={zoneOptions.find(z => z.value === field.value) || null}
                                            onChange={(opt) => field.onChange(opt?.value || "")}
                                            placeholder="Search zones..."
                                            isClearable
                                            unstyled
                                            classNames={reactSelectClassNames}
                                        />
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3 border-b border-slate-100">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                    Address & Coordinates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Street Address *</label>
                                    <input
                                        type="text"
                                        placeholder="House / Shop No, Street, Area"
                                        {...register("address")}
                                        className={`w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:bg-white ${errors.address ? "border-rose-300 focus:ring-rose-500" : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-500"}`}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder="30.1452"
                                            {...register("latitude", { valueAsNumber: true })}
                                            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Longitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder="70.1452"
                                            {...register("longitude", { valueAsNumber: true })}
                                            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3 border-b border-slate-100">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Wallet className="h-4 w-4 text-amber-600" />
                                    Initial Balances & Assets
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Khata (Credit)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs</span>
                                            <input
                                                type="number"
                                                {...register("customerCredit", { valueAsNumber: true })}
                                                className="w-full h-10 pl-8 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Advance Paid</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs</span>
                                            <input
                                                type="number"
                                                {...register("customerAdvance", { valueAsNumber: true })}
                                                className="w-full h-10 pl-8 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Security Deposit Held</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs</span>
                                            <input
                                                type="number"
                                                {...register("securityHeld", { valueAsNumber: true })}
                                                className="w-full h-10 pl-8 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center mr-2">
                                            <Package className="h-4 w-4 text-sky-600 mr-2" />
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Opening Returnables</label>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => append({ productId: "", quantity: 1 })}
                                            className="h-7 text-[10px] rounded-lg px-2 text-sky-600 border-sky-200 hover:bg-sky-50"
                                        >
                                            <PlusCircle className="h-3 w-3 mr-1" /> Add Item
                                        </Button>
                                    </div>

                                    {fields.length === 0 ? (
                                        <div className="text-xs text-slate-400 bg-slate-50 rounded-xl p-4 text-center border border-dashed border-slate-200">
                                            No assets assigned to this customer yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex items-start gap-2">
                                                    <div className="flex-1">
                                                        <Controller
                                                            name={`openingReturnables.${index}.productId`}
                                                            control={control}
                                                            render={({ field: selectField }) => (
                                                                <ReactSelect
                                                                    options={productOptions}
                                                                    value={productOptions.find(p => p.value === selectField.value) || null}
                                                                    onChange={(opt) => selectField.onChange(opt?.value || "")}
                                                                    placeholder="Search item..."
                                                                    isClearable
                                                                    unstyled

                                                                    // Portal menu to prevent clipping behind card boundaries
                                                                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                                                    menuPosition="fixed"
                                                                    styles={{
                                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                                                    }}

                                                                    classNames={{
                                                                        ...reactSelectClassNames,
                                                                        control: (state) =>
                                                                            `flex min-h-10 w-full items-center justify-between rounded-xl bg-slate-50 border px-3 ${errors.openingReturnables?.[index]?.productId
                                                                                ? 'border-rose-300'
                                                                                : state.isFocused
                                                                                    ? 'border-sky-500 ring-2 ring-sky-500/20'
                                                                                    : 'border-slate-200'
                                                                            } hover:bg-white transition-colors text-sm cursor-text`
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </div>

                                                    <div className="w-24">
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                {...register(`openingReturnables.${index}.quantity`, { valueAsNumber: true })}
                                                                className={`w-full h-10 pr-8 pl-3 rounded-xl border bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:bg-white ${errors.openingReturnables?.[index]?.quantity ? 'border-rose-300' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'}`}
                                                            />
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Qty</span>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => remove(index)}
                                                        className="h-10 w-10 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl shrink-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t pt-4">
                    <Link href="/manage/customers" className={buttonVariants({ variant: "outline", size: "sm" })}>
                        Cancel
                    </Link>
                    <Button type="submit" disabled={isPending || !isValid} className="min-w-36 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-10 text-white shadow-sm">
                        {isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Creating...</>
                        ) : (
                            <><Plus className="h-4 w-4 mr-1.5" /> Create Customer</>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}