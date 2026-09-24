/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { FormSelect } from "@/components/ui/form-select";
import { createTaskSchema, CreateTaskFormValues } from "../../schema/tasks-schema";
import { useCreateTask, useUpdateTask } from "../../api/use-mutate-tasks";
import { Task } from "../../types/task";

interface TaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    branchId: string;
    staffList: { label: string; value: string }[]; // Updated to expect the pre-mapped array
    initialData?: Task | null;
}

export function TaskDialog({ isOpen, onClose, branchId, staffList = [], initialData }: TaskDialogProps) {
    const isEdit = !!initialData;
    const { mutateAsync: createTask } = useCreateTask(branchId);
    const { mutateAsync: updateTask } = useUpdateTask(branchId);

    const methods = useForm<CreateTaskFormValues>({
        resolver: yupResolver(createTaskSchema),
        defaultValues: {
            description: "",
            assignedToId: "",
            assignedToName: "",
            assignedToRole: "MANAGER", // Default, gets overwritten on submit
        },
    });

    // Reset form when modal opens/closes or initialData changes
    useEffect(() => {
        if (isOpen) {
            methods.reset({
                description: initialData?.description || "",
                assignedToId: initialData?.assignedToId || "",
                assignedToName: initialData?.assignedToName || "",
                assignedToRole: initialData?.assignedToRole || "MANAGER",
            });
        }
    }, [isOpen, initialData, branchId, methods.reset, methods]);

    const onSubmit = async (data: CreateTaskFormValues) => {
        try {
            if (isEdit) {
                // Only update description for existing tasks (status is handled on the table)
                await updateTask({ id: initialData.id, payload: { description: data.description } });
            } else {
                // Find the selected option using the value (ID)
                const selectedStaff = staffList.find((s) => s.value === data.assignedToId);
                
                // Extract the name from the label (e.g., "Muhammad Awais (0311...)" -> "Muhammad Awais")
                const extractedName = selectedStaff ? selectedStaff.label.split(" (")[0] : "Unknown";

                await createTask({
                    ...data,
                    assignedToName: extractedName,
                    assignedToRole: "MANAGER", // Fallback, update if roles are added to options
                });
            }
            onClose();
        } catch (error) {
            // Error handled by the mutation hook's Sonner toast
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">
                        {isEdit ? "Edit Task Details" : "Assign New Task"}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="p-6 space-y-6 overflow-y-auto">
                        {/* ASSIGNEE SELECT (Disabled in edit mode to preserve task integrity) */}
                        <div className={isEdit ? "opacity-60 pointer-events-none" : ""}>
                            <FormSelect
                                name="assignedToId"
                                label="Assign To"
                                options={staffList} // Pass the array directly now
                                placeholder="Select staff member..."
                            />
                            {/* Hidden inputs to satisfy the schema before submit override */}
                            <input type="hidden" {...methods.register("assignedToName")} />
                            <input type="hidden" {...methods.register("assignedToRole")} />
                        </div>

                        {/* TASK DESCRIPTION TEXTAREA */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Task Details
                            </label>
                            <textarea
                                {...methods.register("description")}
                                placeholder="e.g., Audit daily cash collection from Route A..."
                                className="w-full h-32 px-3 py-2 text-sm text-slate-900 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none transition-colors border-slate-200"
                            />
                            {methods.formState.errors.description && (
                                <p className="mt-1 text-xs text-rose-500">{methods.formState.errors.description.message}</p>
                            )}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={onClose} className="border-slate-200 text-slate-600">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={methods.formState.isSubmitting} className="bg-sky-600 hover:bg-sky-700 text-white min-w-30">
                                {methods.formState.isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                                ) : isEdit ? (
                                    "Update Task"
                                ) : (
                                    "Assign Task"
                                )}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}