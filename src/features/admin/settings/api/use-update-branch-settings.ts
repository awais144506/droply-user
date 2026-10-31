/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BranchSettingData } from "../types/settings";
import { branchSettingsKeys } from "./branch-setting-keys";
import { branchSettingApi } from "./branch-settings.service";
import { useRouter } from "next/navigation";

export function useUpdateBranchSettings(branchId?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: Partial<BranchSettingData>) => {
      return branchSettingApi.updateBranchSettings(data);
    },
    onError: (error: any, context: any) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(branchSettingsKeys.branch(branchId || ""), context.previousSettings);
      }
      console.error("Settings Update Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update settings. Please try again."
      );
    },
    onSuccess: () => {
      toast.success("Branch settings updated successfully!");
      queryClient.invalidateQueries({
        queryKey: branchSettingsKeys.branch(branchId || ""),
      });
      router.refresh();
    },
  });
}