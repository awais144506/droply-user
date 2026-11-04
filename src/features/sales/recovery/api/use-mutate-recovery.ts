/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { recoveryApi } from "./recovery.service";
import { recoveryKeys } from "./recovery-keys";
import {
  CreateRecoveryPayload,
  UpdateRecoveryPayload,
  CreateSaleReturnPayload,
  UpdateSaleReturnPayload,
} from "../types/recovery.types";
import { customerKeys } from "@/features/manage/customers/api/customer-keys";
import { productKeys } from "@/features/manage/products/api/product-keys";
import { zoneKeys } from "@/features/manage/zones/api/zone-keys";
import { wastageKeys } from "@/features/stock/wastage/api/wastage-keys";
import { orderKeys } from "../../orders/api/order-keys";

export function useMutateRecovery() {
  const queryClient = useQueryClient();

  // Helper to sync Recovery, Customer Khata/Returnables, Stock, and Wastage caches
  const invalidateRelatedCaches = () => {
    queryClient.invalidateQueries({ queryKey: recoveryKeys.all });
    queryClient.invalidateQueries({ queryKey: customerKeys.all });
    queryClient.invalidateQueries({ queryKey: productKeys.all });
    queryClient.invalidateQueries({ queryKey: zoneKeys.all});
    queryClient.invalidateQueries({ queryKey: orderKeys.all });
    queryClient.invalidateQueries({ queryKey: wastageKeys.all });
  };

  // ==========================================================================
  // 1. CUSTOMER RECOVERY MUTATIONS
  // ==========================================================================

  const createRecovery = useMutation({
    mutationFn: (payload: CreateRecoveryPayload) =>
      recoveryApi.createRecovery(payload),
    onSuccess: () => {
      toast.success("Customer recovery recorded successfully!");
      invalidateRelatedCaches();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to record customer recovery.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const updateRecovery = useMutation({
    mutationFn: (data: { id: string; payload: UpdateRecoveryPayload }) =>
      recoveryApi.updateRecovery(data),
    onSuccess: () => {
      toast.success("Recovery updated and balances recalculated!");
      invalidateRelatedCaches();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update customer recovery.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const deleteRecovery = useMutation({
    mutationFn: (id: string) => recoveryApi.deleteRecovery(id),
    onSuccess: () => {
      toast.success("Recovery deleted and all ledger/stock balances reversed!");
      invalidateRelatedCaches();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete recovery.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  // ==========================================================================
  // 2. SALE RETURN MUTATIONS
  // ==========================================================================

  const createSaleReturn = useMutation({
    mutationFn: (payload: CreateSaleReturnPayload) =>
      recoveryApi.createSaleReturn(payload),
    onSuccess: () => {
      toast.success("Sale return processed successfully!");
      invalidateRelatedCaches();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to process sale return.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const updateSaleReturn = useMutation({
    mutationFn: (data: { id: string; payload: UpdateSaleReturnPayload }) =>
      recoveryApi.updateSaleReturn(data),
    onSuccess: () => {
      toast.success("Sale return updated and stock/ledger adjusted!");
      invalidateRelatedCaches();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update sale return.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const deleteSaleReturn = useMutation({
    mutationFn: (id: string) => recoveryApi.deleteSaleReturn(id),
    onSuccess: () => {
      toast.success("Sale return deleted and all changes reversed!");
      invalidateRelatedCaches();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete sale return.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  return {
    createRecovery,
    updateRecovery,
    deleteRecovery,
    createSaleReturn,
    updateSaleReturn,
    deleteSaleReturn,
  };
}