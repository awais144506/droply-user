/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateItemFormData } from "../schema/create-item.schema";
import { productKeys } from "./product-keys";
import { toast } from "sonner";
import { productApi } from "./product.service";
import { useRouter } from "next/navigation";

// 3. Create Product
export function useCreateProduct() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (payload: CreateItemFormData) => productApi.createNewProduct(payload),
        onSuccess: (createdProduct) => {
            toast.success(`Product "${createdProduct?.name || 'New product'}" created successfully`);
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.logs() });
            router.back();
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || "Failed to create product";
            toast.error(message);
        }
    });
}

// 4. Update Product
export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateItemFormData> }) =>
            productApi.updateProduct(id, data),
        onSuccess: (updatedProduct, variables) => {
            toast.success(`Product "${updatedProduct?.name || ''}" updated successfully`);
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: productKeys.logs() });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || "Failed to update product";
            toast.error(message);
        }
    });
}

// 5. Toggle Product Active Status
export function useToggleProductStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => productApi.toggleProductStatus(id),
        onSuccess: (updatedProduct, id) => {
            const statusLabel = updatedProduct?.isActive ? "activated" : "deactivated";
            toast.success(`Product ${statusLabel} successfully`);
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: productKeys.logs() });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || "Failed to update product status";
            toast.error(message);
        }
    });
}

// 6. Delete Product
export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => productApi.deleteProduct(id),
        onSuccess: () => {
            toast.success("Product deleted successfully");
            queryClient.invalidateQueries({ queryKey: productKeys.all });
            queryClient.invalidateQueries({ queryKey: productKeys.logs() });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || "Failed to delete product";
            toast.error(message);
        }
    });
}