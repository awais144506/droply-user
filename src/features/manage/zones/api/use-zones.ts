import { useQuery } from "@tanstack/react-query";
import { ZoneDetails } from "../types";
import { zoneKeys } from "./zone-keys";
import { zoneApi } from "./zone.service";
import { formatCurrency } from "@/lib/utils/functions/setFormat";
// 1. Fetch All Zones for a Branch
export function useZones(branchId: string, searchFilter?: string) {
    return useQuery({
        queryKey: zoneKeys.branchList(branchId || ""),
        queryFn: () => zoneApi.getAllZone(branchId),
        select: (zones: ZoneDetails[]) => {
            const enrichedZones = (zones || []).map((zone) => {
                const calculatedLedger = (zone.customers || []).reduce(
                    (sum, c) => sum + Number(c.customerCredit || 0),
                    0
                );
                const calculatedReturnables = (zone.customers || []).reduce(
                    (sum, c) => sum + Number(c.returnablesLength || 0),
                    0
                );

                return {
                    ...zone,
                    calculatedLedger,
                    calculatedReturnables,
                };
            });
            const filteredZones = searchFilter
                ? enrichedZones.filter((zone) =>
                    zone.name.toLowerCase().includes(searchFilter.toLowerCase().trim())
                )
                : enrichedZones;
            const totalZones = enrichedZones.length;
            const totalCustomers = filteredZones.reduce((acc, z) => acc + (z.customers?.length || 0), 0);
            const totalLedger = filteredZones.reduce((acc, z) => acc + z.calculatedLedger, 0);
            const totalReturnables = filteredZones.reduce((acc, z) => acc + z.calculatedReturnables, 0);

            const zoneOptions = zones.map(z => ({ value: z.id, label: z.name }));

            return {
                zones: filteredZones,
                zoneOptions,
                stats: {
                    totalZones,
                    totalCustomers,
                    totalLedger,
                    totalReturnables,
                },
            };
        },
        enabled: !!branchId,
    });
}

// 2. Fetch Single Zone (for Edit Page)
export function useZone(id: string, searchFilter?: string) {
    return useQuery({
        queryKey: zoneKeys.detail(id || ""),
        queryFn: () => zoneApi.getZone(id),
        select: (zone) => {

            const calculatedLedger = zone.customers.reduce((sum, l) => sum + Number(l.customerCredit || 0), 0);
            const calculatedReturnables = zone.customers.reduce((sum, l) => sum + Number(l.returnablesLength || 0), 0);
            const filterCustomer = searchFilter ? zone.customers.filter((c) => c.name.toLowerCase().includes(searchFilter.toLowerCase().trim())) : zone.customers;

            return {
                zone,
                filterCustomer,
                stats: {
                    calculatedLedger: formatCurrency(calculatedLedger),
                    calculatedReturnables,
                },
                hasCustomers: (zone.customers?.length || 0) > 0,
                hasLedger: (zone.calculatedLedger || 0) > 0,
                hasReturnables: (zone.calculatedReturnables || 0) > 0,
                hasRiders: (zone.riders?.length || 0) > 0,
            }
        },
        enabled: !!id,
    });
}


// 7. Activity Logs
export function useZoneLogs(branchId: string) {
    return useQuery({
        queryKey: zoneKeys.branchLogs(branchId || ""),
        queryFn: () => zoneApi.getZonelogs(branchId),
        enabled: !!branchId,
    });
}