/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bike } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";

const RiderZoneCard = ({
    selectedRole,
    zoneOptions,
    isZoneLoading,
    vehicleOptions,
    isVehiclesLoading
}: any) => {
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
                        <FormSelect
                            isMulti={true}
                            name="zoneIds"
                            label="Assign Delivery Zones"
                            options={zoneOptions}
                            isSearchable={true}
                            isLoading={isZoneLoading}
                            required

                        />
                    </div>

                    <div className="space-y-1.5">
                        <FormSelect
                            isMulti={true}
                            name="vehicleIds"
                            label="Assign Vehicle"
                            options={vehicleOptions}
                            isSearchable={true}
                            isLoading={isVehiclesLoading}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <FormInput
                            label="License Number"
                            placeholder="e.g. LEX-14-123"
                            name="licenseNumber"
                        />
                    </div>
                </CardContent>
            </Card>
        )}</div>
    )
}

export default RiderZoneCard