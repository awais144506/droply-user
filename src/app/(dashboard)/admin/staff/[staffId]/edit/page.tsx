/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useRouter, useParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertTriangle, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import PageDetailHeader from "@/lib/utils/components/PageDetailHeader";
import CreateStaffIdentityCard from "@/features/admin/staff/components/create/identity-card";
import RiderZoneCard from "@/features/admin/staff/components/create/rider-zone";
import StaffExtraDetails from "@/features/admin/staff/components/create/staff-extra-details";
import { FormSelect } from "@/components/ui/form-select";

import { useStaffDetail } from "@/features/admin/staff/api/use-staff";
import { useUpdateStaff } from "@/features/admin/staff/api/use-mutate-staff";
import { useZones } from "@/features/manage/zones/api/use-zones";
import { useVehicles } from "@/features/admin/fleet/api/use-fleet";
import { useRole } from "@/lib/hooks/use-role";
import Loading from "@/app/loading";
import { updateStaffSchema, UpdateStaffFormData } from "@/features/admin/staff/schema/update-staff-schema";
import { updateStaffPayload } from "@/features/admin/staff/utils/formatStaffPayload";
import { getEditStaffFormValues } from "@/features/admin/staff/utils/staff-defaults";

export default function EditStaffPage() {
    const router = useRouter();
    const params = useParams();
    const staffId = params.staffId as string;
    const { branchId } = useRole();

    // 1. Data Fetching
    const { data: user, isLoading: isUserLoading } = useStaffDetail(staffId);
    const { data: zoneData, isLoading: isZoneLoading } = useZones(branchId);
    const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles(branchId);
    const { mutate: updateStaff, isPending: isSubmitting } = useUpdateStaff();

    const zoneOptions = zoneData?.zoneOptions || [];
    const vehicleOptions = vehiclesData?.vehicleOptions || [];

    // 2. The Form Setup (Look how clean this is!)
    const methods = useForm<UpdateStaffFormData>({
        resolver: yupResolver(updateStaffSchema),
        mode: "onChange",
        // The `values` prop automatically updates the form and handles isDirty when data arrives!
        values: getEditStaffFormValues(user, zoneOptions, vehicleOptions),
    });

    // 3. Derived State
    const selectedRole = methods.watch("designation");
    const isRoleChanged = user?.designation && selectedRole !== user.designation;

    // 4. Submit Handler
    const onUpdateSubmit = (data: UpdateStaffFormData) => {
        const formattedPayload = updateStaffPayload(data as UpdateStaffFormData);
        updateStaff(
            { id: staffId, data: formattedPayload },
            { onSuccess: () => router.back() }
        );
    };

    // 5. Loading State
    if (isUserLoading || isZoneLoading || isVehiclesLoading) return <Loading />;

    // 6. JSX
    return (
        <div className="space-y-6 p-10">
            <PageDetailHeader
                href={`/admin/staff/${staffId}`}
                heading={`Edit Profile: ${user?.name} (${user?.designation})`}
                description={`Update personal and employment details for ${user?.name || "Staff"}.`}
            />

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onUpdateSubmit)} className="space-y-6">

                    {isRoleChanged && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3 text-sm shadow-sm max-w-4xl">
                            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-amber-900">Role Change Detected</p>
                                <p className="mt-1">Changing role from <b className="uppercase">{user.designation}</b> to <b className="uppercase">{selectedRole}</b> will modify assignments automatically.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <FormSelect
                                    name="designation"
                                    label="Designation / Role"
                                    required={true}
                                    options={[
                                        { label: "Rider", value: "RIDER" },
                                        { label: "Manager", value: "MANAGER" }
                                    ]}
                                />
                            </div>
                            <CreateStaffIdentityCard isEditMode={true} />
                        </div>

                        {selectedRole === 'RIDER' && (
                            <div className="w-full">
                                <RiderZoneCard
                                    selectedRole={selectedRole}
                                    zoneOptions={zoneOptions}
                                    vehicleOptions={vehicleOptions}
                                />
                            </div>
                        )}

                        <div className="w-full">
                            <StaffExtraDetails />
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto flex items-end justify-end gap-3 border-t border-slate-200 pt-6">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        
                        {/* Notice how we can trust isDirty again! */}
                        <Button 
                            type="submit" 
                            disabled={isSubmitting || !methods.formState.isValid} 
                            variant="success"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Saving...</>
                            ) : (
                                <><Save className="h-4 w-4 mr-1.5" /> Save Changes</>
                            )}
                        </Button>
                    </div>

                </form>
            </FormProvider>
        </div>
    );
}