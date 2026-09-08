/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react'
import CreateFormHeader from '@/utils/create-formHeader'
import ZoneCreateForm from '@/features/zones/components/zone-create-form'
import { useCreateZone } from '@/features/zones/api/use-zones'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { useRole } from '@/hooks/use-role'
import { ZoneFormValues } from '@/features/zones/schema/create-zone-schema'
const CreateZone = () => {
    const router = useRouter();
    const { branchId } = useRole();
    const { mutate: createZone, isPending } = useCreateZone();

    const onSubmit = (data: ZoneFormValues) => {
        if (!branchId) {
            toast.error("Branch configuration missing.");
            return;
        }

        createZone({
            branchId,
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
        }, {
            onSuccess: () => {
                toast.success(`Zone "${data.name}" created successfully!`);
                router.push("/manage/zones");
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Failed to create zone");
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 p-6">
            <CreateFormHeader
                href="/manage/zones"
                text="Create New Zone"
            />
            <ZoneCreateForm
                onSubmit={onSubmit}
                isPending={isPending}
                submitText="Create Zone"
            />
        </div>
    )
}

export default CreateZone