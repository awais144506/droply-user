/* eslint-disable @typescript-eslint/no-explicit-any */

import { Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { Bike } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reactSelectClassNames } from "@/utils/react-select-styles";
import { FormInput } from "@/components/ui/form-input";

const RiderZoneCard = ({ register, selectedRole, control, zoneOptions, errors, vehicleOptions }: any) => {
    return (
        <div>  {selectedRole === "RIDER" && (
            <Card>
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Bike className="h-4 w-4 text-emerald-600" />
                        Rider Route Assignment
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Assign Delivery Zones</label>
                        <Controller
                            name="zoneIds"
                            control={control}
                            render={({ field }) => (
                                <ReactSelect
                                    required
                                    isMulti
                                    options={zoneOptions}
                                    value={zoneOptions.filter((z: { value: any; }) => field.value?.includes(z.value))}
                                    onChange={(selected) => field.onChange(selected ? selected.map(s => s.value) : [])}
                                    placeholder="Search & attach zones..."
                                    unstyled
                                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                    menuPosition="fixed"
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                    classNames={reactSelectClassNames}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Assign Vehicle</label>
                        <Controller
                            name="zoneIds"
                            control={control}
                            render={({ field }) => (
                                <ReactSelect
                                    required
                                    isMulti
                                    options={vehicleOptions}
                                    value={zoneOptions.filter((z: { value: any; }) => field.value?.includes(z.value))}
                                    onChange={(selected) => field.onChange(selected ? selected.map(s => s.value) : [])}
                                    placeholder="Search & attach vehicle..."
                                    unstyled
                                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                    menuPosition="fixed"
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                    classNames={reactSelectClassNames}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <FormInput
                            label="License Number"
                            placeholder="e.g. LEX-14-123"
                            register={register("licenseNumber")}
                            error={errors.licenseNumber?.message}
                        />
                    </div>
                </CardContent>
            </Card>
        )}</div>
    )
}

export default RiderZoneCard