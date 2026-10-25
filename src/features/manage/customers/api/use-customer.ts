/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { customerKeys } from "./customer-keys";
import { customerApi } from "./customer.service";
import { formatCurrency } from "@/lib/utils/functions/setFormat";

export function useCustomers(
  branchId: string,
  tabFilter?: string,
  searchFilter?: string,
  scheduleFilter?: string,
) {
  const selectCustomers = useCallback(
    (payload: Awaited<ReturnType<typeof customerApi.getAllCustomers>>) => {
      const customers = payload?.customer || [];
      const logs = payload?.logs || [];
      const newCustomerRequest = payload?.newCustomerRequest || [];

      const cleanSearch = searchFilter?.toLowerCase().trim() || "";
      const rawDigits = cleanSearch.replace(/\D/g, "");
      const adjustedSearchDigits = rawDigits.startsWith("0")
        ? rawDigits.slice(1)
        : rawDigits;

      let activeCount = 0;
      let totalLedger = 0;
      let totalAssets = 0;

      const filteredCustomers: typeof customers = [];
      const customerOptions: any[] = [];

      for (const customer of customers) {
        const credit = Number(customer.customerCredit || 0);
        const assets = Number(customer.returnablesLength || 0);

        totalLedger += credit;
        totalAssets += assets;

        if (customer.status === "ACTIVE") {
          activeCount++;
          customerOptions.push({
            value: customer.id,
            label: customer.name,
            phone: customer.phone,
            email: customer.email ?? null,
            category: customer.category,
            ntn: customer.ntn ?? null,
            strn: customer.strn ?? null,
            address: customer.address || "No Address Provided",
            customerCredit: credit,
            assetsHeld: assets,
            zoneName: customer.zone?.name || "",
          });
        }

        // 1. Tab Filter (Debt / Clear)
        const matchesTab =
          tabFilter === "DEBT"
            ? credit > 0
            : tabFilter === "CLEAR"
              ? credit <= 0
              : true;

        if (!matchesTab) continue;

        // 2. Schedule Filter (Everyday, Custom Days, On-Demand)
        if (scheduleFilter && scheduleFilter !== "all") {
          if (customer.deliveryScheduleType !== scheduleFilter) continue;
        }

        // 3. Search Filter (Name, Code, Phone)
        if (cleanSearch) {
          const phoneDigits = customer.phone
            ? customer.phone.replace(/\D/g, "")
            : "";
          const matchesName = customer.name.toLowerCase().includes(cleanSearch);
          const matchesCode = customer.customerCode
            ?.toLowerCase()
            .includes(cleanSearch);
          const matchesPhone =
            adjustedSearchDigits.length > 0 &&
            phoneDigits.includes(adjustedSearchDigits);

          if (!matchesName && !matchesCode && !matchesPhone) continue;
        }

        filteredCustomers.push(customer);
      }

      return {
        customers: filteredCustomers,
        stats: {
          activeCount,
          totalLedger: formatCurrency(totalLedger),
          totalAssets,
        },
        customerOptions,
        logs,
        newCustomerRequest,
      };
    },
    [tabFilter, searchFilter, scheduleFilter], // 👈 Added scheduleFilter dependency
  );

  return useQuery({
    queryKey: [...customerKeys.branchList(branchId || ""), tabFilter, searchFilter, scheduleFilter],
    queryFn: () => customerApi.getAllCustomers(),
    select: selectCustomers,
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(branchId),
  });
}

// 2. Fetch Single Customer Details
export function useCustomer(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: customerKeys.detail(id || ""),
    queryFn: () => customerApi.getCustomer(id),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(id),
    placeholderData: () => {
      const cachedLists = queryClient.getQueriesData<any>({
        queryKey: customerKeys.lists(),
      });

      for (const [, data] of cachedLists) {
        const found = data?.customer?.find((c: any) => c.id === id);
        if (found) {
          return {
            ...found,
            orders: [],
            returnables: [],
          } as any;
        }
      }
      return undefined;
    },
  });
}
