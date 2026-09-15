import { useQuery } from "@tanstack/react-query";
import { displayPakistaniPhone } from "@/lib/utils/functions/setFormat";
import { customerKeys } from "./customer-keys";
import { customerApi } from "./customer.service";
import { formatCurrency } from "@/lib/utils/functions/setFormat";

// 2. Fetch All Customers for a Branch
export function useCustomers(
  branchId: string,
  tabFilter?: string,
  searchFilter?: string,
) {
  return useQuery({
    queryKey: customerKeys.branchList(branchId || ""),
    queryFn: () => customerApi.getAllCustomers(branchId),
    select: (customers) => {
      const activeCount = customers.filter((c) => c.status === "ACTIVE").length;
      const totalLedger = customers.reduce((sum, c) => sum + Number(c.customerCredit || 0), 0);
      const totalAssets = customers.reduce((sum, c) => sum + Number(c.returnablesLength || 0), 0)

      const filteredCustomers = customers.filter(customer => {
        let matchesTab = true;
        const credit = Number(customer.customerCredit || 0);
        if (tabFilter === "DEBT") {
          matchesTab = credit > 0;
        } else if (tabFilter === "CLEAR") {
          matchesTab = credit <= 0;
        }
        const matchesSearch = searchFilter
          ? customer.name.toLowerCase().includes(searchFilter.toLowerCase().trim())
          : true;

        return matchesTab && matchesSearch;
      });

      const customerOptions = customers
        .filter((c) => c.status === "ACTIVE")
        .map((c) => ({
          id: c.id,
          name: c.name,
          category: c.category,
          address: c.address || "No Address Provided",
          customerCredit: Number(c.customerCredit || 0),
          assetsHeld: Number(c.returnablesLength || 0),
          zoneName: c.zone?.name || "",
        }));

      return {
        customers: filteredCustomers,
        stats: {
          activeCount,
          totalLedger: formatCurrency(totalLedger),
          totalAssets,
        },
        customerOptions
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!branchId,
  });
}

// 3. Fetch Single Customer Details
export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id || ""),
    queryFn: () => customerApi.getCustomer(id),
    select: (customer) => {
      return {
        ...customer,
        phone: displayPakistaniPhone(customer.phone),
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

// 7. Activity Logs for Customers
export function useCustomerLogs(branchId: string) {
  return useQuery({
    queryKey: customerKeys.customerLogs(branchId),
    queryFn: () => customerApi.getCustomerLogs(branchId),
    enabled: !!branchId,
  });
}