import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supplierApi } from "./supplier.service";
import { supplierKeys } from "./supplier-keys";
import { SupplierFormData } from "../schema/create-supplier-schema";

export function useCreateSupplier() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SupplierFormData) => supplierApi.create(payload),
        onSuccess: () => {
            toast.success("Supplier created successfully");
            queryClient.invalidateQueries({ queryKey: supplierKeys.all });
        },
        onError: (err) => {
            toast.error("Creation Failed", { description: err.message });
        }
    });
}

export function useUpdateSupplier() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: SupplierFormData }) =>
            supplierApi.update(id, data),
        onSuccess: (_, variables) => {
            toast.success("Supplier updated successfully");
            queryClient.invalidateQueries({ queryKey: supplierKeys.all });
            queryClient.invalidateQueries({ queryKey: supplierKeys.detail(variables.id) });
        },
        onError: (err) => {
            toast.error("Update Failed", { description: err.message });
        }
    });
}

export function useDeleteSupplier() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => supplierApi.delete(id),
        onSuccess: () => {
            toast.success("Supplier deleted successfully");
            queryClient.invalidateQueries({ queryKey: supplierKeys.all });
        },
        onError: (err) => {
            toast.error("Deletion Failed", { description: err.message });
        }
    });
}