/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BranchSettingData } from "../types/settings";
import { branchSettingsKeys } from "./branch-setting-keys";
import { branchSettingApi } from "./branch-settings.service";

export function useUpdateBranchSettings(branchId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<BranchSettingData>) => {
      return branchSettingApi.updateBranchSettings(data);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: branchSettingsKeys.branch(branchId || "") });
      const previousSettings = queryClient.getQueryData(branchSettingsKeys.branch(branchId || ""));
      queryClient.setQueryData(branchSettingsKeys.branch(branchId || ""), (old: any) => ({
        ...old,
        ...newData,
      }));
      return { previousSettings };
    },
    onError: (error: any, newData, context: any) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(branchSettingsKeys.branch(branchId || ""), context.previousSettings);
      }
      console.error("Settings Update Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update settings. Please try again."
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: branchSettingsKeys.branch(branchId || ""),
      });
    },
    onSuccess: () => {
      toast.success("Branch settings updated successfully!");
    },
  });
}