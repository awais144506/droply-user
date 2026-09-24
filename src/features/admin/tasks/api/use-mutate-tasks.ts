import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "./tasks.service";
import { tasksKeys } from "./tasks-keys";
import { toast } from "sonner";

export const useCreateTask = (branchId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tasksService.create,
        onSuccess: () => {
            toast.success("Task assigned successfully");
            // Refetch all tasks for this branch to update the lists
            queryClient.invalidateQueries({ queryKey: tasksKeys.lists(branchId) });
        },
        onError: (error) => {
            const msg = error.message || "Failed to assign task";
            toast.error(typeof msg === "string" ? msg : msg[0]);
        },
    });
};

export const useUpdateTask = (branchId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tasksService.update,
        // We let the frontend components handle the success toasts for toggling 
        // to keep it feeling instantaneous, but we invalidate the cache to ensure sync.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tasksKeys.lists(branchId) });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to update task");
        },
    });
};