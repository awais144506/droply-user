import { useQuery } from "@tanstack/react-query";
import { supplierApi } from "./supplier.service";
import { supplierKeys } from "./supplier-keys";

export function useSuppliers(branchId: string) {
  return useQuery({
    queryKey: supplierKeys.lists(branchId),
    queryFn: () => supplierApi.getAll(branchId),
    enabled: !!branchId,
  });
}

export function useSupplierDetail(id: string) {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => supplierApi.getById(id),
    enabled: !!id,
  });
}