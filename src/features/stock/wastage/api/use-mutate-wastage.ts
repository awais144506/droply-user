import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wastageService } from "./wastage.service";
import { wastageKeys } from "./wastage-keys";
import { productKeys } from "@/features/manage/products/api/product-keys";
import { toast } from "sonner";
import { CreateWastageFormValues } from "../schema/create-wastage-schema";
import { useRouter } from "next/navigation";

export const useCreateWastage = (branchId: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateWastageFormValues) =>
            wastageService.create({ ...payload, branchId }),
        onSuccess: () => {
            toast.success("Wastage logged successfully.");
            router.back();
            queryClient.invalidateQueries({
                queryKey: wastageKeys.lists(branchId),
            });
            queryClient.invalidateQueries({
                queryKey: productKeys.lists(),
            });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useDeleteWastage = (branchId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => wastageService.delete(id),
        onSuccess: () => {
            toast.success("Wastage record removed and stock refunded.");
            queryClient.invalidateQueries({
                queryKey: wastageKeys.lists(branchId),
            });
            queryClient.invalidateQueries({
                queryKey: productKeys.lists(),
            });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};