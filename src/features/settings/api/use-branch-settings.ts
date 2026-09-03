import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as yup from "yup";

export const branchSettingsSchema = yup.object().shape({
  branchName: yup.string().required("Branch name is required"),
  phone: yup.string().matches(/^[0-9+\-\s()]*$/, "Invalid phone number format").required("Phone number is required"),
  email: yup.string().email("Must be a valid email address").required("Email is required"),
  address: yup.string().required("Address is required"),
});

export type BranchSettingsData = yup.InferType<typeof branchSettingsSchema>;

export function useBranchSettings(branchId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["branch-settings", branchId],
    queryFn: async (): Promise<BranchSettingsData> => {
      // Mock data fetching
      return {
        branchName: "Al-Madina Pure Drinking Water",
        phone: "+92 300 1234567",
        email: "billing@almadinawater.com",
        address: "123 Main Commercial Area, Sahiwal, Punjab",
      };
    },
    enabled: Boolean(branchId),
  });

  const mutation = useMutation({
    mutationFn: async (data: BranchSettingsData) => {
      // Mock API call to update localized branch settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast.success("Branch settings updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["branch-settings", branchId] });
    },
    onError: () => {
      toast.error("Failed to update branch settings.");
    }
  });

  return { query, mutation };
}