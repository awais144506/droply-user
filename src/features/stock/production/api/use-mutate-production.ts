import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productionService } from "./production.service";
import { productionKeys } from "./production-keys";
import { toast } from "sonner"; // Or your preferred toast library

export const useMutateProduction = (branchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productionService.create,
    onSuccess: () => {
      toast.success("Production batch logged successfully!");
      queryClient.invalidateQueries({
        queryKey: productionKeys.lists(branchId),
      });
    },
    onError: (error) => {
      const message =
        error.message || "Failed to log production batch.";
      toast.error(typeof message === "string" ? message : message[0]);
    },
  });
};