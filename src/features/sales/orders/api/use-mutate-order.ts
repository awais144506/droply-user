import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "./order.service";
import { orderKeys } from "./order-keys";
import { toast } from "sonner";
import { productKeys } from "@/features/manage/products/api/product-keys";
import { zoneKeys } from "@/features/manage/zones/api/zone-keys";
import { customerKeys } from "@/features/manage/customers/api/customer-keys";
import { OrderFormValues } from "../schema/create-order-schema";
import { useRouter } from "next/navigation";
import { OrderStatus } from "../types/order";

export const useCreateOrder = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: orderService.createOrder,
        onSuccess: (_, variables) => {
            toast.success("Order processed successfully!");
            router.back();
            queryClient.invalidateQueries({
                queryKey: orderKeys.all
            });
            queryClient.invalidateQueries({
                queryKey: productKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: zoneKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: customerKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: customerKeys.detail(variables.customerId)
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "An error occurred during checkout.");
        }
    });
};

export const useUpdateOrder = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { id: string } & OrderFormValues) => orderService.updateOrder(data),
        onSuccess: (_, variables) => {
            toast.success("Order adjusted successfully!");
            router.back();
            queryClient.invalidateQueries({
                queryKey: orderKeys.all
            });
            queryClient.invalidateQueries({
                queryKey: productKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: zoneKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: customerKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: customerKeys.detail(variables.customerId)
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "An error occurred while updating the order.");
        }
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
            orderService.updateOrderStatus({ id, status }),
        onSuccess: (_, variables) => {
            toast.success(`Order status updated to ${variables.status}!`);
            queryClient.invalidateQueries({
                queryKey: orderKeys.all,
            });
            queryClient.invalidateQueries({
                queryKey: customerKeys.lists(),
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update order status.");
        },
    });
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => orderService.cancelOrder(id),
        onSuccess: () => {
            toast.success("Order cancelled successfully!");
            queryClient.invalidateQueries({
                queryKey: orderKeys.all
            });
            queryClient.invalidateQueries({
                queryKey: productKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: zoneKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: customerKeys.all
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to cancel order.");
        },
    });
};