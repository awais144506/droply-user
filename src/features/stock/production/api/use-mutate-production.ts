/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productionService } from "./production.service";
import { productionKeys } from "./production-keys";
import { toast } from "sonner"; // Or your preferred toast library
import { productKeys } from "@/features/manage/products/api/product-keys";
import { useRouter } from "next/navigation";
import { wastageKeys } from "../../wastage/api/wastage-keys";

export const useMutateProduction = (branchId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productionService.create,
    onSuccess: () => {
      router.back();
      toast.success("Production batch logged successfully!");
      queryClient.invalidateQueries({
        queryKey: productionKeys.lists(branchId),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
    onError: (error) => {
      const message =
        error.message || "Failed to log production batch.";
      toast.error(typeof message === "string" ? message : message[0]);
    },
  });
};

export const useUpdateProduction = (branchId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    // Assuming your productionService has an update method
    mutationFn: ({ id, ...bodyPayload }: { id: string; supervisorName?: string; productionDate?: string }) =>
      productionService.update(id, bodyPayload),
    onSuccess: (_, variables) => {
      router.back();
      toast.success("Production batch updated successfully!");
      queryClient.invalidateQueries({
        queryKey: productionKeys.lists(branchId),
      });
      queryClient.invalidateQueries({
        queryKey: productionKeys.batch(variables.id),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteProduction = (branchId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productionService.remove(id),
    onSuccess: () => {
      router.back();
      toast.success("Batch deleted and raw materials refunded.");
      queryClient.invalidateQueries({
        queryKey: productionKeys.lists(branchId),
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

export const useFinalizeProduction = (branchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; actualYield: number; wastage: any[] }) =>
      productionService.finalize(id, payload),
    onSuccess: () => {
      toast.success("Batch finalized and added to stock successfully!");
      queryClient.invalidateQueries({
        queryKey: productionKeys.lists(branchId),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
        queryClient.invalidateQueries({
        queryKey: wastageKeys.lists(branchId),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};