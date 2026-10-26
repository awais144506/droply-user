/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fleetKeys } from "./query-keys";
import { VehicleFormValues, VehicleExpenseFormValues } from "../schema/fleet.schema";
import { toast } from "sonner";
import { fleetApi } from "./fleet.service";
import { useRouter } from "next/navigation";

export function useCreateVehicle(branchId: string) {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: (newVehicle: VehicleFormValues) => fleetApi.createVehicle(newVehicle),
        onSuccess: () => {
            toast.success("Vehicle registered successfully!");
            queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.lists(branchId) });
            router.back();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || err.message || "Failed to create vehicle");
        },
    });
}

export function useUpdateVehicle(branchId: string, vehicleId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<VehicleFormValues>) => fleetApi.updateVehicle(vehicleId, data),
        onSuccess: () => {
            toast.success("Vehicle updated successfully!");
            queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.lists(branchId) });
            queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.detail(vehicleId) });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || err.message || "Failed to update vehicle.");
        },
    });
}

export function useDeleteVehicle(branchId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (vehicleId: string) => fleetApi.deleteVehicle(vehicleId),
        onSuccess: () => {
            toast.success("Vehicle deleted successfully.");
            queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.lists(branchId) });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || err.message || "Failed to delete vehicle.");
        },
    });
}

export function useCreateVehicleExpense(branchId: string, vehicleId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newExpense: VehicleExpenseFormValues) => fleetApi.createVehicleExpense(newExpense),
        onSuccess: () => {
            toast.success("Expense logged successfully!");
            queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.detail(vehicleId) });
            queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.lists(branchId) });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || err.message || "Failed to log expense.");
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
            queryClient.invalidateQueries({ queryKey: fleetKeys.vehicles.lists(branchId) });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || err.message || "Failed to delete expense.");
        },
    });
}