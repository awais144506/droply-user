import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateItemFormData } from "../schema/create-item.schema";
import { productKeys } from "./product-keys";
import { toast } from "sonner";
import { productApi } from "./product.service";
// 3. Create Product
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateItemFormData) => productApi.createNewProduct(payload),
        onSuccess: () => {
            toast.success(`New product created successfully`)
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.logs() });
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });
}

// 4. Update Product
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: CreateItemFormData }) => productApi.updateProduct(id, data),
        onSuccess: (_, variables) => {
            toast.success(`Product updated successfully`)
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: productKeys.logs() });
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });
}

// 5. Delete Product
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => productApi.deletProduct(id),
        onSuccess: () => {
            toast.success(`Product deleted successfully`)
            queryClient.invalidateQueries({ queryKey: productKeys.all });
            queryClient.invalidateQueries({ queryKey: productKeys.logs() });
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });
}