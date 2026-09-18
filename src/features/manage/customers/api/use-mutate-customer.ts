/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCustomerFormData } from "../schema/create-customer.schema";
import { customerKeys } from "./customer-keys";
import { customerApi } from "./customer.service";
import { toast } from "sonner";
import { formatCustomerPayload } from "../utils/formatCustomerPayload";
import { zoneKeys } from "../../zones/api/zone-keys";

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
          status: "ACTIVE",
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
        queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateCustomerFormData> }) => customerApi.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      toast.success("Customer updated successfully");
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.logs() });
      queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
    },
    onError: (err) => {
      toast.error(err.message)
    },
  });
}

// 6. Delete Customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      toast.success("Customer deleted successfully");
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: (err) => {
      toast.success(err.message);
    }
  });
}
