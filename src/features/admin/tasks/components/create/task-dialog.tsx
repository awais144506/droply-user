"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";
import { FormInput } from "@/components/ui/form-input";

import { createTaskSchema, CreateTaskFormValues } from "../../schema/tasks-schema";
import { useCreateTask, useUpdateTask } from "../../api/use-mutate-tasks";
import { Task } from "../../types/task";

interface TaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    branchId: string;
    staffList?: { label: string; value: string }[];
    initialData: Task | null;
}

export function TaskDialog({ isOpen, onClose, branchId, staffList = [], initialData }: TaskDialogProps) {
    const { mutate: createTask, isPending: isCreating } = useCreateTask(branchId);
    const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(branchId);

    const isEditing = !!initialData;
    const isPending = isCreating || isUpdating;

    const form = useForm<CreateTaskFormValues>({
        resolver: yupResolver(createTaskSchema),
        mode: "onChange",
        defaultValues: {
            branchId: branchId,
            description: "",
            assignedToId: "",
        },
    });

    // Reset form state when the dialog opens or switches modes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.reset({
                    branchId: initialData.branchId,
                    description: initialData.description,
                    assignedToId: initialData.assignedToId,
                });
            } else {
                form.reset({
                    branchId: branchId,
                    description: "",
                    assignedToId: "",
                });
            }
        }
    }, [isOpen, initialData, branchId, form]);

    const onSubmit = (data: CreateTaskFormValues) => {
        if (isEditing && initialData) {
            updateTask(
                {
                    id: initialData.id,
                    payload: { description: data.description }
                },
                { onSuccess: onClose }
            );
        } else {
            createTask(data, { onSuccess: onClose });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-112.5 bg-white rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl text-slate-900 font-bold">
                        {isEditing ? "Edit Task" : "Assign New Task"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 text-sm">
                        {isEditing
                            ? "Update the details of the selected operation."
                            : "Delegate a new operation to a manager or rider."}
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">

                        <FormSelect
                            name="assignedToId"
                            label="Assign To"
                            options={staffList}
                            placeholder="Select staff member..."
                            disabled={isEditing || isPending}
                            isSearchable
                            required
                            formatOptionLabel={(opt) => (
                                <div className="flex items-center justify-between w-full pr-1 py-0.5">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900 text-sm leading-tight">
                                            {opt.label}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                                            {opt.phone}
                                        </span>
                                    </div>
                                    <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${opt.role === "MANAGER" ? "text-sky-700 bg-sky-50" : "text-amber-700 bg-amber-50"}`}>
                                        {opt.role}
                                    </span>
                                </div>
                            )}
                        />

                        <FormInput
                            name="description"
                            label="Task Description"
                            placeholder="e.g. Deliver replacement parts to warehouse A"
                            required
                            disabled={isPending}
                        />

                        <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isPending}
                                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending || (!form.formState.isDirty && !isEditing)}
                                className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-sm"
                            >
                                {isPending ? "Saving..." : isEditing ? "Update Task" : "Assign Task"}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}