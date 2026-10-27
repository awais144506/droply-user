/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supplierApi } from "./supplier.service";
import { supplierKeys } from "./supplier-keys";

export function useSuppliers(branchId: string, search?: string, status?: string) {
  return useQuery({
    queryKey: supplierKeys.lists(branchId),
    queryFn: () => supplierApi.getAll(),
    select: (allSuppliers) => {
      // 1. Calculate stats and options on ALL suppliers
      const supplierOptions = allSuppliers.map(s => ({
        label: s.firmName,
        value: s.id,
        name: s.name,
      })) || [];

      const totalDueAmount = allSuppliers.reduce((sum, s) => sum + (s.payableBalance || 0), 0);

      // 2. Filter the array specifically for the table view
      let filteredSuppliers = allSuppliers;

      if (status === "DEBT") {
        filteredSuppliers = filteredSuppliers.filter(s => (s.payableBalance || 0) > 0);
      } else if (status === "CLEAR") {
        filteredSuppliers = filteredSuppliers.filter(s => (s.payableBalance || 0) <= 0);
      }

      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredSuppliers = filteredSuppliers.filter(s =>
          s.firmName?.toLowerCase().includes(lowerSearch) ||
          s.name?.toLowerCase().includes(lowerSearch)
        );
      }

      return {
        suppliers: filteredSuppliers,
        supplierOptions,
        totalDueAmount,
        rawSuppliers: allSuppliers, // 👈 Kept accessible in cache for initialData lookup
      };
    },
    enabled: !!branchId,
  });
}

export function useSupplierDetail(branchId: string, id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => supplierApi.getById(id),
    enabled: !!id && !!branchId,
    initialData: () => {
      // 1. Grab the cached list payload from useSuppliers
      const cachedData = queryClient.getQueryData<any>(
        supplierKeys.lists(branchId || "")
      );

      const foundSupplier = cachedData?.rawSuppliers?.find((s: any) => s.id === id) ||
        cachedData?.suppliers?.find((s: any) => s.id === id);

      return foundSupplier ? foundSupplier : undefined;
    },
    staleTime: 1000 * 60 * 2,
  });
}