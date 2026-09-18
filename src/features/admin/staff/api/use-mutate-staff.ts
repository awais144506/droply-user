/* eslint-disable react-hooks/rules-of-hooks */
// api/use-mutate-staff.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffKeys } from "./staff-keys";
import { toast } from "sonner"
import { staffApi, CreateStaffPayload } from "./staff.service";
import { updateStaffEmailValue } from "../utils/updateEmailDialog";
import { UpdateStaffFormData } from "@/features/admin/staff/schema/update-staff-schema";
import { zoneKeys } from "@/features/manage/zones/api/zone-keys";

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

export function useUpdateStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStaffFormData }) =>
            staffApi.updateStaff(id, data),

        onSuccess: (updatedStaff, variables) => {
            // 1. Invalidate the specific staff member's detail cache
            queryClient.invalidateQueries({
                queryKey: staffKeys.detail(variables.id),
            });

            // 2. Invalidate the branch list and logs to ensure the table and logs update immediately
            if (updatedStaff?.branchId) {
                queryClient.invalidateQueries({
                    queryKey: staffKeys.branchList(updatedStaff.branchId),
                });
                queryClient.invalidateQueries({
                    queryKey: staffKeys.logs(updatedStaff.branchId),
                });
                queryClient.invalidateQueries({
                    queryKey: zoneKeys.details(),
                });
            }

            toast.success("Staff profile updated successfully!");
        },
        onError: (error) => {
            toast.error("Update Failed", {
                description: error.message
            });
        }
    });
}

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

export function updateStaffEmail(branchId: string, onCloseModal: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: updateStaffEmailValue }) =>
            staffApi.updateStaffEmail(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: staffKeys.branchList(branchId),
            });
            queryClient.invalidateQueries({
                queryKey: staffKeys.logs(branchId),
            });
            queryClient.invalidateQueries({
                queryKey: staffKeys.detail(variables.id),
            });
            onCloseModal();
        },
        onError: (err) => {
            toast.error(err.message)
        }
    });
}