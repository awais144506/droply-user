"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { editZoneSchema, EditZoneFormValues } from "../schema/edit-zone-schema";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoneDetails } from "../types";
import { useUpdateZone } from "../api/use-zones";
import { toast } from "sonner"
import { FormInput } from "@/components/ui/form-input";

interface EditZoneDialogProps {
    zone: ZoneDetails;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditZoneDialog({ zone, isOpen, onClose }: EditZoneDialogProps) {

    const { mutate: updateZone, isPending } = useUpdateZone();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<EditZoneFormValues>({
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
            reset({
                name: zone.name || "",
                latitude: zone.latitude || null,
                longitude: zone.longitude || null,
            });
        }
    }, [isOpen, zone, reset]);

    const onSubmit = (data: EditZoneFormValues) => {
        updateZone(
            { id: zone.id, data },
            {
                onSuccess: () => {
                    toast.success("Zone updated successfully");
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <FormInput
                        label="Zone Name"
                        required
                        placeholder="e.g. Johar Town Lahore"
                        register={register("name")}
                        error={errors.name?.message}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="Latitude"
                            type="number"
                            placeholder='e.g. 31.5152'
                            register={register("latitude")}
                            error={errors.latitude?.message}
                        />
                        <FormInput
                            label="Longitude"
                            type="number"
                            placeholder='e.g. 74.2882'
                            register={register("longitude")}
                            error={errors.longitude?.message}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="create" disabled={!isValid || isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}