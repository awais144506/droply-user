/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { displayPakistaniPhone, formatPakistaniPhone } from "@/utils/setFormat";

export const settingsKeys = {
  all: ["settings"] as const,
  branch: (branchId: string) => [...settingsKeys.all, "branch", branchId] as const,
};

export interface BranchSettingData {
  id?: string;
  displayName?: string;
  displayPhone?: string;
  displayEmail?: string;
  displayAddress?: string;
  logoUrl?: string;
  branchId?: string;
}

export function useBranchSettings(branchId?: string | null) {
  const queryClient = useQueryClient();

  // 1. Fetch Query: Format FOR the UI
  const query = useQuery({
    queryKey: settingsKeys.branch(branchId || ""),
    queryFn: async (): Promise<BranchSettingData> => {
      const response = await apiClient.get(`/settings/branch/${branchId}`);
      const data = response;

      // Format the phone number nicely before the UI sees it
      return {
        ...data,
        displayPhone: data.displayPhone ? displayPakistaniPhone(data.displayPhone) : "",
      };
    },
    enabled: !!branchId,
  });

  // 2. Update Mutation: Format FOR the Database
  const mutation = useMutation({
    mutationFn: async (data: Partial<BranchSettingData>) => {
      const payloadToSave = {
        displayName: data.displayName,
        displayEmail: data.displayEmail,
        displayAddress: data.displayAddress,
        logoUrl: data.logoUrl,
        displayPhone: data.displayPhone ? formatPakistaniPhone(data.displayPhone) : undefined,
      };
      if (payloadToSave.displayPhone) {
        payloadToSave.displayPhone = formatPakistaniPhone(payloadToSave.displayPhone);
      }
      const response = await apiClient.patch(`/settings/branch/${branchId}`, payloadToSave);
      return response;
    },
    onSuccess: () => {
      toast.success("Branch settings updated successfully!");
      queryClient.invalidateQueries({
        queryKey: settingsKeys.branch(branchId || ""),
      });
    },
    onError: (error: any) => {
      console.error("Settings Update Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update settings. Please try again."
      );
    },
  });

  return { query, mutation };
}