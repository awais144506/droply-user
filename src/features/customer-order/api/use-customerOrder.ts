import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerOrderRequest } from "./customerOrder.service";
import { customerRequestKeys } from "./customerOrder-keys";
import { CustomerOrderFormValues } from "../schema/order.schema";
import { toast } from "sonner"

// 1. Fetch Portal Data
export const useCustomerPortalData = (token: string) => {
    return useQuery({
        queryKey: customerRequestKeys.token(token),
        enabled: !!token,
        queryFn: () => customerOrderRequest.getAllOrders(token),
    });
};

// 2. Submit New Order Request
export const useSubmitOrderRequest = (token: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CustomerOrderFormValues) =>
            customerOrderRequest.createNewOrder(token, payload),
        onSuccess: () => {
            toast.success("Order request has been sent to branch")
            queryClient.invalidateQueries({
                queryKey: customerRequestKeys.token(token)
            });
        },
        onError: (err) => {
            toast.error(err.message)
        }
    });
};