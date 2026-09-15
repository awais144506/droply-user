"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { editZoneSchema, EditZoneFormValues } from "../../schema/edit-zone-schema";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateZone } from "../../api/use-mutate-zone";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider } from "react-hook-form";

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

    const form = useForm<EditZoneFormValues>({
        resolver: yupResolver(editZoneSchema),
        mode: "onChange",
        defaultValues: {
            name: zone.name || "",
            latitude: zone.latitude || null,
            longitude: zone.longitude || null,
        },
    });

    // Reset form when dialog opens with new zone data
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
        }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Edit Zone</DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
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

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="create" disabled={!form.formState.isValid || !form.formState.isDirty || isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}