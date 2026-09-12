/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormProvider } from "react-hook-form";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import CreateStaffIdentityCard from "@/features/staff/components/create/IdentityCard";
import RiderZoneCard from "@/features/staff/components/create/RiderZoneCard";
import StaffExtraDetails from "@/features/staff/components/create/StaffExtraDetails";
import { yupResolver } from "@hookform/resolvers/yup";
import { createStaffSchema, CreateStaffFormData } from "@/features/staff/schema/create-staff-schema";
import { useForm } from "react-hook-form";


const CreateStaffForm = ({ onSubmit,
    isPending,
    zoneOptions,
    vehicleOptions,
    isZoneLoading,
    isVehiclesLoading,
    selectedRole,
    setStep }: any) => {
    const form = useForm<CreateStaffFormData>({
        resolver: yupResolver(createStaffSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            cnic: "",
            address: "",
            salary: 0,
            zoneIds: [],
            vehicleIds: [],
        },
    });
    return (
        <FormProvider {...form}>
            <div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="col-span-1 space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <CreateStaffIdentityCard />
                            {selectedRole === 'RIDER' && (
                                <RiderZoneCard
                                    selectedRole={selectedRole}
                                    zoneOptions={zoneOptions}
                                    vehicleOptions={vehicleOptions}
                                    isZoneLoading={isZoneLoading}
                                    isVehiclesLoading={isVehiclesLoading}

                                />
                            )}
                            <StaffExtraDetails />
                        </div>

                    </div>

                    <div className="flex items-center justify-end gap-3 border-t pt-4">
                        <Button type="button" variant="outline" onClick={() => setStep("SELECT_ROLE")} className="mr-auto">
                            Change Role
                        </Button>
                        <Link href="/admin/staff" className={buttonVariants({ variant: "outline" })}>
                            Cancel
                        </Link>
                        <Button type="submit" disabled={isPending || !form.formState.isValid} className="min-w-36 bg-emerald-600 hover:bg-emerald-700 text-white">
                            {isPending ? (
                                <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Creating...</>
                            ) : (
                                <><Plus className="h-4 w-4 mr-1.5" /> Create Account</>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </FormProvider>
    )
}

export default CreateStaffForm