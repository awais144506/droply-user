"use client";

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { vehicleSchema, VehicleFormValues } from "../../schema/fleet.schema";
import { useCreateVehicle } from "../../api/use-create-fleet";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, User } from "lucide-react";
import { vehicleTypeOption, vehicleFuelTypeOption, vehicleStatusOption } from "./create-vehicle-options";

export default function CreateVehicleForm({ branchId }: { branchId: string }) {

    const router = useRouter();
    const { mutate: createVehicle, isPending: isSaving } = useCreateVehicle(branchId);

    const form = useForm<VehicleFormValues>({
        resolver: yupResolver(vehicleSchema),
        mode: "onChange",
        defaultValues: {
            status: "ACTIVE",
            type: "MOTORCYCLE",
            fuelType: "PETROL",
        },
    });

    const onSubmit = (data: VehicleFormValues) => {
        const payload = {
            ...data,
            branchId: branchId
        };
        createVehicle(payload, {
            onSuccess: () => router.back()
        });
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
                            <FormSelect name="type" label="Vehicle Type" options={vehicleTypeOption} required />
                            <FormSelect name="fuelType" label="Fuel Type" options={vehicleFuelTypeOption} required />
                            <FormSelect name="status" label="Vehicle Status" options={vehicleStatusOption} required />
                            <FormInput name="capacityInfo" label="Capacity Info" placeholder="e.g. 150 KG" />
                        </div>
                    </CardContent>
                </Card>

                {/* ======================================= */}
                {/* CARD 2: ASSIGNMENT & METRICS            */}
                {/* ======================================= */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                            <User className="h-5 w-5 text-sky-600" />
                            Assignment & Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                name="currentOdometer"
                                label="Current Odometer"
                                type="number"
                                suffix="KM"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="create" disabled={isSaving || !form.formState.isValid}>
                        {isSaving ? "Creating..." : "Create Vehicle"}
                    </Button>

                    {/* {Object.keys(form.formState.errors).length > 0 && (
                        <div className="bg-rose-50 p-4 rounded-lg w-full mb-4 font-mono text-xs text-rose-600">
                            <p className="font-bold mb-2">Why is the button disabled?</p>
                            <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
                        </div>
                    )} */}
                </div>
            </form>
        </FormProvider>
    );
}