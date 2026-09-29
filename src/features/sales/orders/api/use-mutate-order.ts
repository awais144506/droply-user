import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "./order.service";
import { orderKeys } from "./order-keys";
import { toast } from "sonner";
import { productKeys } from "@/features/manage/products/api/product-keys";
import { zoneKeys } from "@/features/manage/zones/api/zone-keys";
import { customerKeys } from "@/features/manage/customers/api/customer-keys";
import { useRouter } from "next/navigation";

export const useCreateOrder = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: orderService.createOrder,
        onSuccess: (_, variables) => {
            toast.success("Order processed successfully!");
            router.back();
            queryClient.invalidateQueries({
                queryKey: orderKeys.lists()
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