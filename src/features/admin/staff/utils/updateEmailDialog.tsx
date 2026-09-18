import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const staffEmailUpdateSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
});

export type updateStaffEmailValue = yup.InferType<typeof staffEmailUpdateSchema>;

type Props = {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    userEmail: string;
    onUpdateSubmit: (data: updateStaffEmailValue) => void;
    isSubmitting: boolean
}

const UpdateStaffEmailDialog = ({
    isOpen,
    onClose,
    userName,
    userEmail,
    onUpdateSubmit,
    isSubmitting
}: Props) => {
    const methods = useForm<updateStaffEmailValue>({
        resolver: yupResolver(staffEmailUpdateSchema),
        mode: "onChange",
        defaultValues: {
            email: userEmail || ""
        }
    });

    useEffect(() => {
        methods.reset({ email: userEmail || "" });
    }, [userEmail, isOpen, methods]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onUpdateSubmit)} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Update Staff Email</DialogTitle>
                            <DialogDescription>
                                Modify the primary login email for <span className="font-semibold text-slate-900">{userName}</span>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-2">
                            <FormInput
                                label="Email (Login ID)"
                                name="email"
                                placeholder="awais786@droply.com"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="create"
                                disabled={isSubmitting || !methods.formState.isValid || !methods.formState.isDirty}
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateStaffEmailDialog;