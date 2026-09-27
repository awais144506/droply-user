"use client";

import { useEffect } from "react";
import { Save } from "lucide-react";
import { editZoneSchema, EditZoneFormValues } from "../../schema/edit-zone-schema";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateZone } from "../../api/use-mutate-zone";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider } from "react-hook-form";
import { useAppForm } from "@/lib/hooks/use-app-form";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";

interface EditZoneDialogProps {
    zone: {
        id: string;
        name: string;
        latitude?: number;
        longitude?: number;
    };
    isOpen: boolean;
    onClose: () => void;
}

export default function EditZoneDialog({ zone, isOpen, onClose }: EditZoneDialogProps) {

    const { mutate: updateZone, isPending } = useUpdateZone();

    const form = useAppForm(editZoneSchema, {
        name: zone.name || "",
        latitude: zone.latitude || null,
        longitude: zone.longitude || null,
    })


    useEffect(() => {
        if (isOpen) {
            form.reset({
                name: zone.name || "",
                latitude: zone.latitude || null,
                longitude: zone.longitude || null,
            });
        }
    }, [isOpen, zone, form.reset, form]);

    const onSubmit = (data: EditZoneFormValues) => {
        updateZone(
            { id: zone.id, data }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const { formState, handleSubmit } = form;
    const { isDirty, isValid } = formState;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-600">Edit Zone</DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                        <FormInput
                            label="Zone Name"
                            required
                            placeholder="e.g. Johar Town Lahore"
                            name="name"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                label="Latitude"
                                type="number"
                                placeholder='e.g. 31.5152'
                                name="latitude"
                            />
                            <FormInput
                                label="Longitude"
                                type="number"
                                placeholder='e.g. 74.2882'
                                name="longitude"
                            />
                        </div>

                        <FormCTAFooter
                            ctaText="Save Changes"
                            isPending={isPending}
                            isValid={isValid}
                            isDirty={isDirty}
                            icon={Save}
                            isCancel={false}
                            isEditMode={true}
                        />
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}