/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useParams } from "next/navigation";
import PageDetailHeader from "@/lib/utils/components/PageDetailHeader";
import { CreateStaffForm } from "@/features/admin/staff/components/create/StaffForm";
import { useStaffDetail } from "@/features/admin/staff/api/use-staff";
import { useUpdateStaff } from "@/features/admin/staff/api/use-mutate-staff";
import { useRole } from "@/lib/hooks/use-role";
import Loading from "@/app/loading";
import NotFoundPage from "@/app/not-found";
import { getEditStaffFormValues } from "@/features/admin/staff/utils/staff-defaults";
import { useZones } from "@/features/manage/zones/api/use-zones";
import { useVehicles } from "@/features/admin/fleet/api/use-fleet";

export default function EditStaffPage() {
    const router = useRouter();
    const params = useParams();
    const staffId = params.staffId as string;
    const { branchId } = useRole();

    const { data: user, isLoading, isError, } = useStaffDetail(branchId, staffId);
    const { mutate: updateStaff, isPending: isUpdating } = useUpdateStaff();
    // Data Fetching
    const { data: zoneData, isLoading: isZoneLoading } = useZones(branchId);
    const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles(branchId);

    const zoneOptions = zoneData?.zoneOptions;
    const vehicleOptions = vehiclesData?.vehicleOptions;

    const initialValues = getEditStaffFormValues(user);

    const onUpdateSubmit = (data: any) => {
        updateStaff(
            { id: staffId, data },
            { onSuccess: () => router.back() }
        );
    };

    if (isLoading || !user) return <Loading text="Loading Staff Profile..." />;
    if (isError) return <NotFoundPage />;

    return (
        <div className="space-y-6 p-6 sm:p-10">
            <PageDetailHeader
                heading={`Edit Profile: ${user.name} (${user.role})`}
                description={`Update personal and employment details for ${user.name}.`}
                breadcrumbs={[
                    { label: "Staff", href: "/admin/staff" },
                    { label: user.name, href: `/admin/staff/${staffId}` },
                    { label: "Edit Profile" },
                ]}
            />

            <CreateStaffForm
                initialValues={initialValues}
                zoneOptions={zoneOptions}
                isZoneLoading={isZoneLoading}
                vehicleOptions={vehicleOptions}
                isVehiclesLoading={isVehiclesLoading}
                onSubmit={onUpdateSubmit}
                isPending={isUpdating}
            />
        </div>
    );
}