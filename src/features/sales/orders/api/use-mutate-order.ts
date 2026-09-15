import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "./order.service";
import { orderKeys } from "./order-keys";
import { toast } from "sonner"; // Or react-hot-toast

export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: orderService.createOrder,
        onSuccess: (data) => {
            toast.success("Order processed successfully!");
            queryClient.invalidateQueries({ 
                queryKey: orderKeys.lists() 
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "An error occurred during checkout.");
        }
    });
};