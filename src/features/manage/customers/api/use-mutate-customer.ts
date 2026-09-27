import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCustomerFormData } from "../schema/create-customer.schema";
import { customerKeys } from "./customer-keys";
import { customerApi } from "./customer.service";
import { toast } from "sonner";
import { zoneKeys } from "../../zones/api/zone-keys";
import { useRouter } from "next/navigation";

export function useCreateCustomer(branchId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCustomer: CreateCustomerFormData) =>
      customerApi.createNewCustomer(newCustomer),
    onSuccess: () => {
      toast.success("Customer created successfully");
      queryClient.invalidateQueries({ queryKey: customerKeys.branchList(branchId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.logs() });
      queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });

      router.back();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

// 5. Update Customer
export function useUpdateCustomer() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateCustomerFormData> }) => customerApi.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      toast.success("Customer updated successfully");
      router.back();
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
      queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });
}
