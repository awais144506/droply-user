import { useQuery } from "@tanstack/react-query";
import { branchSettingsKeys } from "./branch-setting-keys";
import { branchSettingApi } from "./branch-settings.service";

export function useBranchSettings(branchId?: string) {
  return useQuery({
    queryKey: branchSettingsKeys.branch(branchId || ""),
    queryFn: () => branchSettingApi.getBranchSettings(),
    enabled: Boolean(branchId),
    staleTime: 5 * 60 * 1000,
  });
}