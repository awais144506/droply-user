"use client";

import { FormProvider } from "react-hook-form";
import { vehicleSchema, VehicleFormValues } from "../../schema/fleet.schema";
import { useCreateVehicle } from "../../api/use-create-fleet";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { vehicleTypeOption, vehicleFuelTypeOption, vehicleStatusOption } from "./create-vehicle-options";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";
import { useAppForm } from "@/lib/hooks/use-app-form";

export default function CreateVehicleForm({ branchId }: { branchId: string }) {
    const { mutate: createVehicle, isPending: isSaving } = useCreateVehicle(branchId);

    const form = useAppForm(vehicleSchema, {
        status: "ACTIVE",
        type: "MOTORCYCLE",
        fuelType: "PETROL",
    })

    const onSubmit = (data: VehicleFormValues) => {
        createVehicle(data);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">

                {/* ======================================= */}
                {/* CARD 1: VEHICLE DETAILS                 */}
                {/* ======================================= */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                            <Truck className="h-5 w-5 text-sky-600" />
                            Vehicle Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput name="registration" label="Registration Number" required placeholder="e.g. LEB-4040" />
                            <FormInput name="modelInfo" label="Make & Model" required placeholder="Honda CD-70" />
                            <FormSelect name="type" label="Vehicle Type" options={vehicleTypeOption} isSearchable={false} required />
                            <FormSelect name="fuelType" label="Fuel Type" options={vehicleFuelTypeOption} isSearchable={false} required />
                            <FormSelect name="status" label="Vehicle Status" options={vehicleStatusOption} isSearchable={false} required />
                            <FormInput name="currentOdometer" label="Current Odometer" type="number" suffix="KM" required />
                            <FormInput name="capacityInfo" label="Capacity Info" placeholder="e.g. 150 KG" />
                        </div>
                    </CardContent>
                </Card>

                <FormCTAFooter
                    href="/admin/fleet"
                    isDirty={form.formState.isDirty}
                    isValid={form.formState.isValid}
                    isPending={isSaving}
                    ctaText="Create Vehicle"
                    icon={Truck}
                />
            </form>
        </FormProvider>
    );
}