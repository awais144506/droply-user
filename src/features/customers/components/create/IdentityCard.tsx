/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { User } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reactSelectClassNames } from "@/utils/react-select-styles";
import { partyOptions, categoryOptions } from "@/features/customers/data/dropdownOptions";

export default function IdentityCard({ control, register, errors, zoneOptions }: any) {
    return (
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
                                <ReactSelect
                                    options={partyOptions}
                                    value={partyOptions.find(p => p.value === field.value || null)}
                                    onChange={(opt) => field.onChange(opt?.value || "")}
                                    isSearchable={false}
                                    unstyled
                                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                    menuPosition="fixed"
                                    classNames={reactSelectClassNames}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category *</label>
                        <Controller
                            name="customerCategory"
                            control={control}
                            render={({ field }) => (
                                <ReactSelect
                                    options={categoryOptions}
                                    value={categoryOptions.find(c => c.value === field.value || null)}
                                    onChange={(opt) => field.onChange(opt?.value || "")}
                                    isSearchable={false}
                                    unstyled
                                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                    menuPosition="fixed"
                                    classNames={reactSelectClassNames}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <FormInput
                        label="Full Name / Business Name"
                        required
                        placeholder="e.g. Muhammad Awais"
                        register={register("name")}
                        error={errors.name?.message}
                    />
                </div>

                <div className="space-y-1.5">
                    <FormInput
                        label="Phone Number"
                        required
                        placeholder="e.g. 03211234567"
                        register={register("phone")}
                        error={errors.phone?.message}
                    />
                </div>
                <div className="space-y-1.5">
                    <FormInput
                        label="Email"
                        placeholder="e.g. awais@gmail.com"
                        register={register("email")}
                        error={errors.email?.message}
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
                                value={zoneOptions?.find((z: any) => z.value === field.value) || null}
                                onChange={(opt) => field.onChange(opt?.value || "")}
                                placeholder="Search zones..."
                                isClearable
                                unstyled
                                classNames={reactSelectClassNames}
                            />
                        )}
                    />
                    {errors.zoneId && <p className="text-xs text-rose-500 mt-1">{errors.zoneId.message}</p>}
                </div>
            </CardContent>
        </Card>
    );
}