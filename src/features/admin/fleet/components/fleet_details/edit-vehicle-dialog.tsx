"use client";

import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { useRole } from "@/lib/hooks/use-role";
import { useAppForm } from "@/lib/hooks/use-app-form";
import { vehicleSchema, VehicleFormValues } from "../../schema/fleet.schema";
import { Vehicle } from "../../types/fleet";
import { useUpdateVehicle } from "../../api/use-create-fleet";

interface EditVehicleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle;
}

export default function EditVehicleDialog({ isOpen, onClose, vehicle }: EditVehicleDialogProps) {
    const { branchId } = useRole();
    const { mutate: updateVehicle, isPending } = useUpdateVehicle(branchId, vehicle.id);

    const methods = useAppForm(vehicleSchema, {
        registration: vehicle.registration,
        modelInfo: vehicle.modelInfo,
        capacityInfo: vehicle.capacityInfo || "",
        type: vehicle.type,
        fuelType: vehicle.fuelType,
        status: vehicle.status,
        currentOdometer: vehicle.currentOdometer,
        assignedStaffId: vehicle.assignedStaffId || undefined,
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (isOpen && vehicle) {
            reset({
                registration: vehicle.registration,
                modelInfo: vehicle.modelInfo,
                capacityInfo: vehicle.capacityInfo || "",
                type: vehicle.type,
                fuelType: vehicle.fuelType,
                status: vehicle.status,
                currentOdometer: vehicle.currentOdometer,
                assignedStaffId: vehicle.assignedStaffId || undefined,
            });
        }
    }, [isOpen, vehicle, reset]);

    const onSubmit = (data: VehicleFormValues) => {
        updateVehicle(data, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
            <DialogContent className="min-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-slate-800">
                        <Edit className="h-5 w-5 text-sky-600" />
                        Edit Vehicle Details
                    </DialogTitle>
                    <DialogDescription>
                        Update the specifications and operational status for this vehicle.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form id="edit-vehicle-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput name="registration" label="Registration Number" placeholder="e.g. LYZ-1234" />
                            <FormInput name="modelInfo" label="Make & Model" placeholder="e.g. Honda CG 125" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect
                                name="type"
                                label="Vehicle Type"
                                options={[
                                    { label: "Motorcycle", value: "MOTORCYCLE" },
                                    { label: "Van", value: "VAN" },
                                    { label: "Rikshaw", value: "RIKSHAW" },
                                    { label: "Truck", value: "TRUCK" },
                                    { label: "Other", value: "OTHER" }
                                ]}
                            />
                            <FormSelect
                                name="fuelType"
                                label="Fuel Type"
                                options={[
                                    { label: "Petrol", value: "PETROL" },
                                    { label: "Diesel", value: "DIESEL" },
                                    { label: "Electric", value: "ELECTRIC" }
                                ]}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect
                                name="status"
                                label="Current Status"
                                options={[
                                    { label: "Active", value: "ACTIVE" },
                                    { label: "Maintenance", value: "MAINTENANCE" },
                                    { label: "Retired", value: "RETIRED" }
                                ]}
                            />
                            <FormInput name="currentOdometer" label="Current Odometer (km)" type="number" min={0} />
                        </div>

                        <FormInput name="capacityInfo" label="Capacity Info (Optional)" placeholder="e.g. 500kg or 20 Bottles" />
                    </form>
                </FormProvider>

                <DialogFooter className="border-t border-slate-100 pt-4 mt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" form="edit-vehicle-form" disabled={isPending || !methods.formState.isDirty || !methods.formState.isValid} className="bg-sky-600 hover:bg-sky-700 text-white">
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}