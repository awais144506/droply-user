/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fleetKeys } from "./query-keys";
import { VehicleFormValues, VehicleExpenseFormValues } from "../schema/fleet.schema";
import { toast } from "sonner";
import { fleetApi } from "./fleet.service";

export function useCreateVehicle(branchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newVehicle: VehicleFormValues) => fleetApi.createVehicle(newVehicle),
    onMutate: async (newVehicle) => {
      await queryClient.cancelQueries({ queryKey: fleetKeys.vehicles.list({ branchId }) });
      const previousVehicles = queryClient.getQueryData(fleetKeys.vehicles.list({ branchId }));

      queryClient.setQueryData(fleetKeys.vehicles.list({ branchId }), (oldData: any) => {
        const optimisticVehicle = {
          ...newVehicle,
          id: `temp-${Date.now()}`,
          status: "ACTIVE"
        };
        return oldData ? [optimisticVehicle, ...oldData] : [optimisticVehicle];
      });

      return { previousVehicles };
    },
    onError: (err: any, newVehicle, context) => {
      toast.error(err.message || "Failed to create vehicle");
      if (context?.previousVehicles) {
        queryClient.setQueryData(fleetKeys.vehicles.list({ branchId }), context.previousVehicles);
      }
    },
    onSuccess: () => {
      toast.success("Vehicle registered successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.list({ branchId }) });
    },
  });
}

export function useUpdateVehicle(branchId: string, vehicleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<VehicleFormValues>) => fleetApi.updateVehicle(vehicleId, data),
    onSuccess: () => {
      toast.success("Vehicle updated successfully!");
      // Invalidate both the list and the specific detail page
      queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.list({ branchId }) });
      queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.detail(vehicleId) });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update vehicle.");
    },
  });
}

export function useDeleteVehicle(branchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => fleetApi.deleteVehicle(vehicleId),
    onSuccess: () => {
      toast.success("Vehicle deleted successfully.");
      queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.list({ branchId }) });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete vehicle.");
    },
  });
}

export function useCreateVehicleExpense(branchId: string, vehicleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newExpense: VehicleExpenseFormValues) => fleetApi.createVehicleExpense(newExpense),
    onSuccess: () => {
      toast.success("Expense logged successfully!");
      // Invalidate the detail page to refresh the table and the new odometer reading
      queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.detail(vehicleId) });
      queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.list({ branchId }) });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to log expense.");
    },
  });
}

export function useDeleteExpenseRecord(vehicleId: string, branchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fleetApi.deleteExpenseRecord(id),
    onSuccess: () => {
      toast.success("Expense deleted successfully!");
      queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.detail(vehicleId) });
      queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.list({ branchId }) });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to delete expense.");
    },
  });
}