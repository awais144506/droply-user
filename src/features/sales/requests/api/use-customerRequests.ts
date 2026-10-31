/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { CustomerOrderRequest } from "../types/requests";
import { customerRequestKeys } from "./keys";

const API = "/request/user";


export const useCustomerRequests = (branchId?: string, search?: string, status?: string, date?: string) => {
    return useQuery({
        queryKey: customerRequestKeys.list(branchId, search, status, date),
        queryFn: async (): Promise<CustomerOrderRequest[]> => {
            return await apiClient.get("/request/user", {
                params: {
                    search: search || undefined,
                    status: status || undefined,
                    date: date || undefined,
                },
            });
        },
        enabled: !!branchId,
    });
};

// --- 3. MUTATION HOOKS (PATCH /request/user/:id/status) ---
export const useApproveCustomerRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (requestId: string) => {
            return await apiClient.patch(`${API}/${requestId}/status`, {
                status: "ACCEPTED",
            });
        },
        onSuccess: () => {
            toast.success("Order request approved and moved to active queue!");
            queryClient.invalidateQueries({ queryKey: customerRequestKeys.all });
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.message || err?.message || "Failed to approve order request.";
            toast.error(msg);
        },
    });
};

export const useRejectCustomerRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (requestId: string) => {
            return await apiClient.patch(`${API}/${requestId}/status`, {
                status: "CANCELLED",
            });
        },
        onSuccess: () => {
            toast.success("Order request has been rejected.");
            queryClient.invalidateQueries({ queryKey: customerRequestKeys.all });
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.message || err?.message || "Failed to reject order request.";
            toast.error(msg);
        },
    });
};