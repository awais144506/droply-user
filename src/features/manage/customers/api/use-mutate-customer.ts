/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCustomerFormData } from "../schema/create-customer.schema";
import { customerKeys } from "./customer-keys";
import { customerApi } from "./customer.service";
import { toast } from "sonner";
import { zoneKeys } from "../../zones/api/zone-keys";
import { useRouter } from "next/navigation";
import { CustomerStatus } from "../types/customer";

// 1. Create Customer
export function useCreateCustomer(branchId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCustomer: CreateCustomerFormData) =>
      customerApi.createNewCustomer(newCustomer),
    onSuccess: (_, variables) => {
      toast.success("Customer Created", {
        description: `${variables.name} customer created successfully`,
      });
      queryClient.invalidateQueries({
        queryKey: customerKeys.branchList(branchId),
      });
      queryClient.invalidateQueries({ queryKey: customerKeys.logs() });
      queryClient.invalidateQueries({ queryKey: zoneKeys.all });

      router.back();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create customer.");
    },
  });
}

// 2. Update Customer
export function useUpdateCustomer() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateCustomerFormData>;
    }) => customerApi.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      toast.success("Customer Updated", {
        description: `${variables.data.name || "Customer"} updated successfully`,
      });
      router.back();
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: customerKeys.logs() });
      queryClient.invalidateQueries({ queryKey: zoneKeys.all });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update customer.");
    },
  });
}

// 3. Toggle Customer Status (ACTIVE <-> BLOCKED)
export function useToggleCustomerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status?: CustomerStatus;
    }) => customerApi.toggleCustomerStatus(id, status),
    onSuccess: (updatedCustomer, variables) => {
      const newStatus = updatedCustomer?.status || variables.status;
      toast.success(
        newStatus === "BLOCKED" ? "Customer Blocked" : "Customer Activated",
        {
          description: `${updatedCustomer?.name || "Customer"} is now ${newStatus?.toLowerCase()}.`,
        },
      );
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: customerKeys.logs() });
      queryClient.invalidateQueries({ queryKey: zoneKeys.all });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update customer status.");
    },
  });
}

// 4. Delete Customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      toast.success("Customer Deleted", {
        description: "Selected customer deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.invalidateQueries({ queryKey: zoneKeys.all });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete customer.");
    },
  });
}

export function useMarkCustomerRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => customerApi.markRequest(id),
    onSuccess: () => {
      toast.success("Request Processed", {
        description: "Customer request has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to process customer request.");
    },
  });
}