/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormProvider } from "react-hook-form";
import CreateStaffIdentityCard from "@/features/admin/staff/components/create/identity-card";
import RiderZoneCard from "@/features/admin/staff/components/create/rider-zone";
import StaffExtraDetails from "@/features/admin/staff/components/create/staff-extra-details";
import { yupResolver } from "@hookform/resolvers/yup";
import { createStaffSchema, CreateStaffFormData } from "@/features/admin/staff/schema/create-staff-schema";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";

const CreateStaffForm = ({ onSubmit,
    isPending,
    zoneOptions,
    vehicleOptions,
    isZoneLoading,
    isVehiclesLoading,
    selectedRole,
    setStep,
    isLimitReached
}: any) => {
    const form = useForm<CreateStaffFormData>({
        resolver: yupResolver(createStaffSchema),
        context: { role: selectedRole },
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

    const handleFormSubmit = (data: CreateStaffFormData) => {
        if (isLimitReached) {
            toast.error("Staff Limit Reached!", {
                description: "You have used all available slots in your current plan. Please upgrade to add more staff."
            });
            return;
        }
        onSubmit(data);
    };

    return (
        <FormProvider {...form}>
            <div>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                    <FormCTAFooter
                        isPending={isPending}
                        isDirty={form.formState.isDirty}
                        isValid={form.formState.isValid}
                        href="/admin/staff"
                        setStep={setStep}
                    />
                </form>
            </div>
        </FormProvider>
    )
}

export default CreateStaffForm