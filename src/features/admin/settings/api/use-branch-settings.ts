/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { displayPakistaniPhone } from "@/lib/utils/functions/setFormat";
import { BranchSettingData } from "../types/settings";
import { branchSettingsKeys } from "./branch-setting-keys";
import { branchSettingApi } from "./branch-settings.service";


export function useBranchSettings(branchId: string) {
  const queryClient = useQueryClient();

  //FETCH BRANCH SETTINGS
  const fetchBranchSettings = useQuery({
    queryKey: branchSettingsKeys.branch(branchId || ""),
    queryFn: () => branchSettingApi.getBranchSettings(branchId),
    select: (settings) => ({
      ...settings,
      displayPhone: settings.displayPhone ? displayPakistaniPhone(settings.displayPhone) : "",
    }),
    enabled: !!branchId,
  });


  //UPDATE BRANCH SETTINGS
  const updateBranchSettings = useMutation({
    mutationFn: async (data: Partial<BranchSettingData>) => {
      return branchSettingApi.updateBranchSettings(branchId, data);
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

  return { fetchBranchSettings, updateBranchSettings };
}