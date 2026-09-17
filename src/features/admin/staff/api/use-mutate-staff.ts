// api/use-mutate-staff.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffKeys } from "./staff-keys";
import { toast } from "sonner"
import { staffApi, CreateStaffPayload } from "./staff.service";

export function useCreateStaff(branchId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateStaffPayload) => staffApi.createNewStaff(payload),
        onSuccess: () => {
            toast.success("New staff created successfully")
            queryClient.invalidateQueries({
                queryKey: staffKeys.branchList(branchId),
            });
            queryClient.invalidateQueries({
                queryKey: staffKeys.logs(branchId),
            });
        },
        onError: (err) => {
            toast.error(err.message)
        },
    });
}

// api/use-mutate-staff.ts
export function useStaffDisable(id: string, branchId: string, onCloseModal: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => staffApi.disableStaff(id),
        onSuccess: () => {
            toast.success("Staff member disabled successfully");
            queryClient.invalidateQueries({
                queryKey: staffKeys.branchList(branchId),
            });
            queryClient.invalidateQueries({
                queryKey: staffKeys.logs(branchId),
            });
            queryClient.invalidateQueries({
                queryKey: staffKeys.detail(id),
            });
            onCloseModal();
        },
        onError: (err) => {
            toast.error(err.message || "Failed to disable staff member");
            onCloseModal();
        },
    });
}

export function useStaffEnable(id: string, branchId: string, onCloseModal: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => staffApi.enableStaff(id),
        onSuccess: () => {
            toast.success("Staff member enabled successfully");
            queryClient.invalidateQueries({
                queryKey: staffKeys.branchList(branchId),
            });
            queryClient.invalidateQueries({
                queryKey: staffKeys.logs(branchId),
            });
            queryClient.invalidateQueries({
                queryKey: staffKeys.detail(id),
            });
            onCloseModal();
        },
        onError: (err) => {
            toast.error(err.message || "Failed to enable staff member");
            onCloseModal();
        },
    });
}