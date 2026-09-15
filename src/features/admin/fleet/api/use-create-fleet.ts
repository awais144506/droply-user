/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fleetKeys } from "./query-keys";
import { VehicleFormValues } from "../schema/fleet.schema";
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
    onError: (err, newVehicle, context) => {
      toast.error(err.message);
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