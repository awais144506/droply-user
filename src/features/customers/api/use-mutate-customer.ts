/* eslint-disable @typescript-eslint/no-explicit-any */
// 4. Create Customer
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { CreateCustomerFormData } from "../schema/create-customer.schema";
import { customerKeys } from "./customer-keys";
import { customerApi } from "./customer.service";
import { toast } from "sonner";
import { formatCustomerPayload } from "../utils/formatCustomerPayload";
import { formatPakistaniPhone } from "@/utils/setFormat";

type CreateCustomerPayload = ReturnType<typeof formatCustomerPayload>;

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCustomer: CreateCustomerPayload) =>
      customerApi.createNewCustomer(newCustomer),

    onMutate: async (newCustomer) => {
      const queryKey = customerKeys.branchList(newCustomer.branchId);
      await queryClient.cancelQueries({ queryKey });
      const previousCustomers = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any[]) => {
        const optimisticCustomer = {
          id: `temp-${Date.now()}`,
          ...newCustomer,
          status: "ACTIVE", // Default status
          returnablesLength: newCustomer.returnables?.length || 0,
          createdAt: new Date().toISOString(),
        };
        return old ? [optimisticCustomer, ...old] : [optimisticCustomer];
      });
      return { previousCustomers, queryKey };
    },

    onError: (err, newCustomer, context) => {
      if (context?.previousCustomers) {
        queryClient.setQueryData(context.queryKey, context.previousCustomers);
      }
      toast.error(err.message);
    },

    onSettled: (data, error, variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
        queryClient.invalidateQueries({ queryKey: customerKeys.logs() });
      }
    },
    onSuccess: () => {
      toast.success("Customer created successfully");
    },
  });
}

// 5. Update Customer
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateCustomerFormData> }) => {
      const formattedData = { ...data };

      // Format phone if it's being updated
      if (formattedData.phone) {
        formattedData.phone = formatPakistaniPhone(formattedData.phone);
      }

      return apiClient.patch(`/customer/${id}`, formattedData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
    },
  });
}

// 6. Delete Customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/customer/${id}`);
    },
    onSuccess: () => {
      // Wipes the cache so UI refreshes automatically
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}
