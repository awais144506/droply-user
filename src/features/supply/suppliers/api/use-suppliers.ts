import { useQuery } from "@tanstack/react-query";
import { supplierApi } from "./supplier.service";
import { supplierKeys } from "./supplier-keys";

export function useSuppliers(branchId: string, search?: string, status?: string) {
  return useQuery({
    queryKey: supplierKeys.lists(branchId),
    queryFn: () => supplierApi.getAll(branchId),
    select: (allSuppliers) => {
      // 1. Calculate stats and options on ALL suppliers
      const supplierOptions = allSuppliers.map(s => ({
        label: s.firmName,
        value: s.id,
        name: s.supplierName,
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
          s.supplierName?.toLowerCase().includes(lowerSearch)
        );
      }

      return {
        suppliers: filteredSuppliers,
        supplierOptions,
        totalDueAmount,
      };
    },
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