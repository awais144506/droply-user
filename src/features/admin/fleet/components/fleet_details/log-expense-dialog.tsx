"use client";

import { useEffect } from "react";
import { FormProvider, useWatch } from "react-hook-form";
import { Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { useRole } from "@/lib/hooks/use-role";
import { useAppForm } from "@/lib/hooks/use-app-form";
import { vehicleExpenseSchema, VehicleExpenseFormValues } from "../../schema/fleet.schema";
import { Vehicle } from "../../types/fleet";
import { useCreateVehicleExpense } from "../../api/use-create-fleet";

interface LogExpenseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle;
}

export default function LogExpenseDialog({ isOpen, onClose, vehicle }: LogExpenseDialogProps) {
    const { branchId } = useRole();
    const { mutate: logExpense, isPending } = useCreateVehicleExpense(branchId, vehicle.id);

    const methods = useAppForm(vehicleExpenseSchema, {
        vehicleId: vehicle.id,
        category: "FUEL",
        odometerReading: vehicle.currentOdometer,
        totalCost: 0,
        liters: null,
        costPerLiter: null,
        serviceProvider: "",
        invoiceNumber: "",
        notes: "",
    });

    const { handleSubmit, reset, control, setValue } = methods;

    const selectedCategory = useWatch({ control, name: "category" });
    const liters = useWatch({ control, name: "liters" });
    const costPerLiter = useWatch({ control, name: "costPerLiter" });

    // Auto-calculate total cost for FUEL
    useEffect(() => {
        if (selectedCategory === "FUEL" && liters && costPerLiter) {
            setValue("totalCost", Number(liters) * Number(costPerLiter), { shouldValidate: true });
        }
    }, [liters, costPerLiter, selectedCategory, setValue]);

    // Clear fuel-specific values when switching to MAINTENANCE (and vice versa)
    useEffect(() => {
        if (selectedCategory === "MAINTENANCE") {
            setValue("liters", null, { shouldValidate: true });
            setValue("costPerLiter", null, { shouldValidate: true });
        } else {
            setValue("serviceProvider", "", { shouldValidate: true });
            setValue("invoiceNumber", "", { shouldValidate: true });
        }
    }, [selectedCategory, setValue]);

    useEffect(() => {
        if (isOpen) {
            reset({
                vehicleId: vehicle.id,
                category: "FUEL",
                odometerReading: vehicle.currentOdometer,
                totalCost: 0,
                liters: null,
                costPerLiter: null,
                serviceProvider: "",
                invoiceNumber: "",
                notes: "",
            });
        }
    }, [isOpen, vehicle.id, vehicle.currentOdometer, reset]);

    const onSubmit = (data: VehicleExpenseFormValues) => {
        logExpense(data, {
            onSuccess: () => onClose()
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
            <DialogContent className="min-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-slate-800">
                        <Receipt className="h-5 w-5 text-sky-600" />
                        Log Vehicle Expense
                    </DialogTitle>
                    <DialogDescription>
                        Record a fuel purchase, maintenance bill, or repair cost. The vehicle&apos;s odometer will be updated automatically.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form id="log-expense-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-2">

                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect
                                name="category"
                                label="Expense Category"
                                options={[
                                    { label: "Fuel Refill", value: "FUEL" },
                                    { label: "Maintenance / Repair", value: "MAINTENANCE" }
                                ]}
                            />
                            <FormInput name="date" label="Date of Expense" type="date" />
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                            {selectedCategory === "FUEL" ? (
                                <div className="grid grid-cols-3 gap-4">
                                    <FormInput name="liters" label="Volume (Liters)" type="number" min={0.1} />
                                    <FormInput name="costPerLiter" label="Unit Cost (Rs/L)" type="number" min={1} />
                                    <FormInput name="totalCost" label="Total Cost (Rs)" type="number" min={1} disabled={!!(liters && costPerLiter)} />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormInput name="serviceProvider" label="Service Provider / Workshop" placeholder="e.g. Ali Auto Workshop" />
                                        <FormInput name="invoiceNumber" label="Invoice / Receipt #" placeholder="Optional" />
                                    </div>
                                    <FormInput name="totalCost" label="Total Bill Amount (Rs)" type="number" min={1} />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-start">
                            <FormInput
                                name="odometerReading"
                                label="Odometer Reading (km)"
                                type="number"
                                min={vehicle.currentOdometer}
                            />
                            <FormInput name="notes" label="Additional Notes" placeholder="Any details..." />
                        </div>

                    </form>
                </FormProvider>

                <DialogFooter className="border-t border-slate-100 pt-4 mt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" form="log-expense-form" disabled={isPending || !methods.formState.isValid} className="bg-sky-600 hover:bg-sky-700 text-white">
                        {isPending ? "Saving..." : "Log Expense"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}